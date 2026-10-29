import { Pressable } from './pressable';
import { useState } from 'react';
import { Keyboard, View } from 'react-native';
import { ROUTE_STYLES } from '../domain/route-options';
import { colors as c } from '../theme/colors';
import { Icon, T } from './primitives';
import { Sheet } from './sheet';

export function StyleSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return <View style={{ gap: 6 }}><T weight={600}>Main style</T>
    <Pressable accessibilityRole="combobox" accessibilityLabel="Main style" accessibilityValue={{ text: value || 'Not recorded' }} accessibilityState={{ expanded: open }} onPress={() => { Keyboard.dismiss(); setOpen(true); }} style={{ minHeight: 48, borderWidth: 1, borderColor: c.hairline, borderRadius: 12, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}><T size={16}>{value || 'Not recorded'}</T><Icon name="down" size={16} /></Pressable>
    <Sheet title="Main style" open={open} close={() => setOpen(false)}><View>{['', ...ROUTE_STYLES].map(style => <Pressable key={style} accessibilityRole="radio" accessibilityState={{ checked: value === style }} onPress={() => { onChange(style); setOpen(false); }} style={{ minHeight: 48, paddingVertical: 12, borderBottomWidth: 1, borderColor: c.hairline }}><T weight={value === style ? 700 : 400} color={value === style ? c.accent : c.ink}>{style || 'Not recorded'}</T></Pressable>)}</View></Sheet>
  </View>;
}
