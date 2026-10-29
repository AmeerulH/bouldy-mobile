import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import { A, Button, Feedback, Heading, Hold, Icon, T } from '../../../components/primitives';
import { RouteBrowser } from '../../../components/route-browser';
import { Screen, Waiting } from '../../../components/screen';
import { useSnapshot } from '../../../data/snapshot';
import { routeMeta, routeStates } from '../../../features/session-state';
import { useAuth } from '../../../platform/auth';
import { useSheetNavigation } from '../../../platform/sheet-navigation';
import { colors as c } from '../../../theme/colors';
import { s } from '../../../theme/styles';

export default function GymDetail() {
  const { id } = useLocalSearchParams<{ id: string }>(), nav = useSheetNavigation(), auth = useAuth();
  const { data, error: readError } = useSnapshot('gym', id);
  const [pending, setPending] = useState(false), [localError, setLocalError] = useState(''), busy = useRef(false);
  async function start() {
    if (busy.current) return;
    busy.current = true; setPending(true); setLocalError('');
    try {
      const out = await auth.command('startSession', { gym_id: Number(id) });
      if (out.destination) router.push(out.destination as never);
    } catch (issue) { setLocalError((issue as Error).message); }
    finally { busy.current = false; setPending(false); }
  }
  if (!data) return <Screen back="/gyms" label="Gyms"><Waiting error={readError} page="gyms" /></Screen>;
  const { gym } = data, routes = data.gymRoutes.filter(route => route.status === 'active');
  const items = routeStates(routes, [], { records: [], sessionsLoaded: true }, 0, true).map(state => ({ state, status: '', pinned: false }));
  return <Screen back="/gyms" label="Gyms"><View style={s.page}>
    <View><Heading size={36} style={{ lineHeight: 32.4, letterSpacing: -1.08 }}>{gym.name}</Heading><T color={c['ink-muted']} style={{ marginTop: 8 }}>{gym.location}</T></View>
    {localError || nav.error ? <Feedback>{localError || nav.error}</Feedback> : null}
    <Button pending={pending} pendingLabel="Starting session" onPress={() => void start()}>Start a session here</Button>
    <View><View style={[s.between, { gap: 12 }]}><View style={{ flex: 1 }}><Heading>Routes on the wall</Heading><T size={12} weight={600} color={c['ink-muted']} style={{ marginTop: 4 }}>{routes.length} active</T></View><A href={`/gyms/${id}/routes/new`} color={c['accent-tint-ink']} style={[s.button, { minHeight: 44, paddingHorizontal: 16, backgroundColor: c['accent-tint'] }]} textStyle={{ fontSize: 14 }}>+ Add route</A></View>
      {!routes.length ? <T color={c['ink-muted']} style={{ marginTop: 16, lineHeight: 24, maxWidth: 290 }}>No active routes yet. Add the first one to start logging here.</T> : <View style={{ marginTop: 12 }}><RouteBrowser items={items} ended showProgress={false} storageKey={`gym-${id}`} openFilters={() => nav.open('route-filters')} filtersOpen={nav.sheet === 'route-filters'} closeFilters={nav.close} renderRow={({ route }) => <A href={`/gyms/${id}/routes/${route.id}/edit`} style={[s.row, { gap: 12, minHeight: 64, paddingVertical: 10 }]}>
        <Hold colour={route.colour} name={route.route_name} /><View style={{ flex: 1 }}><View style={[s.row, { alignItems: 'baseline', gap: 8 }]}><Heading size={20}>{route.grade}</Heading><T size={12} weight={600} color={c['ink-muted']}>{route.colour || 'Colour unrecorded'}</T></View><T weight={600} lines={1} style={{ marginTop: 2 }}>{route.route_name}</T>{routeMeta(route) || route.setter ? <T size={12} color={c['ink-muted']} lines={1}>{routeMeta(route) || `Set by ${route.setter}`}</T> : null}</View><View style={[s.row, { gap: 4 }]}><T size={12} weight={700} color={c.accent}>Edit</T><Icon name="next" size={16} /></View>
      </A>} /></View>}
    </View>
    <A href="/explore/leaderboards" style={[s.between, { minHeight: 56, gap: 12, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline }]}><T weight={600}>Gym leaderboard</T><View style={[s.row, { gap: 8 }]}><T size={12} weight={600} color={c['ink-muted']}>Planned</T><Icon name="next" size={16} /></View></A>
  </View></Screen>;
}
