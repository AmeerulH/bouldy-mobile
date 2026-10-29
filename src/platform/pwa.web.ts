import { useEffect } from 'react';
export function usePwa() {
  useEffect(() => {
    if (__DEV__ || !('serviceWorker' in navigator) || !window.isSecureContext) return;
    // Browser installation/update surface only; no product banners or automatic reload.
    const register = () => { void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {}); };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register, { once: true });
    return () => window.removeEventListener('load', register);
  }, []);
}
