import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  BackHandler,
  Platform,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { router, usePathname } from "expo-router";
import type Animated from "react-native-reanimated";
import { TourOverlay, type Box } from "./tour-overlay";
import { APP_TOUR, guideById, type Guide } from "../content/guides";
import { markGuideDone } from "../domain/learn-progress";
import { useLearnState } from "../platform/learn-state";
import { useReducedMotion } from "../platform/reduced-motion";
import { motion } from "../theme/motion";

type Api = {
  start: (guideId: string) => void;
  stop: () => void;
  active: string | null;
  register: (
    id: string,
    ref: RefObject<ComponentRef<typeof View> | null>,
  ) => () => void;
};
const Context = createContext<Api>({
  start: () => {},
  stop: () => {},
  active: null,
  register: () => () => {},
});
export const useTour = () => useContext(Context);

/** Marks an element a guide step can spotlight. Adds one wrapper View and no styling. */
export function TourTarget({
  id,
  children,
  style,
}: {
  id: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { register } = useContext(Context),
    ref = useRef<ComponentRef<typeof View>>(null);
  useEffect(() => register(id, ref), [id, register]);
  return (
    <View ref={ref} collapsable={false} style={style}>
      {children}
    </View>
  );
}

export function TourProvider({ children }: { children: ReactNode }) {
  const learn = useLearnState(),
    pathname = usePathname(),
    targets = useRef(
      new Map<string, RefObject<ComponentRef<typeof View> | null>>(),
    ),
    overlay = useRef<ComponentRef<typeof Animated.View>>(null),
    [run, setRun] = useState<{ guide: Guide; index: number } | null>(null),
    [measured, setMeasured] = useState<{ key: string; box: Box | null } | null>(
      null,
    ),
    [leaving, setLeaving] = useState<typeof run>(null),
    // Keep the last run mounted briefly so the scrim and card can animate out.
    shown = run ?? leaving,
    exiting = !run && !!leaving,
    stepKey = shown ? `${shown.guide.id}:${shown.index}` : "",
    // A measurement only applies to the step it was taken for.
    hole = measured?.key === stepKey ? measured.box : null,
    step = shown?.guide.steps[shown.index],
    // Hold the card back until its target is found or the search gives up, so it never jumps.
    ready = !step?.target || measured?.key === stepKey;

  // Bumped when the wanted target mounts, so a slow screen is picked up the moment it renders.
  const wanted = useRef<string | undefined>(undefined),
    [arrivals, setArrivals] = useState(0);

  const register = useCallback<Api["register"]>((id, ref) => {
    targets.current.set(id, ref);
    if (wanted.current === id) setArrivals((n) => n + 1);
    return () => {
      if (targets.current.get(id) === ref) targets.current.delete(id);
    };
  }, []);

  const start = useCallback((guideId: string) => {
    const guide = guideById(guideId);
    if (guide) {
      setLeaving(null);
      setRun({ guide, index: 0 });
    }
  }, []);

  const reduced = useReducedMotion();
  // Unmount the exiting overlay once its fade has played.
  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(
      () => setLeaving(null),
      reduced ? 0 : motion.tourScrimOutMs,
    );
    return () => clearTimeout(timer);
  }, [leaving, reduced]);
  const end = useCallback(() => {
    setLeaving(run);
    setRun(null);
  }, [run]);

  const stop = useCallback(() => {
    if (run?.guide.id === APP_TOUR)
      void learn.update((st) => ({ ...st, prompted: true }));
    end();
  }, [run, learn, end]);

  const finish = useCallback(() => {
    if (!run) return;
    void learn.update((st) => markGuideDone(st, run.guide.id));
    end();
    router.navigate("/learn" as never);
  }, [run, learn, end]);

  const go = (delta: number) =>
    setRun((r) =>
      r
        ? {
            ...r,
            index: Math.max(
              0,
              Math.min(r.guide.steps.length - 1, r.index + delta),
            ),
          }
        : r,
    );

  // Show the step's screen, then spotlight its target once it has laid out.
  // A missing or off-screen target falls back to a centred card, never a dead end.
  const guideId = run?.guide.id,
    index = run?.index;
  useEffect(() => {
    if (!guideId || index === undefined) return;
    const current = guideById(guideId)?.steps[index];
    if (!current) return;
    if (current.route && current.route !== pathname)
      router.navigate(current.route as never);
    const id = current.target;
    wanted.current = id;
    if (!id) return;
    let cancelled = false,
      tries = 0,
      timer: ReturnType<typeof setTimeout>,
      settled = false;
    const key = `${guideId}:${index}`;
    const retry = () => {
      if (cancelled) return;
      tries += 1;
      // After ~1.5s show the step centred; keep looking in case the screen is slow.
      if (tries === 15)
        setMeasured((m) => (m?.key === key ? m : { key, box: null }));
      if (tries < 40) timer = setTimeout(measure, 100);
    };
    function measure() {
      const view = targets.current.get(id!)?.current,
        root = overlay.current;
      if (!view || !root) return retry();
      root.measureInWindow((ox, oy, ow, oh) =>
        view.measureInWindow((x, y, w, h) => {
          if (cancelled) return;
          if (!(w > 0 && h > 0 && ow > 0)) return retry();
          const box = { x: x - ox, y: y - oy, w, h },
            visible =
              box.y >= -2 &&
              box.y + box.h <= oh + 2 &&
              box.x + box.w > 0 &&
              box.x < ow;
          setMeasured({
            key: `${guideId}:${index}`,
            box: visible ? box : null,
          });
          // One late re-measure catches layout that settles after navigation.
          if (!settled) {
            settled = true;
            timer = setTimeout(measure, 450);
          }
        }),
      );
    }
    measure();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [guideId, index, pathname, arrivals]);

  useEffect(() => {
    if (!run) return;
    if (Platform.OS === "web") {
      const key = (event: KeyboardEvent) => {
        if (event.key === "Escape") stop();
      };
      window.addEventListener("keydown", key);
      return () => window.removeEventListener("keydown", key);
    }
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      stop();
      return true;
    });
    return () => sub.remove();
  }, [run, stop]);

  const last = !!run && run.index === run.guide.steps.length - 1;
  const api = useMemo(
    () => ({ start, stop, active: run?.guide.id ?? null, register }),
    [start, stop, run?.guide.id, register],
  );

  return (
    <Context.Provider value={api}>
      <View style={{ flex: 1 }}>
        {children}
        {shown && step ? (
          <TourOverlay
            overlayRef={overlay}
            guide={shown.guide}
            index={shown.index}
            hole={hole}
            ready={ready}
            exiting={exiting}
            level={learn.state.level}
            onLevel={(level) => void learn.update((st) => ({ ...st, level }))}
            onBack={() => go(-1)}
            onNext={() => (last ? finish() : go(1))}
            onClose={stop}
          />
        ) : null}
      </View>
    </Context.Provider>
  );
}
