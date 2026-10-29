import { View, type ViewStyle } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { Hold } from './primitives';
import { useReducedMotion } from '../platform/reduced-motion';

export type BouldyLoaderVariant = 'ascent' | 'traverse' | 'hold';
const rest = { opacity: .42, transform: [{ translateY: 0 }, { scale: .88 }] };
const reach = { opacity: 1, transform: [{ translateY: -3 }, { scale: 1 }] };
const keyframes = { '0%, 65%, 100%': rest, '20%, 40%': reach };
const positions: ViewStyle[] = [
  { position: 'absolute', left: 15, bottom: 0, transform: [{ rotate: '-12deg' }] },
  { position: 'absolute', right: 10, bottom: 48, transform: [{ rotate: '14deg' }] },
  { position: 'absolute', left: 32, top: 0, transform: [{ rotate: '-8deg' }] },
];

/** Decorative only: the containing loading state owns announcements. */
export function BouldyLoader({ variant = 'ascent' }: { variant?: BouldyLoaderVariant }) {
  const reduced = useReducedMotion();
  const size = variant === 'ascent' ? 62 : variant === 'traverse' ? 25 : 32;
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[
    { flexDirection: 'row', flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
    variant === 'ascent' ? { width: 168, height: 158 } : { gap: variant === 'traverse' ? 1 : 0 },
  ]}>
    {(variant === 'hold' ? ['red'] : ['red', 'blue', 'green']).map((colour, index) =>
      <View key={colour} style={variant === 'ascent' ? positions[index] : undefined}>
        <Animated.View style={reduced ? undefined : {
          ...rest, animationName: keyframes, animationDuration: '2400ms',
          animationDelay: `${index * 400}ms`, animationTimingFunction: cubicBezier(.22, 1, .36, 1),
          animationIterationCount: 'infinite',
        }}><Hold colour={colour} size={size} /></Animated.View>
      </View>)}
  </View>;
}
