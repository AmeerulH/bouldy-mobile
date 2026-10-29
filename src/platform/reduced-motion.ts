import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/** Start static during SSR/hydration; follow preference changes while mounted. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    if (Platform.OS === 'web') {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      const update = () => setReduced(query.matches);
      update();
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }
    let changed = false, alive = true;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', value => {
      changed = true;
      setReduced(value);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then(value => {
      if (alive && !changed) setReduced(value);
    }).catch(() => {}); // Keep the static fallback if preference lookup fails.
    return () => { alive = false; subscription.remove(); };
  }, []);
  return reduced;
}
