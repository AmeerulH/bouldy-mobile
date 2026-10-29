import { useEffect, useRef, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { isControlTouch } from '../features/touch-guard';
import { usePathname, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, cancelAnimation } from 'react-native-reanimated';
import { pageTransition, tabSwipeDestination } from '../features/page-motion';
import { useReducedMotion } from '../platform/reduced-motion';
import { useNavigationStart } from '../platform/navigation-state';
import { motion } from '../theme/motion';

export function PageMotion({ children }: { children: ReactNode }) {
  const startNavigation=useNavigationStart(),router=useRouter(),{width}=useWindowDimensions(),touch=useRef<{x:number;y:number}|null>(null);
  const pathname = usePathname(), previous = useRef(pathname), reduced = useReducedMotion();
  const x = useSharedValue(0), opacity = useSharedValue(1);
  useEffect(() => {
    const transition = pageTransition(previous.current, pathname);
    previous.current = pathname;
    cancelAnimation(x); cancelAnimation(opacity);
    x.set(0); opacity.set(1);
    if (!transition || reduced) return;
    const config = { duration: transition.duration, easing: Easing.bezier(...motion.easeOut) };
    x.set(transition.distance); opacity.set(.7);
    x.set(withTiming(0, config)); opacity.set(withTiming(1, config));
    return () => { cancelAnimation(x); cancelAnimation(opacity); };
  }, [pathname, reduced, x, opacity]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }], opacity: opacity.get() }));
  return <Animated.View onTouchStart={event=>{touch.current=null;const native=event.nativeEvent;if(native.touches.length!==1||isControlTouch(native.timestamp))return;touch.current={x:native.pageX,y:native.pageY};}} onTouchEnd={event=>{const origin=touch.current;touch.current=null;if(!origin)return;const native=event.nativeEvent;const next=tabSwipeDestination(pathname,origin,{x:native.pageX,y:native.pageY},Math.min(width,430));if(next){startNavigation(next);router.push(next as never);}}} onTouchCancel={()=>{touch.current=null;}} style={[{ flex: 1 }, style]}>{children}</Animated.View>;
}
