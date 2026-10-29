import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

/** Native stacks retain prior screens; their modal windows must not cover a new destination. */
export function useScreenFocus() {
  const [focused, setFocused] = useState(false);
  useFocusEffect(useCallback(() => {
    setFocused(true);
    return () => setFocused(false);
  }, []));
  return focused;
}
