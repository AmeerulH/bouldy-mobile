import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { A, Brand, Button, Feedback, Field, Heading, Hold, Icon, Result, T } from '../../components/primitives';
import { Pressable } from '../../components/pressable';
import { Screen } from '../../components/screen';
import { Sheet } from '../../components/sheet';
import { PageSkeleton, type SkeletonPage } from '../../components/page-skeleton';
import { PageLoader } from '../../components/page-loader';
import { BouldyLoader } from '../../components/bouldy-loader';
import { JournalSwitch } from '../../components/journal-switch';
import { JournalWarning } from '../../components/journal-warning';
import { SlideTextButton } from '../../components/slide-text-button';
import { StyleSelect } from '../../components/style-select';
import { RouteMark } from '../../components/route-mark';
import { RouteForm } from '../../components/route-editor';
import { RouteBrowser } from '../../components/route-browser';
import { UnderConstruction } from '../../components/under-construction';
import { NotFound } from '../../components/not-found';
import { useSnackbar } from '../../components/snackbar';
import { ROUTE_COLOURS } from '../../domain/route-options';
import { routeStates } from '../../features/session-state';
import { colors as c } from '../../theme/colors';
const sample = { id: 24, gym_id: 1, route_name: 'Red Horizon', grade: 'V3', colour: 'Teal', wall: 'Cave wall', setter: 'Fawwaz', set_date: '2026-09-30', retired_date: null, status: 'active' as const, styles: ['Overhang', 'Pinches', 'Heel Hook'] };
export default function ComponentPreview() {
  const { demo } = useLocalSearchParams<{ demo?: string }>(), show = useSnackbar();
  const [open, setOpen] = useState(''), [value, setValue] = useState(''), [style, setStyle] = useState('');
  if (!__DEV__) return <NotFound />;
  if (demo === 'add' || demo === 'edit') return <RouteForm demo gymId={1} route={demo === 'edit' ? sample : undefined} back="/component-preview" backLabel="Component catalogue" subtitle="Demo data · no records are written" />;
  if (demo === 'planned') return <UnderConstruction back={{ href: '/component-preview', label: 'Component catalogue' }} eyebrow="Local preview" title="Leaderboards" summary="Rankings you can understand." coming={['Source planned-page state.']} blocker="No scores or activity are live." related={[{ href: '/component-preview', label: 'Catalogue', hint: 'Return to local examples' }]} />;
  const card = (title: string, children: ReactNode) => <View key={title} style={{ paddingVertical: 20, gap: 16, borderBottomWidth: 1, borderColor: c.hairline }}><Heading size={20}>{title}</Heading>{children}</View>;
  const states = routeStates([sample, { ...sample, id: 25, gym_id: 2, grade: 'V5', route_name: 'Blue Note', colour: 'Blue' }], [], { sessionsLoaded: true, records: [] }, 0, true);
  return <Screen><View style={{ padding: 20 }}><Heading size={30}>Component catalogue</Heading><T color={c['ink-muted']} style={{ marginTop: 8, lineHeight: 24 }}>Local preview only · representative states from the 20 source stories. Demo controls do not write climbing records.</T>
    {card('Brand/Wordmark', <View style={{ gap: 16 }}><Brand /><Image source={require('../../../assets/source/brand/bolt-b.svg')} style={{ width: 28, height: 28 }} /></View>)}
    {card('Brand/Auth Heading', <View style={{ gap: 20 }}>{[false, true].map(signup => <View key={String(signup)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><View style={{ flex: 1 }}><Heading size={36}>{signup ? 'Every climb.\nYour story.' : 'Back for\nanother try.'}</Heading><T color={c['ink-muted']} style={{ marginTop: 12, lineHeight: 24 }}>{signup ? 'Start your journal. Find your next wall.' : 'Your projects, sends and small wins. All here.'}</T></View><Hold colour={signup ? 'green' : 'red'} size={72} /></View>)}</View>)}
    {card('Climbing/Route Hold', <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{ROUTE_COLOURS.map(colour => <Hold key={colour} colour={colour} />)}<Hold colour="blue" name="The Arete" /></View>)}
    {card('Climbing/Route Mark', <View style={{ flexDirection: 'row', gap: 12 }}><RouteMark colour="blue" grade="V3" /><RouteMark colour="yellow" grade="V5" /></View>)}
    {card('Climbing/Route Browser', <RouteBrowser items={states.map((state, i) => ({ state, status: 'project', pinned: false, gym: { id: i + 1, name: `Sample gym ${i + 1}` } }))} groupByGym ended storageKey="catalogue" openFilters={() => setOpen('filters')} filtersOpen={open === 'filters'} closeFilters={() => setOpen('')} renderRow={({ route }) => <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64 }}><Hold colour={route.colour} /><View style={{ flex: 1 }}><Heading size={20}>{route.grade}</Heading><T>{route.route_name}</T></View><Result result="project" /></View>} />)}
    {card('Climbing/Route Form', <View style={{ gap: 8 }}><Button onPress={() => router.setParams({ demo: 'add' })}>Add route</Button><Button variant="soft" onPress={() => router.setParams({ demo: 'edit' })}>Edit route</Button></View>)}
    {card('Navigation/Bottom Navigation', <View style={{ gap: 20 }}>{['Sessions', 'You', 'Explore'].map(active => <View key={active} style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: c.hairline, paddingTop: 8 }}>{[['Home', 'home'], ['Explore', 'explore'], ['Sessions', 'sessions'], ['Gyms', 'gyms'], ['You', 'profile']].map(([label, icon]) => <View key={label} style={{ flex: 1, alignItems: 'center', gap: 4 }}><Icon name={icon} color={label === active ? c.accent : c['ink-faint']} /><T size={11} color={label === active ? c.accent : c['ink-faint']}>{label}</T></View>)}</View>)}</View>)}
    {card('Navigation/Journal Switch', <View style={{ gap: 12 }}><JournalSwitch active="sessions" /><JournalSwitch active="climbs" /></View>)}
    {card('Navigation/Screen Header', <View style={{ minHeight: 56, borderBottomWidth: 1, borderColor: c.hairline, justifyContent: 'center' }}><A href="/component-preview"><View style={{ flexDirection: 'row', gap: 8 }}><Icon name="back" /><T weight={600} lines={1}>A gym with a very long name that must truncate</T></View></A></View>)}
    {card('Loading/Bouldy Loader', <View style={{ flexDirection: 'row', gap: 24 }}>{(['ascent', 'traverse', 'hold'] as const).map(variant => <BouldyLoader key={variant} variant={variant} />)}</View>)}
    {card('Loading/Page Loader', <View style={{ height: 240 }}><PageLoader label="Opening your journal…" /></View>)}
    {card('Loading/Page Skeleton', <View style={{ gap: 8 }}>{(['home', 'sessions', 'climbs', 'session', 'gyms', 'form', 'placeholder', 'login', 'signup'] as SkeletonPage[]).map(page => <View key={page}><Pressable onPress={() => setOpen(open === page ? '' : page)}><T weight={600}>{page}</T></Pressable>{open === page ? <PageSkeleton page={page} /> : null}</View>)}</View>)}
    {card('Actions/Button', <View style={{ gap: 8 }}><Button onPress={() => {}}>Start a session</Button><Button variant="dark" onPress={() => {}}>End session</Button><Button variant="soft" onPress={() => {}}>Correct log</Button><Button pending pendingLabel="" onPress={() => {}}>Disabled</Button></View>)}
    {card('Actions/Submit Button', <View style={{ gap: 8 }}><Button onPress={() => {}}>Save</Button><Button pending pendingLabel="Saving" onPress={() => {}}>Save</Button></View>)}
    {card('Feedback/Inline Message', <View style={{ gap: 8 }}><Feedback>We couldn’t save that attempt. Try again.</Feedback><JournalWarning /></View>)}
    {card('Feedback/Snackbar', <View style={{ gap: 8 }}><Button onPress={() => show('Private note saved.')}>Success</Button><Button variant="soft" onPress={() => show('Gym added. You can start a session now, or add its routes first.')}>Long message</Button></View>)}
    {card('Forms/Fields', <View style={{ gap: 16 }}><Field label="Route name" value={value} onChangeText={setValue} placeholder="e.g. Blue Note" /><Field label="Attempts" value={value} onChangeText={setValue} keyboardType="number-pad" /><StyleSelect value={style} onChange={setStyle} /></View>)}
    {card('Overlays/Bottom Sheet', <View style={{ gap: 8 }}><Button onPress={() => setOpen('sheet')}>Add a gym</Button><Button variant="soft" onPress={() => setOpen('sheet-error')}>With error</Button><Button variant="neutral" onPress={() => setOpen('sheet-long')}>Long content</Button></View>)}
    {card('Foundation/Section Heading', <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}><Heading>Route log</Heading><T color={c['ink-muted']}>6 total</T></View>)}
    {card('Pages/Under Construction', <Button variant="soft" onPress={() => router.setParams({ demo: 'planned' })}>Open planned-page state</Button>)}
    {card('Actions/Slide Text', <SlideTextButton href="/component-preview" text="Sign up" hoverText="Let’s go" />)}
    <T color={c['ink-muted']} style={{ marginTop: 20 }}>The unmounted source ThemeSwitcher is preserved in reference/source/components/theme-switcher.tsx. Theme selection is not a product feature.</T>
  </View><Sheet title="Add a gym" open={open.startsWith('sheet')} close={() => setOpen('')}><View style={{ gap: 16 }}>{open === 'sheet-error' ? <Feedback>Enter a gym name and location.</Feedback> : null}<Field label="Gym name" value={value} onChangeText={setValue} placeholder="e.g. Bump Bouldering" />{open === 'sheet-long' ? Array.from({ length: 12 }, (_, i) => <T key={i}>Sample long sheet content {i + 1}</T>) : <Field label="Location" value={value} onChangeText={setValue} placeholder="e.g. Petaling Jaya" />}<Button onPress={() => setOpen('')}>Add gym</Button></View></Sheet></Screen>;
}
