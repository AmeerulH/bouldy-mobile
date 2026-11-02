import { View } from 'react-native';
import { A, Heading, Hold, Icon, PageTitle, Result, T } from '../../components/primitives';
import { Screen, Waiting } from '../../components/screen';
import { JournalWarning } from '../../components/journal-warning';
import { RouteBrowser } from '../../components/route-browser';
import { useSnapshot } from '../../data/snapshot';
import { collectClimbs } from '../../features/climbs';
import { useSheetNavigation } from '../../platform/sheet-navigation';
import { colors as c } from '../../theme/colors';
import { s } from '../../theme/styles';

export default function Climbs() {
  const { data, error } = useSnapshot('climbs'), nav = useSheetNavigation();
  if (!data) return <Screen><Waiting error={error} page="climbs" /></Screen>;
  const collection = collectClimbs(data.journal, data.gyms, data.routes), { items } = collection;
  return <Screen back="/sessions"><View style={[s.page, { paddingTop: 24 }]}>
    <View style={{ gap: 20 }}><View><T color={c['ink-muted']}>Every route you&apos;ve logged.</T><View style={{ marginTop: 8 }}><PageTitle size={44}>Your climbs</PageTitle></View></View></View>
    {collection.warning ? <JournalWarning>Some of your journal could not be loaded, so this collection may be missing routes or totals.</JournalWarning> : null}
    {!items.length ? <View style={[s.panel, { paddingVertical: 24 }]}><Heading color={c['panel-ink']}>No climbs yet</Heading><T color={c['panel-ink-muted']} style={{ marginTop: 12, lineHeight: 24 }}>Each route you log collects here, grouped by gym and grade, with your best result.</T><A href="/sessions/new" color={c['accent-ink']} style={[s.button, { alignSelf: 'flex-start', minHeight: 44, paddingHorizontal: 16, marginTop: 20, backgroundColor: c.accent }]}>Choose a gym</A></View> : <>
      <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: 16 }}>{[[items.length, 'Routes'], [collection.sent, 'Sent'], [collection.gyms, collection.gyms === 1 ? 'Gym' : 'Gyms']].map(([value, label]) => <View key={label} style={{ flex: 1 }}><T display size={30} weight={700}>{value}</T><T size={12} weight={600} color={c['ink-muted']} style={{ marginTop: 4 }}>{label}</T></View>)}</View>
      <RouteBrowser groupByGym items={items.map(item => ({ state: item.state, status: item.status, pinned: false, gym: item.gym }))} ended storageKey="climbs" statusOptions={[{ value: 'flash', label: 'Flash' }, { value: 'sent', label: 'Sent' }, { value: 'project', label: 'Project' }]} openFilters={() => nav.open('route-filters')} filtersOpen={nav.sheet === 'route-filters'} closeFilters={nav.close} renderRow={({ route }) => {
        const item = items.find(item => item.route.id === route.id)!;
        const detail = [item.tries === null ? 'Tries unavailable' : `${item.tries} ${item.tries === 1 ? 'try' : 'tries'}`, `${item.visits} ${item.visits === 1 ? 'visit' : 'visits'}`, route.status === 'retired' ? 'Retired' : null].filter(Boolean).join(' · ');
        return <A href={`/routes/${route.id}?from=climbs`} style={[s.row, { gap: 12, minHeight: 64, paddingVertical: 10 }]}><Hold colour={route.colour} name={route.route_name} /><View style={{ flex: 1 }}><View style={[s.row, { alignItems: 'baseline', gap: 8 }]}><Heading size={20}>{route.grade}</Heading><T size={12} weight={600} color={c['ink-muted']} lines={1}>{route.colour || 'Colour unrecorded'}</T></View><T weight={600} lines={1} style={{ marginTop: 2 }}>{route.route_name}</T><T size={12} color={c['ink-muted']} lines={1}>{detail}</T></View><Result result={item.best} /><Icon name="next" size={16} /></A>;
      }} />
    </>}
  </View></Screen>;
}
