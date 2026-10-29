import Animated from 'react-native-reanimated';
import { useReducedMotion } from '../platform/reduced-motion';

/** Source submit-button: 15px ring, 2px border, 650ms linear rotation. */
export function ButtonSpinner({ color }: { color: string }) {
  const reduced = useReducedMotion();
  return <Animated.View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{
    width: 15, height: 15, borderWidth: 2, borderColor: color,
    borderRightColor: 'transparent', borderRadius: 999,
    ...(!reduced ? {
      animationName: { to: { transform: [{ rotate: '360deg' }] } },
      animationDuration: '650ms', animationTimingFunction: 'linear', animationIterationCount: 'infinite',
    } : {}),
  }} />;
}
