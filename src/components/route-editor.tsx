import { Pressable } from './pressable';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform,  View, useWindowDimensions } from 'react-native';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../platform/auth';
import { useSnapshot } from '../data/snapshot';
import type { Route } from '../data/types';
import { normaliseRouteColour, ROUTE_COLOURS, ROUTE_STYLES } from '../domain/route-options';
import { colors as c } from '../theme/colors';
import { s } from '../theme/styles';
import { A, Button, Feedback, Field, Heading, Hold, Icon, T } from './primitives';
import { Screen, Waiting } from './screen';
import { StyleSelect } from './style-select';

export function RouteEditor({ kind }: { kind: 'gym' | 'session' | 'edit' }) {
  const { id, routeId, error } = useLocalSearchParams<{ id: string; routeId?: string; error?: string }>();
  const { data, error: readError } = useSnapshot(kind === 'session' ? 'session-route-form' : 'route-form', id, kind === 'edit' ? routeId : undefined);
  const auth = useAuth();
  const back = kind === 'session' ? `/sessions/${id}` : `/gyms/${id}`;
  if (!data) return <Screen back={back} label={kind === 'session' ? 'Session' : 'Gyms'}><Waiting page="form" error={readError} /></Screen>;
  if (kind === 'session' && data.session.duration_minutes > 0) return <Redirect href={back as never} />;
  const route = kind === 'edit' ? data.route : undefined;
  return <RouteForm key={`${auth.user?.id}:${kind}:${id}:${routeId ?? ''}`} gymId={data.gym.id} sessionId={kind === 'session' ? data.session.id : undefined} route={route} back={back} backLabel={kind === 'session' ? 'Session' : data.gym.name} subtitle={route ? `${route.grade} · ${route.route_name}` : kind === 'session' ? `It will be added to ${data.gym.name}, ready to log.` : `New route at ${data.gym.name}`} initialError={error} />;
}

export function RouteForm({ gymId, sessionId, route, back, backLabel, subtitle, initialError, demo = false }: { gymId: number; sessionId?: number; route?: Route; back: string; backLabel: string; subtitle: string; initialError?: string; demo?: boolean }) {
  const auth = useAuth(), insets = useSafeAreaInsets(), busy = useRef(false), { width } = useWindowDimensions();
  const colourWidth = (Math.min(width, 430) - 64) / 4;
  const [colour, setColour] = useState(normaliseRouteColour(route?.colour) ?? ''), [grade, setGrade] = useState(route?.grade ?? '');
  const [wall, setWall] = useState(route?.wall ?? ''), [name, setName] = useState(route?.route_name ?? ''), [setter, setSetter] = useState(route?.setter ?? '');
  const [mainStyle, setMainStyle] = useState(route?.styles[0] ?? ''), [otherStyles, setOtherStyles] = useState(route?.styles.slice(1) ?? []);
  const [showStyles, setShowStyles] = useState(Boolean(route && route.styles.length > 1)), [pending, setPending] = useState(false), [error, setError] = useState(initialError ?? '');
  async function save() {
    if (busy.current) return;
    busy.current = true; setPending(true); setError('');
    try {
      const out = demo ? {} : await auth.command(route ? 'editRoute' : 'addRoute', { gym_id: gymId, ...(sessionId ? { session_id: sessionId } : {}), ...(route ? { route_id: route.id } : {}), grade, colour: ROUTE_COLOURS.find(option => option.toLowerCase() === colour) ?? '', wall, route_name: name, setter, main_style: mainStyle, style: otherStyles });
      if (out.destination) {
        const message = new URL(out.destination, 'http://local').searchParams.get('error');
        if (message) { setError(message); router.setParams({ error: message }); }
        else if (out.replace) router.replace(out.destination as never);
        else router.push(out.destination as never);
      }
    } catch (issue) { setError((issue as Error).message); }
    finally { busy.current = false; setPending(false); }
  }
  return <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><Screen back={back} label={backLabel}><View style={[s.page, { gap: 20, paddingBottom: 20 }]}>
    <View><Heading size={36} style={{ lineHeight: 32.4, letterSpacing: -1.08 }}>{route ? 'Edit route' : 'Add a route'}</Heading><T color={c['ink-muted']} style={{ marginTop: 8 }}>{subtitle}</T></View>
    {error ? <Feedback>{error}</Feedback> : null}
    {route ? <A href={`/routes/${route.id}/beta`} style={[s.between, { minHeight: 56, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, gap: 12 }]}><T weight={600}>Beta photos and videos</T><View style={[s.row, { gap: 8 }]}><T size={12} weight={600} color={c['ink-muted']}>Planned</T><Icon name="next" size={16} /></View></A> : null}
    <View style={[s.row, { gap: 16, borderRadius: 16, backgroundColor: c.panel, paddingHorizontal: 16, paddingVertical: 12 }]}><Hold colour={colour || 'grey'} size={80} /><View style={{ flex: 1 }}><T size={12} weight={600} color={c['panel-ink-muted']} style={{ textTransform: 'uppercase', letterSpacing: .96 }}>Route preview</T><Heading size={30} color={c['panel-ink']} style={{ marginTop: 4 }}>{grade.trim() || '—'}</Heading><T color={c['panel-ink-muted']} style={{ marginTop: 4 }}>{colour ? `${colour[0].toUpperCase()}${colour.slice(1)} hold` : 'Choose a hold colour'}</T></View></View>
    <Field label="Gym grade" value={grade} onChangeText={setGrade} placeholder="e.g. V3 or 3 dots" editable={!pending} />
    <View><T weight={600}>Route colour</T><T size={12} color={c['ink-muted']} style={{ marginTop: 4 }}>Pick the hold you see on the wall.</T><View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>{ROUTE_COLOURS.map(option => {
      const value = option.toLowerCase(), selected = colour === value;
      return <Pressable key={option} accessibilityRole="radio" accessibilityLabel={option} accessibilityState={{ checked: selected }} disabled={pending} onPress={() => setColour(value)} style={{ width: colourWidth, minHeight: 86, paddingHorizontal: 4, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: selected ? c.accent : c.hairline, borderRadius: 12, backgroundColor: selected ? c['accent-tint'] : c.bg }}><Hold colour={value} size={48} /><T size={12} weight={600} color={selected ? c.ink : c['ink-muted']} lines={1} style={{ marginTop: 4 }}>{option}</T></Pressable>;
    })}</View></View>
    <View style={{ flexDirection: 'row', gap: 12 }}><View style={{ flex: 1 }}><Field label="Wall / area" value={wall} onChangeText={setWall} placeholder="Optional" editable={!pending} /></View><View style={{ flex: 1 }}><StyleSelect value={mainStyle} onChange={setMainStyle} /></View></View>
    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: 8 }}><Pressable accessibilityRole="button" accessibilityState={{ expanded: showStyles }} onPress={() => setShowStyles(!showStyles)} style={[s.between, { minHeight: 44 }]}><T weight={600}>Add more styles</T><T size={18} color={c.accent} style={{ transform: [{ rotate: showStyles ? '45deg' : '0deg' }] }}>+</T></Pressable>{showStyles ? <View style={{ paddingBottom: 12 }}><T size={12} color={c['ink-muted']}>Select as many as fit this route.</T><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>{ROUTE_STYLES.map(style => {
      const checked = otherStyles.includes(style);
      return <Pressable key={style} accessibilityRole="checkbox" accessibilityLabel={style} accessibilityState={{ checked }} disabled={pending} onPress={() => setOtherStyles(previous => checked ? previous.filter(value => value !== style) : [...previous, style])} style={{ borderWidth: 1, borderColor: checked ? c.ink : c.hairline, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: checked ? c.panel : c.bg }}><T size={12} weight={600} color={checked ? c['panel-ink'] : c['ink-muted']}>{style}</T></Pressable>;
    })}</View></View> : null}</View>
    <View style={{ gap: 16, borderTopWidth: 1, borderColor: c.hairline, paddingTop: 16 }}><Field label="Route name" value={name} onChangeText={setName} placeholder="e.g. Red Horizon" editable={!pending} /><Field label="Setter" value={setter} onChangeText={setSetter} placeholder="Optional" editable={!pending} onSubmitEditing={() => void save()} /></View>
    <View style={{ borderWidth: 1, borderColor: c.hairline, borderRadius: 12, padding: 12 }}><T weight={600}>Competition route</T><T size={12} color={c['ink-muted']} style={{ marginTop: 4, lineHeight: 20 }}>Coming soon. Once the gym can mark a route as a comp route, Zone will appear in its session log.</T></View>
  </View></Screen><View style={{ borderTopWidth: 1, borderColor: c.hairline, backgroundColor: c.bg, paddingTop: 12, paddingHorizontal: 20, paddingBottom: Math.max(12, insets.bottom) }}><Button pending={pending} pendingLabel={route ? 'Saving route' : 'Adding route'} onPress={() => void save()}>{route ? 'Save route' : 'Add route'}</Button></View></KeyboardAvoidingView>;
}
