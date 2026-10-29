import { View } from 'react-native';
import { A } from './primitives';
import { colors as c } from '../theme/colors';
export function JournalSwitch({ active }: { active: 'sessions' | 'climbs' }) {
  return <View style={{ flexDirection: 'row', padding: 4, borderWidth: 1, borderColor: c.hairline, borderRadius: 999 }}>{(['sessions', 'climbs'] as const).map(value => <A key={value} href={`/${value}`} color={active === value ? c['panel-ink'] : c['ink-muted']} style={{ flex: 1, minHeight: 40, borderRadius: 999, backgroundColor: active === value ? c.panel : 'transparent', alignItems: 'center', justifyContent: 'center' }}>{value === 'sessions' ? 'Sessions' : 'Climbs'}</A>)}</View>;
}
