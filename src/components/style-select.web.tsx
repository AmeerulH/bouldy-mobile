import { View } from 'react-native';
import { ROUTE_STYLES } from '../domain/route-options';
import { colors as c } from '../theme/colors';
import { Icon, T } from './primitives';

export function StyleSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <View style={{ gap: 6 }}><T weight={600}>Main style</T><View>
    <select aria-label="Main style" value={value} onChange={event => onChange(event.target.value)} style={{ appearance: 'none', width: '100%', minHeight: 48, border: `1px solid ${c.hairline}`, borderRadius: 12, padding: '0 40px 0 14px', fontFamily: 'Geist-400', fontSize: 16, color: c.ink, background: c.bg }}><option value="">Not recorded</option>{ROUTE_STYLES.map(style => <option key={style} value={style}>{style}</option>)}</select>
    <View pointerEvents="none" style={{ position: 'absolute', right: 14, top: 16 }}><Icon name="down" size={16} /></View>
  </View></View>;
}
