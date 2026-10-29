import { type ViewStyle } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { Hold } from './primitives';
import { useReducedMotion } from '../platform/reduced-motion';
import { motion } from '../theme/motion';

export function WelcomeHold({ colour, angle, style }: { colour: string; angle: number; style: ViewStyle }) {
  const reduced = useReducedMotion();
  return <Animated.View style={[style, {
    width: 112, height: 112, transform: [{ rotate: `${angle}deg` }],
    ...(!reduced ? {
      animationName: { from: { transform: [{ translateY: 12 }, { rotate: `${angle}deg` }] }, to: { transform: [{ translateY: 0 }, { rotate: `${angle}deg` }] } },
      animationDuration: `${motion.welcomeMs}ms`, animationTimingFunction: cubicBezier(...motion.easeOut), animationFillMode: 'both',
    } : {}),
  }]}><Hold colour={colour} size={112} /></Animated.View>;
}
