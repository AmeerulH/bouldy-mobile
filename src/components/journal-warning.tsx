import { Pressable } from './pressable';
import type { ReactNode } from 'react';

import { Feedback, T } from './primitives';
import { useAuth } from '../platform/auth';
import { colors as c } from '../theme/colors';
export function JournalWarning({ children }: { children?: ReactNode }) {
  const auth = useAuth();
  return <Feedback>{children ?? 'Some climbing records could not be loaded or have conflicting logs. Affected totals are unavailable.'}{' '}<Pressable accessibilityRole="button" onPress={auth.refresh} style={{ minHeight: 44, justifyContent: 'center' }}><T weight={600} color={c['accent-tint-ink']} style={{ textDecorationLine: 'underline' }}>Try again</T></Pressable></Feedback>;
}
