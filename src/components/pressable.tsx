import { forwardRef, type ComponentRef } from 'react';
import { Pressable as NativePressable, type PressableProps } from 'react-native';
import { markControlTouch } from '../features/touch-guard';
export const Pressable = forwardRef<ComponentRef<typeof NativePressable>, PressableProps>(function Pressable({ onTouchStart, ...props }, ref) {
  return <NativePressable ref={ref} {...props} onTouchStart={event => { markControlTouch(event.nativeEvent.timestamp); onTouchStart?.(event); }} />;
});
