import { Pressable } from './pressable';
import React, { useEffect, useState, type ReactNode } from 'react';
import { Modal, View,  ScrollView, useWindowDimensions, type ViewStyle } from 'react-native';
import { GestureDetector, GestureHandlerRootView, usePanGesture } from 'react-native-gesture-handler';
import Animated, { cubicBezier, useSharedValue, useAnimatedStyle, type CSSAnimationProperties } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heading, Icon } from './primitives';
import { useReducedMotion } from '../platform/reduced-motion';
import { colors as c } from '../theme/colors';
import { sheetDragDistance, sheetDragDismisses } from '../features/sheet-drag';
import { motion } from '../theme/motion';
import { useScreenFocus } from '../platform/screen-focus';

export function Sheet({ title, children, open, close }: { title: string; children: ReactNode; open: boolean; close: () => void }) {
  const { height } = useWindowDimensions(), insets = useSafeAreaInsets(), reduced = useReducedMotion();
  const focused = useScreenFocus();
  const [presence, setPresence] = useState({ open, present: open });
  // Derive opening presence during render; only exit completion is asynchronous.
  if (presence.open !== open) setPresence({ open, present: open || presence.present });
  const dragY = useSharedValue(0);
  const dragStartY=useSharedValue(0);
  useEffect(() => {
    if (open) { dragY.set(0); return; }
    if (!presence.present) return;
    const timer = setTimeout(() => setPresence(current => current.open ? current : { open: false, present: false }), reduced ? 0 : motion.sheetOutMs);
    return () => clearTimeout(timer);
  }, [open, reduced, dragY, presence.present]);
  const pan = usePanGesture({
    enabled: open, minDistance: 0, maxPointers: 1,
    onBegin: event => { 'worklet'; dragStartY.set(event.absoluteY); },
    onUpdate: event => { 'worklet'; dragY.set(sheetDragDistance(dragStartY.get(),event.absoluteY)); },
    onFinalize: event => {
      'worklet';
      // UIPan resets translation when it activates. Absolute coordinates preserve
      // the full source pointer-down distance, including a single-move/cancel.
      const dismiss=sheetDragDismisses(dragStartY.get(),event.absoluteY);
      dragY.set(0);
      if(dismiss)scheduleOnRN(close);
    },
  });
  const dragStyle = useAnimatedStyle(() => ({ transform: [{ translateY: dragY.get() }] }));
  if (!focused || (!open && !presence.present)) return null;
  const curve = open ? motion.easeOut : motion.sheetExit;
  const sheetMotion: Partial<CSSAnimationProperties<ViewStyle>> | undefined = reduced ? undefined : {
    animationName: open ? { from: { transform: [{ translateY: '100%' }] } } : { to: { transform: [{ translateY: '100%' }] } },
    animationDuration: `${open ? motion.sheetInMs : motion.sheetOutMs}ms` as const,
    animationTimingFunction: cubicBezier(curve[0], curve[1], curve[2], curve[3]),
    animationFillMode: 'forwards' as const,
  };
  const backdropMotion: Partial<CSSAnimationProperties<ViewStyle>> | undefined = reduced ? undefined : {
    animationName: open ? { from: { opacity: 0 } } : { to: { opacity: 0 } },
    animationDuration: `${open ? motion.sheetInMs : motion.sheetOutMs}ms` as const,
    animationTimingFunction: open ? 'ease-out' as const : 'ease-in' as const,
    animationFillMode: 'forwards' as const,
  };
  return <Modal visible transparent animationType="none" onRequestClose={() => { if (open) close(); }}>
    <GestureHandlerRootView style={{ flex: 1, justifyContent: 'flex-end' }}>
      <Animated.View style={[{ position: 'absolute', inset: 0, backgroundColor: 'rgba(13,13,13,.5)', ...backdropMotion }]}>
        <Pressable accessibilityLabel={`Dismiss ${title}`} disabled={!open} onPress={close} style={{ flex: 1 }} />
      </Animated.View>
      <Animated.View style={[{ width: '100%', maxWidth: 430, alignSelf: 'center', maxHeight: height * .88 }, dragStyle]}>
        <Animated.View accessibilityViewIsModal accessibilityLabel={title} style={[{ maxHeight: height * .88, backgroundColor: c.bg, borderTopLeftRadius: 16, borderTopRightRadius: 16, overflow: 'hidden', ...sheetMotion }]}>
          <View style={{ flexDirection: 'row', paddingLeft: 20, paddingRight: 12, gap: 8 }}>
            <GestureDetector gesture={pan}><View style={{ flex: 1, paddingTop: 26, paddingBottom: 12 }}><Heading>{title}</Heading></View></GestureDetector>
            <View pointerEvents="none" style={{ position: 'absolute', left: '50%', top: 8, width: 36, height: 4, marginLeft: -18, borderRadius: 999, backgroundColor: c.hairline }} />
            <Pressable disabled={!open} onPress={close} accessibilityRole="button" accessibilityLabel={`Close ${title}`} style={{ width: 44, height: 44, marginTop: 16, justifyContent: 'center', alignItems: 'center' }}><Icon name="close" color={c['ink-muted']} /></Pressable>
          </View>
          <ScrollView automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps="handled" style={{ flexShrink: 1 }} contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: Math.max(24, insets.bottom) }}>{children}</ScrollView>
        </Animated.View>
      </Animated.View>
    </GestureHandlerRootView>
  </Modal>;
}
