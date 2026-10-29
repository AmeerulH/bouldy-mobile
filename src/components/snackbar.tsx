import { Pressable } from './pressable';
import React, { createContext, useContext, useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { T } from './primitives';
import { useReducedMotion } from '../platform/reduced-motion';
import { colors as c } from '../theme/colors';
import { motion } from '../theme/motion';
import { useNotice } from '../platform/notice';
const Context = createContext<(text: string) => void>(() => {});
const entrance = { from: { opacity: 0, transform: [{ translateY: -16 }] }, to: { opacity: 1, transform: [{ translateY: 0 }] } };
const exit = { to: { opacity: 0, transform: [{ translateY: -12 }] } };
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [text, setText] = useState(''), [leaving, setLeaving] = useState(false);
  const reduced = useReducedMotion(), reducedRef = useRef(reduced), epoch = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]), insets = useSafeAreaInsets();
  const clearTimers = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; }, []);
  useEffect(() => { reducedRef.current = reduced; }, [reduced]);
  useEffect(() => clearTimers, [clearTimers]);
  const dismiss = useCallback(() => {
    clearTimers();
    if (reducedRef.current) { setText(''); return; }
    const generation = epoch.current;
    setLeaving(true);
    timers.current.push(setTimeout(() => { if (epoch.current === generation) setText(''); }, motion.snackbarOutMs));
  }, [clearTimers]);
  const show = useCallback((value: string) => {
    clearTimers(); epoch.current++; setText(value); setLeaving(false);
    timers.current.push(setTimeout(dismiss, motion.snackbarVisibleMs));
  }, [clearTimers, dismiss]);
  useNotice(show);
  return <Context.Provider value={show}>{children}
    <View pointerEvents="box-none" accessibilityLiveRegion="polite" style={{ position: 'absolute', top: Math.max(12, insets.top), left: 12, right: 12, zIndex: 60 }}>
      {text ? <Animated.View style={reduced ? undefined : {
        animationName: leaving ? exit : entrance,
        animationDuration: `${leaving ? motion.snackbarOutMs : motion.snackbarInMs}ms`,
        animationTimingFunction: cubicBezier(...motion.easeOut), animationFillMode: 'forwards',
      }}><Pressable accessibilityRole="button" accessibilityLabel={`${text}. Tap to dismiss.`} onPress={dismiss} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingVertical: 8, paddingLeft: 16, paddingRight: 8, borderRadius: 12, backgroundColor: c.panel, boxShadow: '0 6px 20px rgba(13,13,13,.28)' }}>
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#73bd6b" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><Path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>
        <View style={{ flex: 1 }}><T weight={600} color={c['panel-ink']} style={{ lineHeight: 18.9 }}>{text}</T></View>
        <View style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}><Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={c['panel-ink-muted']} strokeWidth={2} strokeLinecap="round"><Path d="m7 7 10 10M17 7 7 17" /></Svg></View>
      </Pressable></Animated.View> : null}
    </View>
  </Context.Provider>;
}
export const useSnackbar = () => useContext(Context);
