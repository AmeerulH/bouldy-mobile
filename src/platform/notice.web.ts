import { useEffect, useSyncExternalStore } from 'react';
import { usePathname, useGlobalSearchParams } from 'expo-router';

const event = 'bouldy:sheet-location';
function subscribe(listener: () => void) {
  window.addEventListener(event, listener); window.addEventListener('popstate', listener);
  return () => { window.removeEventListener(event, listener); window.removeEventListener('popstate', listener); };
}
const snapshot = () => window.location.search;
export function useNotice(show: (message: string) => void) {
  const search = useSyncExternalStore(subscribe, snapshot, () => '');
  const pathname = usePathname(), params = useGlobalSearchParams<{ notice?: string }>();
  useEffect(() => {
    // Read the current URL at consumption time, including manual same-page sheet redirects.
    const url = new URL(window.location.href), notice = url.searchParams.get('notice');
    if (!notice) return;
    url.searchParams.delete('notice');
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
    window.dispatchEvent(new Event(event));
    show(notice);
  }, [search, pathname, params.notice, show]);
}
