import type { ReactNode } from "react";
import Animated, {
  cubicBezier,
  type CSSAnimationProperties,
} from "react-native-reanimated";
import type { ViewStyle } from "react-native";
import { Pressable } from "./pressable";
import { ButtonSpinner } from "./button-spinner";
import { Icon, T } from "./primitives";
import { useReducedMotion } from "../platform/reduced-motion";
import { colors as c } from "../theme/colors";
import { motion } from "../theme/motion";

export type LogKind = "try" | "flash" | "send";
type Motion = Partial<CSSAnimationProperties<ViewStyle>>;

// While a log is in flight the button itself plays: a charge that says what is being recorded.
// Two quick plays of the tap animation before the spinner takes over.
const burstMs = 600;
const tone = {
    try: { bg: c.pressed, ring: c["ink-muted"], ink: c.ink },
    flash: { bg: "#ffe45c", ring: "#f2b705", ink: "#3a2a00" },
    send: { bg: "#cfe7ff", ring: "#3b82d6", ink: "#0b2a4d" },
  },
  curve = cubicBezier(...motion.easeOut);

const icon: Record<LogKind, Motion> = {
  // Lightning: a sharp jolt, over and back.
  flash: {
    animationName: {
      "0%": { transform: [{ scale: 1 }, { rotate: "0deg" }] },
      "25%": { transform: [{ scale: 1.3 }, { rotate: "-12deg" }] },
      "50%": { transform: [{ scale: 1.15 }, { rotate: "10deg" }] },
      "100%": { transform: [{ scale: 1 }, { rotate: "0deg" }] },
    },
    animationDuration: "300ms",
    animationTimingFunction: curve,
    animationIterationCount: 2,
  },
  // Tick: pops in from small.
  send: {
    animationName: {
      "0%": { transform: [{ scale: 0.7 }] },
      "60%": { transform: [{ scale: 1.2 }] },
      "100%": { transform: [{ scale: 1 }] },
    },
    animationDuration: "300ms",
    animationTimingFunction: curve,
    animationIterationCount: 2,
  },
  try: {
    animationName: {
      "0%": { transform: [{ scale: 1 }] },
      "40%": { transform: [{ scale: 1.3 }] },
      "100%": { transform: [{ scale: 1 }] },
    },
    animationDuration: "300ms",
    animationTimingFunction: curve,
    animationIterationCount: 2,
  },
};

/** A 44px circle for one logging action. Only the tapped button shows progress. */
export function LogActionButton({
  kind,
  label,
  playing,
  disabled,
  onPress,
}: {
  kind: LogKind;
  label: string;
  playing: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  const reduced = useReducedMotion(),
    t = tone[kind],
    glyph: ReactNode =
      kind === "try" ? (
        <T weight={700} color={playing ? t.ink : c.ink}>
          +1
        </T>
      ) : (
        <Icon
          name={kind === "flash" ? "flash" : "check"}
          color={playing ? t.ink : c.ink}
        />
      );
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ busy: playing, disabled }}
      disabled={disabled}
      onPress={(event) => {
        event.stopPropagation();
        onPress();
      }}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: playing ? t.ring : c.hairline,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: pressed ? 0.94 : 1 }],
      })}
    >
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          backgroundColor: t.bg,
          opacity: playing ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: reduced ? "0ms" : "120ms",
        }}
      />
      {playing && !reduced ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              inset: 0,
              borderRadius: 22,
              borderWidth: 2,
              borderColor: t.ring,
            },
            {
              animationName: {
                from: { opacity: 0.7, transform: [{ scale: 1 }] },
                to: { opacity: 0, transform: [{ scale: 1.6 }] },
              },
              animationDuration: "600ms",
              animationTimingFunction: curve,
            },
          ]}
        />
      ) : null}
      {/* Tap feedback plays twice, then hands over to the spinner for as long as saving takes. */}
      <Animated.View
        style={
          playing
            ? reduced
              ? { opacity: 0 }
              : {
                  animationName: { to: { opacity: 0 } },
                  animationDuration: "120ms",
                  animationDelay: `${burstMs}ms`,
                  animationFillMode: "forwards",
                }
            : undefined
        }
      >
        <Animated.View style={playing && !reduced ? icon[kind] : undefined}>
          {glyph}
        </Animated.View>
      </Animated.View>
      {playing ? (
        <Animated.View
          pointerEvents="none"
          style={[
            { position: "absolute" },
            reduced
              ? undefined
              : {
                  animationName: { from: { opacity: 0 } },
                  animationDuration: "120ms",
                  animationDelay: `${burstMs}ms`,
                  animationFillMode: "backwards",
                },
          ]}
        >
          <ButtonSpinner color={t.ink} />
        </Animated.View>
      ) : null}
    </Pressable>
  );
}
