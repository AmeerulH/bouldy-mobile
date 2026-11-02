import { useEffect, useState, type ComponentRef, type Ref } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import Animated, {
  cubicBezier,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
  type CSSAnimationProperties,
} from "react-native-reanimated";
import Svg, { Path, Rect } from "react-native-svg";
import { Button, Heading, Icon, IconButton, T } from "./primitives";
import { DemoStage } from "./tour-demo";
import { LevelChips } from "./learn";
import type { Guide, Mark } from "../content/guides";
import type { DemoAttempts } from "../content/demo";
import type { RouteState } from "../features/session-state";
import type { Level } from "../content/learn";
import { useReducedMotion } from "../platform/reduced-motion";
import { colors as c } from "../theme/colors";
import { motion } from "../theme/motion";

export type Box = { x: number; y: number; w: number; h: number };

const AnimatedPath = Animated.createAnimatedComponent(Path),
  AnimatedRect = Animated.createAnimatedComponent(Rect),
  PAD = 8,
  RADIUS = 14,
  GAP = 12,
  MARGIN = 16,
  curve = cubicBezier(...motion.easeOut),
  move = Easing.bezierFn(...motion.easeInOut);

type Motion = Partial<CSSAnimationProperties<ViewStyle>>;

/**
 * The scrim and its cut-out. The cut-out glides between targets (ease-in-out,
 * it is on-screen movement) and closes to nothing for centred steps. Only an SVG
 * path and a stroke opacity animate, so no layout work happens per frame.
 */
function Spotlight({
  w,
  h,
  box,
  reduced,
}: {
  w: number;
  h: number;
  box: Box | null;
  reduced: boolean;
}) {
  // Start collapsed at the centre so the first cut-out opens rather than appears.
  const x = useSharedValue(w / 2),
    y = useSharedValue(h / 2),
    bw = useSharedValue(0),
    bh = useSharedValue(0),
    ring = useSharedValue(0),
    tx = box ? box.x : w / 2,
    ty = box ? box.y : h / 2,
    tw = box ? box.w : 0,
    th = box ? box.h : 0;
  useEffect(() => {
    const config = { duration: reduced ? 0 : motion.tourMoveMs, easing: move };
    x.set(withTiming(tx, config));
    y.set(withTiming(ty, config));
    bw.set(withTiming(tw, config));
    bh.set(withTiming(th, config));
    ring.set(withTiming(tw > 0 ? 1 : 0, { duration: reduced ? 0 : 200 }));
  }, [tx, ty, tw, th, reduced, x, y, bw, bh, ring]);
  const pathProps = useAnimatedProps(() => {
      const X = x.get(),
        Y = y.get(),
        W = bw.get(),
        H = bh.get(),
        r = Math.min(RADIUS, W / 2, H / 2);
      return {
        d:
          `M0 0H${w}V${h}H0Z` +
          `M${X + r} ${Y}H${X + W - r}A${r} ${r} 0 0 1 ${X + W} ${Y + r}` +
          `V${Y + H - r}A${r} ${r} 0 0 1 ${X + W - r} ${Y + H}H${X + r}` +
          `A${r} ${r} 0 0 1 ${X} ${Y + H - r}V${Y + r}A${r} ${r} 0 0 1 ${X + r} ${Y}Z`,
      };
    }),
    ringProps = useAnimatedProps(() => ({
      x: x.get(),
      y: y.get(),
      width: bw.get(),
      height: bh.get(),
      strokeOpacity: ring.get(),
    }));
  return (
    <Svg
      width={w}
      height={h}
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <AnimatedPath
        animatedProps={pathProps}
        fill="rgba(13,13,13,0.72)"
        fillRule="evenodd"
      />
      <AnimatedRect
        animatedProps={ringProps}
        rx={RADIUS}
        fill="none"
        stroke={c.bg}
        strokeWidth={2}
      />
    </Svg>
  );
}

/** Segmented progress: each segment fills with a transform, not a width. */
function Progress({
  index,
  count,
  reduced,
}: {
  index: number;
  count: number;
  reduced: boolean;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Guide progress"
      accessibilityValue={{ min: 1, max: count, now: index + 1 }}
      style={{ flexDirection: "row", gap: 4 }}
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: c.hairline,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: c.accent,
              transformOrigin: "left center",
              transform: [{ scaleX: i <= index ? 1 : 0 }],
              transitionProperty: "transform",
              transitionDuration: reduced ? "0ms" : "220ms",
              transitionTimingFunction: curve,
            }}
          />
        </View>
      ))}
    </View>
  );
}

/** One mark from a route row, drawn the way it looks in the list. */
function MarkGlyph({ mark }: { mark: Mark }) {
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: c.hairline,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {mark === "try" ? (
        <T weight={700}>+1</T>
      ) : (
        <Icon
          name={mark === "send" ? "check" : mark === "flash" ? "flash" : "next"}
          color={c.ink}
          size={18}
        />
      )}
    </View>
  );
}

export function TourOverlay({
  overlayRef,
  guide,
  index,
  hole,
  ready,
  attempts,
  pending,
  onPractice,
  met,
  exiting,
  level,
  onLevel,
  onBack,
  onNext,
  onClose,
}: {
  overlayRef: Ref<ComponentRef<typeof Animated.View>>;
  guide: Guide;
  index: number;
  hole: Box | null;
  ready: boolean;
  attempts: DemoAttempts;
  pending: { id: number; intent: string } | null;
  onPractice: (state: RouteState, intent: string) => Promise<void>;
  /** The step's practice action is done (or it has none). */
  met: boolean;
  exiting: boolean;
  level: Level | null;
  onLevel: (level: Level) => void;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}) {
  const reduced = useReducedMotion(),
    [size, setSize] = useState({ w: 0, h: 0 }),
    [measuredCard, setMeasuredCard] = useState({ key: "", h: 0 }),
    cardKey = `${guide.id}:${index}`,
    // The card's own height, once laid out, decides which side of the spotlight it fits on.
    cardH = measuredCard.key === cardKey ? measuredCard.h : 0,
    step = guide.steps[index],
    last = index === guide.steps.length - 1,
    box = hole
      ? {
          x: Math.max(0, hole.x - PAD),
          y: Math.max(0, hole.y - PAD),
          w: hole.w + PAD * 2,
          h: hole.h + PAD * 2,
        }
      : null,
    cardWidth = Math.min(size.w - MARGIN * 2, 360),
    spaceBelow = box ? size.h - (box.y + box.h) - GAP - MARGIN : 0,
    spaceAbove = box ? box.y - GAP - MARGIN : 0,
    below = box
      ? cardH
        ? spaceBelow >= cardH ||
          (spaceAbove < cardH && spaceBelow >= spaceAbove)
        : box.y + box.h / 2 < size.h / 2
      : false,
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
            ? {
                top: Math.min(
                  box.y + box.h + GAP,
                  cardH ? size.h - cardH - MARGIN : Infinity,
                ),
              }
            : {
                bottom: Math.min(
                  size.h - box.y + GAP,
                  cardH ? size.h - cardH - MARGIN : Infinity,
                ),
              }),
        }
      : { width: cardWidth, alignSelf: "center" },
    interactive = !!step.expect && !!box,
    // The scrim fades in (200ms) and out faster (150ms). Reduced motion keeps the fade only.
    scrim: Motion = {
      animationName: exiting
        ? { to: { opacity: 0 } }
        : { from: { opacity: 0 } },
      animationDuration: `${exiting ? motion.tourScrimOutMs : motion.tourScrimInMs}ms`,
      animationTimingFunction: exiting ? "ease-in" : curve,
      animationFillMode: "forwards",
    },
    // The card rises out of the spotlight it describes: from the target's side, small, never from zero.
    enter: Motion = reduced
      ? {
          animationName: { from: { opacity: 0 } },
          animationDuration: "120ms",
          animationFillMode: "backwards",
        }
      : {
          animationName: {
            from: {
              opacity: 0,
              transform: [
                { translateY: box ? (below ? -8 : 8) : 8 },
                { scale: 0.96 },
              ],
            },
          },
          animationDuration: `${motion.tourCardMs}ms`,
          animationTimingFunction: curve,
          animationFillMode: "backwards",
        };

  return (
    <Animated.View
      ref={overlayRef}
      onLayout={(e) =>
        setSize({
          w: e.nativeEvent.layout.width,
          h: e.nativeEvent.layout.height,
        })
      }
      // Swallow touches so the practice screen cannot be used mid-guide, except the
      // highlighted control on a step that asks the user to try it.
      onStartShouldSetResponder={() => !interactive}
      accessibilityViewIsModal
      style={[
        StyleSheet.absoluteFill,
        { zIndex: 100, elevation: 100, justifyContent: "center" },
        scrim,
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
        <DemoStage
          scene={step.scene}
          sheet={!!step.sheet}
          attempts={attempts}
          pending={pending}
          onPractice={onPractice}
        />
      </View>
      {interactive && box ? (
        <>
          {[
            { left: 0, top: 0, width: size.w, height: box.y },
            { left: 0, top: box.y + box.h, width: size.w, bottom: 0 },
            { left: 0, top: box.y, width: box.x, height: box.h },
            { left: box.x + box.w, top: box.y, right: 0, height: box.h },
          ].map((area, i) => (
            <View
              key={i}
              onStartShouldSetResponder={() => true}
              style={[{ position: "absolute" }, area]}
            />
          ))}
        </>
      ) : null}
      {size.w > 0 ? (
        <Spotlight w={size.w} h={size.h} box={box} reduced={reduced} />
      ) : null}
      {ready ? (
        // Keyed by step so every step replays the entrance with its new position.
        <Animated.View
          key={cardKey}
          onLayout={(e) =>
            setMeasuredCard({ key: cardKey, h: e.nativeEvent.layout.height })
          }
          accessibilityLiveRegion="polite"
          style={[
            {
              backgroundColor: c.bg,
              borderRadius: 16,
              padding: 20,
              gap: 12,
              transformOrigin: box
                ? below
                  ? "50% 0%"
                  : "50% 100%"
                : "50% 50%",
            },
            placement,
            enter,
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
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {index > 0 ? (
                <IconButton
                  name="back"
                  label="Previous step"
                  onPress={onBack}
                />
              ) : null}
              <T size={13} weight={600} color={c["ink-muted"]}>
                {`${index + 1} of ${guide.steps.length}`}
              </T>
            </View>
            <IconButton name="close" label="Close guide" onPress={onClose} />
          </View>
          <Progress
            index={index}
            count={guide.steps.length}
            reduced={reduced}
          />
          <Heading size={28} style={{ lineHeight: 30 }}>
            {step.title}
          </Heading>
          <T size={16} style={{ lineHeight: 24 }} color={c["ink-muted"]}>
            {step.body}
          </T>
          {step.legend ? (
            <View style={{ gap: 10 }}>
              {step.legend.map((item) => (
                <View
                  key={item.mark}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <MarkGlyph mark={item.mark} />
                  <View style={{ flex: 1 }}>
                    <T weight={700}>{item.title}</T>
                    <T size={14} color={c["ink-muted"]}>
                      {item.text}
                    </T>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
          {step.expect ? (
            <View accessibilityLiveRegion="polite">
              <T weight={600} color={met ? c.ink : c.accent}>
                {met
                  ? (step.done ?? "Done.")
                  : "Tap the highlighted button to continue."}
              </T>
            </View>
          ) : null}
          {step.choice === "level" ? (
            <View style={{ gap: 8 }}>
              <T size={13} weight={600}>
                How much climbing have you done?
              </T>
              <LevelChips level={level} onChange={onLevel} />
            </View>
          ) : null}
          <Button onPress={onNext} disabled={!met}>
            {last ? "Done" : "Next"}
          </Button>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}
