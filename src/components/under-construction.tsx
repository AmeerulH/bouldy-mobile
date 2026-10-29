import type { ReactNode } from 'react';
import { View } from 'react-native';
import { A, Heading, Hold, Icon, T } from './primitives';
import { Screen } from './screen';
import { colors as c } from '../theme/colors';
import { s } from '../theme/styles';
export type RelatedLink = { href: string; label: string; hint: string };
export function UnderConstruction({ back, eyebrow, title, summary, coming, blocker, holds = ['red', 'blue'], related, children }: { back?: { href: string; label: string }; eyebrow: string; title: string; summary: string; coming: string[]; blocker: string; holds?: [string, string]; related?: RelatedLink[]; children?: ReactNode }) {
  return <Screen back={back?.href} label={back?.label}><View style={[s.page, { gap: 28, paddingTop: back ? 20 : 24 }]}>
    <View><View style={[s.row, { gap: 8 }]}><T color={c['ink-muted']}>{eyebrow}</T><View style={{ borderRadius: 999, backgroundColor: c['accent-tint'], paddingHorizontal: 10, paddingVertical: 4 }}><T size={12} weight={700} color={c['accent-tint-ink']}>Planned</T></View></View><Heading size={36} style={{ marginTop: 4, lineHeight: 32.4, letterSpacing: -1.08 }}>{title}</Heading></View>
    {children}
    <View accessibilityLabel="Status" style={[s.panel, s.row, { gap: 16 }]}><View style={{ flex: 1 }}><T size={12} weight={500} color={c['panel-ink-muted']} style={{ letterSpacing: 1.44 }}>CLOSED FOR SETTING</T><T color={c['panel-ink']} style={{ marginTop: 8, lineHeight: 24 }}>{summary}</T><T size={12} color={c['panel-ink-muted']} style={{ marginTop: 8, lineHeight: 20 }}>Nothing on this screen is real activity. No climbs, names or scores are shown until it ships.</T></View><View accessibilityElementsHidden style={{ width: 64, height: 80 }}><Hold colour={holds[0]} size={56} style={{ position: 'absolute', top: 0, left: 0, transform: [{ rotate: '-12deg' }] }} /><Hold colour={holds[1]} size={48} style={{ position: 'absolute', bottom: 0, right: 0, transform: [{ rotate: '12deg' }] }} /></View></View>
    <View><Heading>What&apos;s coming</Heading><View style={{ marginTop: 12, borderTopWidth: 1, borderColor: c.hairline }}>{coming.map((item, index) => <View key={item} style={{ flexDirection: 'row', gap: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: c.hairline }}><T display size={20} weight={800} color={c['ink-faint']} style={{ width: 16, lineHeight: 24 }}>{index + 1}</T><T style={{ flex: 1, lineHeight: 24 }}>{item}</T></View>)}</View></View>
    <View><Heading>Why it isn&apos;t live</Heading><T color={c['ink-muted']} style={{ marginTop: 12, lineHeight: 24 }}>{blocker}</T></View>
    {related?.length ? <View accessibilityLabel="Related" style={{ borderTopWidth: 1, borderColor: c.hairline }}>{related.map(link => <A key={link.href} href={link.href} style={[s.between, { minHeight: 56, gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: c.hairline }]}><View style={{ flex: 1 }}><T weight={600}>{link.label}</T><T size={12} color={c['ink-muted']} style={{ marginTop: 2 }}>{link.hint}</T></View><Icon name="next" size={16} /></A>)}</View> : null}
  </View></Screen>;
}
