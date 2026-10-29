import { View } from 'react-native';
import { T } from './primitives';
import { colors as c } from '../theme/colors';
import { routeMarkColors } from '../theme/route-mark-colors';
// Dormant source component. Mounted only by the local development catalogue.
export function RouteMark({ colour, grade }: { colour?: string | null; grade: string }) {
  const light = ['yellow', 'white', 'mint', 'transparent'].includes(colour?.toLowerCase() ?? '');
  return <View accessibilityElementsHidden style={{ width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderTopLeftRadius: 16, borderTopRightRadius: 14, borderBottomRightRadius: 16, borderBottomLeftRadius: 12, backgroundColor: routeMarkColors[colour?.toLowerCase() ?? ''] ?? c['panel-track'], ...(colour === 'white' || colour === 'transparent' ? { borderWidth: 1, borderColor: c.hairline } : {}) }}><T display size={14.4} weight={800} color={light ? c.ink : '#ffffff'} style={{ letterSpacing: -.288, textTransform: 'uppercase' }}>{grade}</T></View>;
}
