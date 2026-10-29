import { View, type DimensionValue, type ViewStyle } from 'react-native';
import { BouldyLoader } from './bouldy-loader';
import { LoadingPatience } from './page-loader';
import { T } from './primitives';
import { colors as c } from '../theme/colors';

// Source-derived geometry; remaining variants stay open in the parity register.
export type SkeletonPage = 'home' | 'sessions' | 'session' | 'login' | 'signup' | 'gyms' | 'form' | 'climbs' | 'placeholder';
const labels: Record<SkeletonPage, string> = {
  climbs: 'Gathering your climbs…', placeholder: 'Opening…',
  form: 'Opening the route form…',
  gyms: 'Finding your next wall…', signup: 'Getting you started…',
  home: 'Loading your progress…', sessions: 'Opening your journal…',
  session: 'Getting your routes ready…', login: 'Preparing your login…',
};
const line: ViewStyle = { borderColor: c.hairline };
// color-mix(in oklch, oklch(.16 0 0) 9%, oklch(.985 0 0)): L=.91075, sRGB #e1e1e1.
function Bone({ height, width = '100%', style, dark = false }: { height: number; width?: DimensionValue; style?: ViewStyle; dark?: boolean }) {
  return <View style={[{ height, width, borderRadius: 4, backgroundColor: dark ? c['panel-track'] : '#e1e1e1' }, style]} />;
}
function Summary() {
  return <View style={{ backgroundColor: c.panel, borderRadius: 16, padding: 20 }}>
    <Bone dark height={12} width={96} /><Bone dark height={28} width="75%" style={{ marginTop: 12 }} />
    <Bone dark height={12} width="50%" style={{ marginTop: 12 }} />
    <View style={{ flexDirection: 'row', gap: 20, borderTopWidth: 1, borderColor: c['panel-track'], marginTop: 20, paddingTop: 16 }}>
      {[0, 1, 2].map(i => <View key={i} style={{ flex: 1 }}><Bone dark height={24} width={24} /><Bone dark height={8} style={{ marginTop: 8 }} /></View>)}
    </View>
  </View>;
}
function Routes({ action = true }: { action?: boolean }) {
  return <View>
    <View style={{ flexDirection: 'row', gap: 8 }}><Bone height={44} style={{ flex: 1, width: undefined, borderRadius: 999 }} /><Bone height={44} width={96} style={{ borderRadius: 999 }} /></View>
    <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>{[0, 1, 2, 3, 4].map(i => <Bone key={i} height={36} width={56} style={{ borderRadius: 999 }} />)}</View>
    <View style={{ marginTop: 12 }}>{[0, 1, 2, 3, 4].map(i => <View key={i} style={[line, { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: i ? 1 : 0 }]}>
      <Bone height={40} width={40} style={{ borderRadius: 12 }} /><View style={{ flex: 1 }}><Bone height={16} width="33.333%" /><Bone height={12} width="60%" style={{ marginTop: 8 }} /></View>{action ? <Bone height={44} width={56} style={{ borderRadius: 999 }} /> : null}
    </View>)}</View>
  </View>;
}
export function PageSkeleton({ page }: { page: SkeletonPage }) {
  const auth = page === 'login' || page === 'signup';
  return <View accessibilityLabel={labels[page]} accessibilityState={{ busy: true }} style={{ flexGrow: 1, minHeight: '100%', paddingTop: auth ? 40 : 24, paddingBottom: auth ? 40 : 32, paddingHorizontal: auth ? 24 : 20, justifyContent: auth ? 'center' : undefined, backgroundColor: c.bg }}>
    <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 32, marginBottom: 22 }}><BouldyLoader variant={auth ? 'hold' : 'traverse'} /><T size={12} weight={600} color={c['ink-muted']}>{labels[page]}</T></View>
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ gap: 24 }}>
      {auth ? <View><Bone height={32} width={96} /><View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 28 }}><View style={{ flex: 1 }}><Bone height={64} /><Bone height={12} width="80%" style={{ marginTop: 12 }} /></View><Bone height={80} width={80} style={{ borderRadius: 16 }} /></View></View>
        : page === 'home' ? <View><Bone height={32} width={96} /><Bone height={12} width="60%" style={{ marginTop: 24 }} /><Bone height={80} width="60%" style={{ marginTop: 12 }} /></View>
        : <View><Bone height={12} width={128} /><Bone height={36} width="60%" style={{ marginTop: 12 }} /></View>}
      {auth ? <><View style={{ gap: 16 }}>{Array.from({ length: page === 'signup' ? 4 : 2 }, (_, i) => <View key={i}><Bone height={12} width={80} style={{ marginBottom: 8 }} /><Bone height={48} style={{ borderRadius: 12 }} /></View>)}</View><Bone height={52} style={{ borderRadius: 999 }} /><Bone height={16} width="75%" style={{ alignSelf: 'center' }} /></>
        : page === 'climbs' ? <><Bone height={48} style={{borderRadius:999}}/><Bone height={64}/><Routes action={false}/></>
        : page === 'placeholder' ? <><Summary/><View style={[line,{borderTopWidth:1,borderBottomWidth:1}]}>{[0,1,2].map(i=><View key={i} style={[line,{paddingVertical:20,borderTopWidth:i?1:0}]}><Bone height={20} width="60%"/><Bone height={12} width="80%" style={{marginTop:12}}/></View>)}</View></>
        : page === 'form' ? <><Bone height={96} style={{ borderRadius: 16 }} /><View><Bone height={12} width={80} style={{ marginBottom: 8 }} /><Bone height={48} style={{ borderRadius: 12 }} /></View><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{Array.from({ length: 8 }, (_, i) => <Bone key={i} height={80} width="23%" style={{ flexGrow: 1, borderRadius: 12 }} />)}</View><Bone height={48} style={{ borderRadius: 12 }} /></>
        : page === 'gyms' ? <><View style={[line, { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 20 }]}><Bone height={24} width={128} /></View><Bone height={24} width={112} /><View style={[line, { borderTopWidth: 1, borderBottomWidth: 1 }]}>{[0, 1, 2, 3].map(i => <View key={i} style={[line, { paddingVertical: 20, borderTopWidth: i ? 1 : 0 }]}><Bone height={20} width="60%" /><Bone height={12} width="40%" style={{ marginTop: 12 }} /></View>)}</View></>
        : page === 'sessions' ? <><Bone height={48} style={{ borderRadius: 999 }} /><Summary /><Bone height={56} style={{ borderRadius: 12 }} /><Bone height={24} width="33.333%" />
          <View>{[0, 1, 2, 3].map(i => <View key={i} style={[line, { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12, borderTopWidth: i ? 1 : 0 }]}><Bone height={56} width={56} style={{ borderRadius: 12 }} /><View style={{ flex: 1 }}><Bone height={20} width="60%" /><Bone height={12} width="40%" style={{ marginTop: 8 }} /></View></View>)}</View></>
        : <><Summary />{page === 'home' ? <><Bone height={52} style={{ borderRadius: 999 }} /><Bone height={24} width="50%" />
          <View style={[line, { flexDirection: 'row', gap: 16, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 16 }]}>{[0, 1, 2, 3].map(i => <View key={i} style={{ flex: 1 }}><Bone height={28} width={28} /><Bone height={12} style={{ marginTop: 8 }} /></View>)}</View><Bone height={24} width="60%" />
          {[0, 1].map(i => <View key={i} style={[line, { borderTopWidth: 1, paddingTop: 16 }]}><Bone height={20} width="60%" /><Bone height={12} width="33.333%" style={{ marginTop: 8 }} /></View>)}</> : <><Bone height={24} width="33.333%" /><Routes /></>}</>}
    </View>
    <View style={{ marginTop: 20 }}><LoadingPatience /></View>
  </View>;
}

export function skeletonPageForPath(path: string): SkeletonPage | undefined {
 if(path==='/')return 'home';if(path==='/sessions'||path==='/history')return 'sessions';if(path==='/climbs')return 'climbs';if(/^\/sessions\/[^/]+\/?$/.test(path))return 'session';if(path==='/gyms')return 'gyms';if(/\/routes\/new$|\/routes\/[^/]+\/edit$/.test(path))return 'form';if(path==='/explore'||path.startsWith('/explore/')||/^\/profile\/.+/.test(path)||/^\/routes\/[^/]+\/beta$/.test(path))return 'placeholder';if(path==='/login'||path==='/signup')return path.slice(1) as 'login'|'signup';
}
