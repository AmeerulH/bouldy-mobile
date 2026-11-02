import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
  type RefObject,
} from "react";
import { BackHandler, Platform, View } from "react-native";
import { router } from "expo-router";
import type Animated from "react-native-reanimated";
import { TourContext, type TourApi } from "./tour-context";
import { TourOverlay, type Box } from "./tour-overlay";
import { APP_TOUR, guideById, type Guide } from "../content/guides";
import { demoLog, demoMet, type DemoAttempts } from "../content/demo";
import type { RouteState } from "../features/session-state";
import { markGuideDone } from "../domain/learn-progress";
import { useLearnState } from "../platform/learn-state";
import { useReducedMotion } from "../platform/reduced-motion";
import { motion } from "../theme/motion";

export { TourTarget, useTour } from "./tour-context";

export function TourProvider({ children }: { children: ReactNode }) {
  const learn = useLearnState(),
    targets = useRef(
      new Map<string, RefObject<ComponentRef<typeof View> | null>>(),
    ),
    overlay = useRef<ComponentRef<typeof Animated.View>>(null),
    [run, setRun] = useState<{ guide: Guide; index: number } | null>(null),
    [measured, setMeasured] = useState<{ key: string; box: Box | null } | null>(
      null,
    ),
    // Practice taps on the sample screens. Never saved, reset whenever a guide starts.
    [attempts, setAttempts] = useState<DemoAttempts>({}),
    [pending, setPending] = useState<{ id: number; intent: string } | null>(
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
    ready = !step?.target || measured?.key === stepKey,
    // Re-measure when a practice action lands: the row's buttons rearrange around the target.
    met = demoMet(step, attempts);

  // Bumped when the wanted target mounts, so a slow screen is picked up the moment it renders.
  const wanted = useRef<string | undefined>(undefined),
    [arrivals, setArrivals] = useState(0);

  const register = useCallback<TourApi["register"]>((id, ref) => {
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
      setAttempts({});
      setPending(null);
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

  // Spotlight the step's target once the practice screen has laid out.
  // A missing or off-screen target falls back to a centred card, never a dead end.
  const guideId = run?.guide.id,
    index = run?.index;
  useEffect(() => {
    if (!guideId || index === undefined) return;
    const current = guideById(guideId)?.steps[index];
    if (!current) return;
    // Once a practice action lands, its button may be gone, so show the whole route row.
    const id =
      current.expect && met
        ? `demo-row-${current.expect.route}`
        : current.target;
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
  }, [guideId, index, arrivals, met]);

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

  const practice = useCallback(async (state: RouteState, intent: string) => {
    setPending({ id: state.route.id, intent });
    // A short wait stands in for saving, so the pressed button's feedback is visible.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setAttempts((a) => demoLog(a, state.route.id, intent));
    setPending(null);
  }, []);
  const last = !!run && run.index === run.guide.steps.length - 1;
  const api = useMemo(
    () => ({ start, stop, active: run?.guide.id ?? null, register }),
    [start, stop, run?.guide.id, register],
  );

  return (
    <TourContext.Provider value={api}>
      <View style={{ flex: 1 }}>
        {children}
        {shown && step ? (
          <TourOverlay
            overlayRef={overlay}
            guide={shown.guide}
            index={shown.index}
            hole={hole}
            ready={ready}
            attempts={attempts}
            pending={pending}
            onPractice={practice}
            met={met}
            exiting={exiting}
            level={learn.state.level}
            onLevel={(level) => void learn.update((st) => ({ ...st, level }))}
            onBack={() => go(-1)}
            onNext={() => (last ? finish() : go(1))}
            onClose={stop}
          />
        ) : null}
      </View>
    </TourContext.Provider>
  );
}
