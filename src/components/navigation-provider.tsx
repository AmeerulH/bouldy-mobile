import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Platform, View } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationStart } from '../platform/navigation-state';
import { PageSkeleton, skeletonPageForPath } from './page-skeleton';
import { PageLoader } from './page-loader';
import { colors as c } from '../theme/colors';
export function NavigationProvider({ children }: { children: ReactNode }) {
  const path = usePathname(), insets = useSafeAreaInsets(), timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [pending, setPending] = useState<{ source: string; destination: string } | null>(null);
  const stop=useCallback(()=>{ clearTimeout(timer.current); setPending(null); },[]);
  useEffect(() => { if (pending && pending.source !== path) { const frame = requestAnimationFrame(stop); return () => cancelAnimationFrame(frame); } }, [path, pending, stop]);
  useEffect(() => {
    if (Platform.OS !== 'web') return () => clearTimeout(timer.current);
    window.addEventListener('error', stop); window.addEventListener('unhandledrejection', stop);
    return () => { clearTimeout(timer.current); window.removeEventListener('error', stop); window.removeEventListener('unhandledrejection', stop); };
  }, [stop]);
  function start(href: string) {
    const destination = new URL(href, 'http://local');
    if (destination.origin !== 'http://local' || destination.pathname === path) return;
    clearTimeout(timer.current); setPending({ source: path, destination: destination.pathname });
    timer.current = setTimeout(stop, 45_000);
  }
  const page = pending ? skeletonPageForPath(pending.destination) : undefined;
  const auth = ['/welcome', '/login', '/signup', '/brand-preview'].includes(path);
  const forms = /\/routes\/new$|\/routes\/[^/]+\/edit$/.test(path);
  return <NavigationStart.Provider value={start}>{children}{pending ? <View accessibilityLabel="Opening page" style={{ position: 'absolute', top: auth ? 0 : insets.top, left: 0, right: 0, bottom: auth || forms ? 0 : 64 + insets.bottom, zIndex: 20, backgroundColor: c.bg }}>{page ? <PageSkeleton page={page} /> : <PageLoader />}</View> : null}</NavigationStart.Provider>;
}
