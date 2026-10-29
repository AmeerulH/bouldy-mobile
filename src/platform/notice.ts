import { useEffect, useRef } from 'react';
import { useGlobalSearchParams, usePathname, useRouter } from 'expo-router';

export function useNotice(show: (message: string) => void) {
  const params = useGlobalSearchParams<{ notice?: string }>(), pathname = usePathname(), router = useRouter();
  const handled = useRef<string | null>(null);
  useEffect(() => {
    if (!params.notice) { handled.current = null; return; }
    const key = `${pathname}:${params.notice}`;
    if (handled.current === key) return;
    handled.current = key;
    router.setParams({ notice: undefined });
    show(params.notice);
  }, [params.notice, pathname, router, show]);
}
