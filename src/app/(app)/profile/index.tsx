import { useRef, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { A, Button, Feedback, Heading, Icon, T } from '../../../components/primitives';
import { Screen, Waiting } from '../../../components/screen';
import { JournalWarning } from '../../../components/journal-warning';
import { useSnapshot } from '../../../data/snapshot';
import { summarizeJournal } from '../../../domain/journal-summary';
import { useAuth } from '../../../platform/auth';
import { colors as c } from '../../../theme/colors';
import { s } from '../../../theme/styles';

export default function Profile() {
  const { data, error } = useSnapshot('profile'), auth = useAuth(), busy = useRef(false);
  const [pending, setPending] = useState(false), [logoutError, setLogoutError] = useState('');
  if (!data) return <Screen><Waiting error={error} page="home" /></Screen>;
  const { user, journal, gyms } = data, summary = summarizeJournal(journal), visited = [...new Set(journal.records.map(({ session }) => session.gym_id))];
  async function logout() {
    if (busy.current) return;
    busy.current = true; setPending(true); setLogoutError('');
    try { const out = await auth.command('logout', {}); if (out.destination) router.replace(out.destination as never); }
    catch (issue) { setLogoutError((issue as Error).message); }
    finally { busy.current = false; setPending(false); }
  }
  return <Screen><View style={[s.page, { paddingTop: 24, gap: 28 }]}>
    <View><Heading size={36}>You</Heading><T color={c['ink-muted']} style={{ marginTop: 12, lineHeight: 24 }}>Your account and climbing, in one place. Only you can see this page.</T></View>
    <View accessibilityLabel="Account details" style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: 20 }}><Heading size={30}>{user.username}</Heading><View style={{ marginTop: 16, gap: 16 }}>{[['Email', user.email], ['Current grade', user.current_grade || 'Not set']].map(([label, value]) => <View key={label}><T color={c['ink-muted']}>{label}</T><T weight={600} style={{ marginTop: 4 }}>{value}</T></View>)}</View></View>
    {!summary.reliable ? <JournalWarning /> : null}
    <View><Heading>Your climbing so far</Heading><View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: 20, columnGap: 24, marginTop: 16, borderRadius: 16, padding: 20, backgroundColor: c.panel }}>{[['Sessions', summary.sessions], ['Gyms visited', summary.gyms], ['Sends', summary.sends], ['Flashes', summary.flashes]].map(([label, value]) => <View key={label} style={{ width: '44%', flexGrow: 1 }}><T display size={30} weight={700} color={c['panel-ink']}>{value ?? '—'}</T><T size={12} color={c['panel-ink-muted']} style={{ marginTop: 8 }}>{label}{value === null ? ' · unavailable' : ''}</T></View>)}</View></View>
    <View><Heading>Places you climb</Heading>{!journal.sessionsLoaded ? <T color={c['ink-muted']} style={{ marginTop: 12 }}>Your visited gyms could not be loaded.</T> : visited.length ? <View style={{ marginTop: 12, borderTopWidth: 1, borderColor: c.hairline }}>{visited.map(id => <A key={id} href={`/gyms/${id}`} style={[s.between, { minHeight: 56, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderColor: c.hairline }]}><T weight={600} style={{ flex: 1 }}>{gyms?.find(gym => gym.id === id)?.name ?? `Gym ${id} · name unavailable`}</T><Icon name="arrow" size={16} /></A>)}</View> : <T color={c['ink-muted']} style={{ marginTop: 12, lineHeight: 24 }}>Your first gym will appear here after you start a session.</T>}</View>
    <View><Heading>Profile and privacy</Heading><View style={{ marginTop: 12, borderTopWidth: 1, borderColor: c.hairline }}>{[{ href: '/profile/edit', label: 'Edit profile', hint: 'Display name, bio and photo' }, { href: '/profile/public', label: 'Public profile', hint: 'What other climbers will see' }, { href: '/profile/privacy', label: 'Privacy', hint: 'Who can find and follow you' }].map(row => <A key={row.href} href={row.href} style={[s.between, { minHeight: 56, gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: c.hairline }]}><View style={{ flex: 1 }}><T weight={600}>{row.label}</T><T size={12} color={c['ink-muted']} style={{ marginTop: 2 }}>{row.hint}</T></View><View style={[s.row, { gap: 8 }]}><T size={12} weight={600} color={c['ink-muted']}>Planned</T><Icon name="next" size={16} /></View></A>)}</View></View>
    <A href="/sessions" color={c['panel-ink']} style={[s.button, { backgroundColor: c.panel }]}>Open your journal</A>
    {logoutError ? <Feedback>{logoutError}</Feedback> : null}
    <Button variant="plain" pending={pending} pendingLabel="Logging out" onPress={()=>void logout()} style={{alignSelf:"flex-start"}}>Log out</Button>
  </View></Screen>;
}
