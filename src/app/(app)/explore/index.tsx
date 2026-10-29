import { View } from 'react-native';
import { A, Heading, Icon, T } from '../../../components/primitives';
import { Screen } from '../../../components/screen';
import { colors as c } from '../../../theme/colors';
import { s } from '../../../theme/styles';
const groups = [{ heading: 'Climbers', rows: [{ href: '/explore/feed', label: "Climbers' sessions", hint: 'Sessions friends choose to share' }, { href: '/explore/climbers', label: 'Find climbers', hint: 'Search and view public profiles' }] }, { heading: 'Compete', rows: [{ href: '/explore/leaderboards', label: 'Leaderboards', hint: 'Gym, global and friend rankings' }, { href: '/explore/challenges', label: 'Challenges', hint: 'Gym and community goals with dates' }, { href: '/explore/groups', label: 'Groups and leagues', hint: 'Private crews and seasons' }] }];
export default function Explore() {
  return <Screen><View style={[s.page, { gap: 28, paddingTop: 24 }]}><View><T color={c['ink-muted']}>Climb with others.</T><Heading size={36} style={{ marginTop: 4, lineHeight: 32.4, letterSpacing: -1.08 }}>Explore</Heading></View>
    <View accessibilityLabel="Status" style={s.panel}><T size={12} weight={500} color={c['panel-ink-muted']} style={{ letterSpacing: 1.44 }}>CLOSED FOR SETTING</T><T color={c['panel-ink']} style={{ marginTop: 8, lineHeight: 24 }}>The community side of Bouldy is being built. Everything below is planned, and your journal stays private until sharing exists and you choose it.</T></View>
    {groups.map(group => <View key={group.heading}><Heading>{group.heading}</Heading><View style={{ marginTop: 12, borderTopWidth: 1, borderColor: c.hairline }}>{group.rows.map(row => <A key={row.href} href={row.href} style={[s.between, { minHeight: 64, gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: c.hairline }]}><View style={{ flex: 1 }}><T size={16} weight={600}>{row.label}</T><T color={c['ink-muted']} style={{ marginTop: 2 }}>{row.hint}</T></View><View style={[s.row, { gap: 8 }]}><T size={12} weight={600} color={c['ink-muted']}>Planned</T><Icon name="next" size={16} /></View></A>)}</View></View>)}
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}><T color={c['ink-muted']} style={{ lineHeight: 24 }}>Your own history is live now. </T><A href="/sessions" color={c.ink} textStyle={{ textDecorationLine: 'underline', lineHeight: 24 }}>Open your sessions</A><T color={c['ink-muted']} style={{ lineHeight: 24 }}>.</T></View>
  </View></Screen>;
}
