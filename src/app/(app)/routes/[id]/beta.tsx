import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { UnderConstruction } from '../../../../components/under-construction';
import { Heading, Hold, T } from '../../../../components/primitives';
import { Screen, Waiting } from '../../../../components/screen';
import { useSnapshot } from '../../../../data/snapshot';
import { colors as c } from '../../../../theme/colors';
export default function RouteBeta() {
  const { id } = useLocalSearchParams<{ id: string }>(), { data, error } = useSnapshot('beta', id);
  if (!data) return <Screen><Waiting error={error} page="placeholder" /></Screen>;
  const { route, gym } = data;
  return <UnderConstruction back={{ href: gym ? `/gyms/${gym.id}` : '/gyms', label: gym?.name ?? 'Gyms' }} eyebrow="Route" title="Beta" summary="Photos and short videos of how a route is climbed, hidden until you choose to reveal them." coming={['Route photos, with a cover image so you can recognise the line.', 'Beta videos from climbers, covered until you tap to reveal.', 'Credit to the climber who shared each clip, and a way to report it.']} blocker="Needs media storage, authorised uploads, processing and moderation. Photos and videos are not saved anywhere today." holds={[route.colour ?? 'grey', 'grey']}><View accessibilityLabel="Route" style={{ flexDirection: 'row', alignItems: 'center', gap: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: 16 }}><Hold colour={route.colour} name={route.route_name} size={56} /><View style={{ flex: 1 }}><Heading size={30}>{route.grade}</Heading><T weight={600} style={{ marginTop: 4 }}>{route.route_name}</T></View></View></UnderConstruction>;
}
