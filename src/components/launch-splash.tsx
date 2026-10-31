import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { cubicBezier } from "react-native-reanimated";
import { Brand, Hold } from "./primitives";
import { useReducedMotion } from "../platform/reduced-motion";
import { colors as c } from "../theme/colors";
export function LaunchSplash() {
  const [visible, setVisible] = useState(true),
    reduced = useReducedMotion();
  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), reduced ? 600 : 2400);
    return () => clearTimeout(timer);
  }, [reduced]);
  if (!visible) return null;
  return (
    <View
      accessibilityLabel="Bouldy is opening"
      accessibilityRole="progressbar"
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: c.bg,
        zIndex: 1000,
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <Animated.View
        style={
          reduced
            ? {}
            : {
                animationName: {
                  from: {
                    opacity: 0.25,
                    transform: [{ translateY: 65 }, { rotate: "-18deg" }],
                  },
                  "65%": {
                    opacity: 1,
                    transform: [{ translateY: -12 }, { rotate: "5deg" }],
                  },
                  to: {
                    opacity: 1,
                    transform: [{ translateY: 0 }, { rotate: "0deg" }],
                  },
                },
                animationDuration: "2200ms",
                animationTimingFunction: cubicBezier(0.16, 1, 0.3, 1),
              }
        }
      >
        <Hold colour="red" size={152} />
      </Animated.View>
      <Brand />
    </View>
  );
}
