import { useState } from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { A, Brand, Heading, Hold, T } from './primitives';
import { useReducedMotion } from '../platform/reduced-motion';
import { colors as c } from '../theme/colors';
import { motion } from '../theme/motion';
import { s } from '../theme/styles';
export function NotFound() {
  const insets = useSafeAreaInsets(), { width } = useWindowDimensions(), reduced = useReducedMotion();
  const [viewH, setViewH] = useState(0), [contentH, setContentH] = useState(0), canScroll = contentH > viewH + 1;
  const small = width <= 360, size = small ? 92 : 112;
  return <ScrollView onLayout={e => setViewH(e.nativeEvent.layout.height)} onContentSizeChange={(_w, h) => setContentH(h)} scrollEnabled={canScroll} bounces={canScroll} alwaysBounceVertical={false} overScrollMode={canScroll ? 'auto' : 'never'} contentContainerStyle={{ flexGrow: 1, backgroundColor: c.bg, paddingTop: Math.max(28, insets.top), paddingBottom: Math.max(24, insets.bottom), paddingHorizontal: 24 }}>
    <Brand /><View style={{ flex: 1, minHeight: 150, justifyContent: 'flex-end', marginBottom: 30 }}><View accessibilityElementsHidden style={[s.row, { justifyContent: 'center', gap: 8 }]}><T display size={size} weight={800} style={{ lineHeight: size * .8 }}>4</T><Animated.View style={reduced ? undefined : { animationName: { from: { opacity: 0, transform: [{ translateY: -12 }, { rotate: '-6deg' }, { scale: .9 }] }, to: { opacity: 1, transform: [{ translateY: 0 }, { rotate: '0deg' }, { scale: 1 }] } }, animationDuration: '420ms', animationTimingFunction: cubicBezier(...motion.easeOut) }}><Hold colour="red" size={small ? 72 : 86} style={{ transform: [{ rotate: '-12deg' }] }} /></Animated.View><T display size={size} weight={800} style={{ lineHeight: size * .8 }}>4</T></View></View>
    <View><T size={13} weight={700} color={c['accent-strong']} style={{ marginBottom: 8 }}>Looks like this one was reset.</T><Heading size={48} style={{ lineHeight: 44.16, letterSpacing: -1.44, maxWidth: 240 }}>That route is off the wall.</Heading><T color={c['ink-muted']} style={{ marginTop: 16, lineHeight: 23.1 }}>The page may have moved, retired, or never existed. Head back and pick up where you left off.</T></View>
    <A href="/" color={c['accent-ink']} style={[s.button, { minHeight: 52, marginTop: 32, backgroundColor: c.accent }]}>Back to Bouldy</A>
  </ScrollView>;
}
