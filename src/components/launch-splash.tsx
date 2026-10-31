import { useEffect, useState, useSyncExternalStore } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import Animated, { cubicBezier } from "react-native-reanimated";
import { Hold, T } from "./primitives";
import { useReducedMotion } from "../platform/reduced-motion";
import { colors as c } from "../theme/colors";

// LAUNCH-01 (approved v35 design review): holds rise, Bolt B resolves between
// them, the wordmark settles. 2.2s of motion plus a 0.6s settled hold.
const easeOut = cubicBezier(0.23, 1, 0.32, 1);
const SETTLED_AT = 2800;
const EXIT_MS = 200;

function enter(
  duration: number,
  delay: number,
  from: { translateY?: number; scale?: number },
) {
  const start = {
    opacity: 0,
    transform: [
      from.translateY
        ? { translateY: from.translateY }
        : { scale: from.scale ?? 1 },
    ],
  };
  const end = {
    opacity: 1,
    transform: [from.translateY ? { translateY: 0 } : { scale: 1 }],
  };
  return {
    animationName: { from: start, to: end },
    animationDuration: duration,
    animationDelay: delay,
    animationTimingFunction: easeOut,
    animationFillMode: "both" as const,
  };
}

export function LaunchSplash() {
  const [phase, setPhase] = useState<"in" | "out" | "done">("in"),
    ready = useSyncExternalStore(
      () => () => {},
      () => true,
      () => false,
    ),
    reduced = useReducedMotion();
  // Server/first paint is the static fallback; showing it would flash the
  // finished lockup before the ascent begins. Hold the bare panel until mounted.
  useEffect(() => {
    const leave = setTimeout(() => setPhase("out"), reduced ? 400 : SETTLED_AT);
    const done = setTimeout(
      () => setPhase("done"),
      (reduced ? 400 : SETTLED_AT) + (reduced ? 0 : EXIT_MS),
    );
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, [reduced]);
  if (phase === "done") return null;
  const motion = (
    duration: number,
    delay: number,
    from: Parameters<typeof enter>[2],
  ) => (reduced ? {} : enter(duration, delay, from));
  return (
    <Animated.View
      accessibilityLabel="Bouldy is opening"
      accessibilityRole="progressbar"
      pointerEvents={phase === "out" ? "none" : "auto"}
      style={[
        {
          position: "absolute",
          inset: 0,
          backgroundColor: c.panel,
          zIndex: 1000,
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          paddingHorizontal: 24,
        },
        phase === "out" && !reduced
          ? {
              animationName: { to: { opacity: 0 } },
              animationDuration: EXIT_MS,
              animationTimingFunction: easeOut,
              animationFillMode: "forwards" as const,
            }
          : {},
      ]}
    >
      <StatusBar style="light" />
      {ready ? (
        <>
          <View
            style={{ width: 250, height: 220 }}
            importantForAccessibility="no-hide-descendants"
          >
            <Animated.View
              style={[
                { position: "absolute", left: 8, bottom: 20 },
                motion(1800, 0, { translateY: 16 }),
              ]}
            >
              <Hold colour="red" size={72} />
            </Animated.View>
            <Animated.View
              style={[
                { position: "absolute", right: 2, top: 65 },
                motion(1800, 200, { translateY: 16 }),
              ]}
            >
              <Hold colour="grey" size={62} />
            </Animated.View>
            <Animated.View
              style={[
                { position: "absolute", left: 65, top: 0 },
                motion(1800, 400, { translateY: 16 }),
              ]}
            >
              <Hold colour="white" size={58} />
            </Animated.View>
            <Animated.View
              style={[
                { position: "absolute", left: 45, top: 40 },
                motion(1800, 200, { scale: 0.95 }),
              ]}
            >
              <Image
                source={require("../../assets/source/brand/bolt-b.svg")}
                style={{ width: 160, height: 160 }}
                accessibilityElementsHidden
              />
            </Animated.View>
          </View>
          <Animated.View style={motion(1400, 800, { translateY: 8 })}>
            <T
              display
              size={84}
              weight={800}
              color={c["panel-ink"]}
              style={{ letterSpacing: -2.52, lineHeight: 76 }}
            >
              BOULDY
              <T
                display
                size={84}
                weight={800}
                color={c.accent}
                style={{ letterSpacing: -2.52, lineHeight: 76 }}
              >
                .
              </T>
            </T>
          </Animated.View>
        </>
      ) : null}
    </Animated.View>
  );
}
