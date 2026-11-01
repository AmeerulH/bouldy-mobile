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
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { router, usePathname } from "expo-router";
import Svg, { Path, Rect } from "react-native-svg";
import { Button, Heading, IconButton, T } from "./primitives";
import { LevelChips } from "./learn";
import { APP_TOUR, guideById, type Guide } from "../content/guides";
import { markGuideDone } from "../domain/learn-progress";
import { useLearnState } from "../platform/learn-state";
import { colors as c } from "../theme/colors";

type Box = { x: number; y: number; w: number; h: number };
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

const PAD = 8,
  RADIUS = 14,
  GAP = 12,
  MARGIN = 16;

function dimPath(w: number, h: number, hole: Box | null) {
  const outer = `M0 0H${w}V${h}H0Z`;
  if (!hole) return outer;
  const { x, y, w: hw, h: hh } = hole,
    r = Math.min(RADIUS, hw / 2, hh / 2);
  return (
    `${outer}M${x + r} ${y}H${x + hw - r}A${r} ${r} 0 0 1 ${x + hw} ${y + r}` +
    `V${y + hh - r}A${r} ${r} 0 0 1 ${x + hw - r} ${y + hh}H${x + r}` +
    `A${r} ${r} 0 0 1 ${x} ${y + hh - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
  );
}

export function TourProvider({ children }: { children: ReactNode }) {
  const learn = useLearnState(),
    pathname = usePathname(),
    targets = useRef(
      new Map<string, RefObject<ComponentRef<typeof View> | null>>(),
    ),
    overlay = useRef<ComponentRef<typeof View>>(null),
    [run, setRun] = useState<{ guide: Guide; index: number } | null>(null),
    [measured, setMeasured] = useState<{ key: string; box: Box | null } | null>(
      null,
    ),
    [size, setSize] = useState({ w: 0, h: 0 }),
    stepKey = run ? `${run.guide.id}:${run.index}` : "",
    // A measurement only applies to the step it was taken for.
    hole = measured?.key === stepKey ? measured.box : null,
    step = run?.guide.steps[run.index],
    // Hold the card back until its target is found or the search gives up, so it never jumps.
    ready = !step?.target || measured?.key === stepKey,
    last = !!run && run.index === run.guide.steps.length - 1;

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
    if (guide) setRun({ guide, index: 0 });
  }, []);

  const stop = useCallback(() => {
    if (run?.guide.id === APP_TOUR)
      void learn.update((st) => ({ ...st, prompted: true }));
    setRun(null);
  }, [run, learn]);

  const finish = useCallback(() => {
    if (!run) return;
    void learn.update((st) => markGuideDone(st, run.guide.id));
    setRun(null);
    router.navigate("/learn" as never);
  }, [run, learn]);

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

  const api = useMemo(
    () => ({ start, stop, active: run?.guide.id ?? null, register }),
    [start, stop, run?.guide.id, register],
  );

  const box = hole
      ? {
          x: Math.max(0, hole.x - PAD),
          y: Math.max(0, hole.y - PAD),
          w: hole.w + PAD * 2,
          h: hole.h + PAD * 2,
        }
      : null,
    cardWidth = Math.min(size.w - MARGIN * 2, 360),
    below = box ? box.y + box.h / 2 < size.h / 2 : false,
    placement: ViewStyle = box
      ? {
          position: "absolute",
          width: cardWidth,
          left: Math.max(
            MARGIN,
            Math.min(
              box.x + box.w / 2 - cardWidth / 2,
              size.w - cardWidth - MARGIN,
            ),
          ),
          ...(below
            ? { top: box.y + box.h + GAP }
            : { bottom: size.h - box.y + GAP }),
        }
      : { width: cardWidth, alignSelf: "center" };

  return (
    <Context.Provider value={api}>
      <View style={{ flex: 1 }}>
        {children}
        {run && step ? (
          <View
            ref={overlay}
            onLayout={(e) =>
              setSize({
                w: e.nativeEvent.layout.width,
                h: e.nativeEvent.layout.height,
              })
            }
            // Swallow touches so the screen underneath cannot be used mid-guide.
            onStartShouldSetResponder={() => true}
            accessibilityViewIsModal
            style={[
              StyleSheet.absoluteFill,
              { zIndex: 100, elevation: 100, justifyContent: "center" },
            ]}
          >
            {size.w > 0 ? (
              <Svg
                width={size.w}
                height={size.h}
                pointerEvents="none"
                style={StyleSheet.absoluteFill}
              >
                <Path
                  d={dimPath(size.w, size.h, box)}
                  fill="rgba(13,13,13,0.72)"
                  fillRule="evenodd"
                />
                {box ? (
                  <Rect
                    x={box.x}
                    y={box.y}
                    width={box.w}
                    height={box.h}
                    rx={RADIUS}
                    fill="none"
                    stroke={c.bg}
                    strokeWidth={2}
                  />
                ) : null}
              </Svg>
            ) : null}
            <View
              accessibilityLiveRegion="polite"
              style={[
                {
                  backgroundColor: c.bg,
                  borderRadius: 16,
                  padding: 20,
                  gap: 12,
                  opacity: ready ? 1 : 0,
                },
                placement,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  {run.index > 0 ? (
                    <IconButton
                      name="back"
                      label="Previous step"
                      onPress={() => go(-1)}
                    />
                  ) : null}
                  <T size={13} weight={600} color={c["ink-muted"]}>
                    {`${run.index + 1} of ${run.guide.steps.length}`}
                  </T>
                </View>
                <IconButton name="close" label="Close guide" onPress={stop} />
              </View>
              <Heading size={28} style={{ lineHeight: 30 }}>
                {step.title}
              </Heading>
              <T size={16} style={{ lineHeight: 24 }} color={c["ink-muted"]}>
                {step.body}
              </T>
              {step.choice === "level" ? (
                <View style={{ gap: 8 }}>
                  <T size={13} weight={600}>
                    How much climbing have you done?
                  </T>
                  <LevelChips
                    level={learn.state.level}
                    onChange={(level) =>
                      void learn.update((st) => ({ ...st, level }))
                    }
                  />
                </View>
              ) : null}
              <Button onPress={last ? finish : () => go(1)}>
                {last ? "Done" : "Next"}
              </Button>
            </View>
          </View>
        ) : null}
      </View>
    </Context.Provider>
  );
}
