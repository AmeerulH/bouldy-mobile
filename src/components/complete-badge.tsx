import Animated, { cubicBezier } from "react-native-reanimated";
import { Result } from "./primitives";
import { useReducedMotion } from "../platform/reduced-motion";
import { motion } from "../theme/motion";

/** The result tag that replaces the buttons once a route is done; it pops in rather than appearing. */
export function CompleteBadge({ result }: { result: "flash" | "send" }) {
  const reduced = useReducedMotion();
  return (
    <Animated.View
      style={{
        animationName: reduced
          ? { from: { opacity: 0 } }
          : { from: { opacity: 0, transform: [{ scale: 0.8 }] } },
        animationDuration: "220ms",
        animationTimingFunction: cubicBezier(...motion.easeOut),
        animationFillMode: "backwards",
      }}
    >
      <Result result={result} />
    </Animated.View>
  );
}
