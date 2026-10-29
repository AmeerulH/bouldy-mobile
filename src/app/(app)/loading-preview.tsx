import { Pressable } from '../../components/pressable';
import { useState } from 'react';
import { View } from 'react-native';
import { BouldyLoader } from '../../components/bouldy-loader';
import { NotFound } from '../../components/not-found';
import { PageSkeleton, type SkeletonPage } from '../../components/page-skeleton';
import { Screen } from '../../components/screen';
import { Heading, T } from '../../components/primitives';
import { colors as c } from '../../theme/colors';
const pages: SkeletonPage[] = ['home', 'sessions', 'session', 'gyms', 'login', 'signup'];
export default function LoadingPreview() {
  const [open, setOpen] = useState<string[]>([]);
  if (!__DEV__) return <NotFound />;
  return <Screen><View style={{ paddingHorizontal: 20, paddingVertical: 24 }}><Heading size={30}>A little hang time.</Heading><T color={c['ink-muted']} style={{ marginTop: 8 }}>Bouldy’s loading states. Local preview only.</T><View style={{ marginVertical: 32, gap: 24 }}>{(['ascent', 'traverse', 'hold'] as const).map(variant => <View key={variant} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: c.hairline, paddingBottom: 20 }}><View><T weight={600} style={{ textTransform: 'capitalize' }}>{variant}</T><T size={12} color={c['ink-muted']}>{variant === 'ascent' ? 'Full-screen waits' : variant === 'traverse' ? 'Page loading' : 'Small areas & account screens'}</T></View><BouldyLoader variant={variant} /></View>)}</View><Heading>Page skeletons</Heading>{pages.map(page => <View key={page} style={{ borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: 16 }}><Pressable accessibilityRole="button" accessibilityState={{ expanded: open.includes(page) }} onPress={() => setOpen(old => old.includes(page) ? old.filter(value => value !== page) : [...old, page])} style={{ paddingVertical: 8 }}><T weight={600} style={{ textTransform: 'capitalize' }}>{page}</T></Pressable>{open.includes(page) ? <PageSkeleton page={page} /> : null}</View>)}</View></Screen>;
}
