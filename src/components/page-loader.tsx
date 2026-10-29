import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { BouldyLoader, type BouldyLoaderVariant } from './bouldy-loader';
import { T } from './primitives';
import { colors as c } from '../theme/colors';

export function LoadingPatience() {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 8000);
    return () => clearTimeout(timer);
  }, []);
  return <T size={12} color={c['ink-muted']} style={{ minHeight: 30, maxWidth: 220, lineHeight: 18 }}>
    {slow ? 'Taking a little longer. We’re still fetching your data.' : ''}
  </T>;
}

export function PageLoader({ label = 'Finding your next hold…', variant = 'ascent' }: { label?: string; variant?: BouldyLoaderVariant }) {
  return <View accessibilityState={{ busy: true }} style={{ flex: 1, minHeight: '100%', padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}>
    <View accessibilityLiveRegion="polite" style={{ alignItems: 'center', gap: 14 }}>
      <BouldyLoader variant={variant} />
      <T display size={24} color={c.ink} style={{ lineHeight: 32, textTransform: 'uppercase', textAlign: 'center' }}>{label}</T>
      <LoadingPatience />
    </View>
  </View>;
}
