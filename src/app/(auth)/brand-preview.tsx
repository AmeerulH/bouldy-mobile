import { Platform, View } from 'react-native';
import { Image } from 'expo-image';
import { A, Brand, T, Heading } from '../../components/primitives';
import { Screen } from '../../components/screen';
import { NotFound } from '../../components/not-found';
import { colors as c } from '../../theme/colors';
const proposals = [
  { id: 'bolt-b', name: 'Bolt B', letter: 'A', description: 'A leaning B with bolt-hole counters. Compact, friendly and unmistakably climbing hardware.', asset: require('../../../assets/source/brand/proposals/bolt-b.svg') },
  { id: 'crux', name: 'Crux', letter: 'B', description: 'A cut, angular B with a red finishing hold. Sharper, more athletic, more like a mark on climbing gear.', asset: require('../../../assets/source/brand/proposals/crux.svg') },
  { id: 'three-moves', name: 'Three Moves', letter: 'C', description: 'Three holds, one upward sequence. An open, playful symbol for progress, attempt by attempt.', asset: require('../../../assets/source/brand/proposals/three-moves.svg') },
];
export default function BrandPreview() {
  if (!__DEV__) return <NotFound />;
  return <Screen><View style={{ paddingHorizontal: 24, paddingVertical: 32 }}><Brand /><Heading size={36} style={{ marginTop: 32 }}>Find our mark.</Heading><T color={c['ink-muted']} style={{ marginTop: 12, lineHeight: 24 }}>Bolt B is now Bouldy’s selected app mark. The others remain here as reference proposals.</T>{proposals.map(logo => <View key={logo.id} style={{ borderBottomWidth: 1, borderColor: c.hairline, paddingVertical: 32 }}><View style={{ flexDirection: 'row', minHeight: 128, gap: 16, justifyContent: 'center', alignItems: 'center' }}><Image source={logo.asset} style={{ width: 100, height: 100 }} /><Brand /></View><View style={{ flexDirection: 'row', gap: 24, alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}><Image source={logo.asset} style={{ width: 24, height: 24 }} /><Image source={logo.asset} style={{ width: 40, height: 40 }} /><View style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: c['accent-tint'], alignItems: 'center', justifyContent: 'center' }}><Image source={logo.asset} style={{ width: 48, height: 48 }} /></View></View><T size={18} weight={700}>{logo.letter}. {logo.name}{logo.id === 'bolt-b' ? ' · Selected' : ''}</T><T color={c['ink-muted']} style={{ marginTop: 8, lineHeight: 24 }}>{logo.description}</T>{Platform.OS === 'web' ? <a href={`/brand/proposals/${logo.id}.svg`} download style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, marginTop: 16, fontFamily: 'Geist-600', fontSize: 14, color: c.accent }}>Download SVG</a> : null}</View>)}<A href="/welcome" color={c.ink} style={{ minHeight: 44, marginTop: 24, justifyContent: 'center' }} textStyle={{ textDecorationLine: 'underline' }}>Preview the welcome screen →</A></View></Screen>;
}
