import { useEffect, useRef, type ReactNode, type TouchEvent } from 'react';
import { usePathname, useRouter } from 'expo-router';
import { pageTransition, tabSwipeDestination } from '../features/page-motion';

/** DOM version retains source input exclusions and browser edge-gesture space. */
export function PageMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname(), router = useRouter(), previous = useRef(pathname);
  const element = useRef<HTMLDivElement>(null), touch = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const transition = pageTransition(previous.current, pathname);
    previous.current = pathname; touch.current = null;
    if (!transition || !element.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = element.current.animate([
      { transform: `translateX(${transition.distance}px)`, opacity: .7 },
      { transform: 'translateX(0)', opacity: 1 },
    ], { duration: transition.duration, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    return () => animation.cancel();
  }, [pathname]);
  function start(event: TouchEvent) {
    touch.current = null;
    if (event.touches.length !== 1) return;
    if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select, summary, dialog, [data-no-swipe], [role="button"], [role="link"], [role="tab"], [role="textbox"]')) return;
    const point = event.touches[0];
    touch.current = { x: point.clientX, y: point.clientY };
  }
  function end(event: TouchEvent) {
    const origin = touch.current; touch.current = null;
    if (!origin || !event.changedTouches[0]) return;
    const point = event.changedTouches[0];
    const next = tabSwipeDestination(pathname, origin, { x: point.clientX, y: point.clientY }, window.innerWidth);
    if (next) router.push(next as never);
  }
  return <div ref={element} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }} onTouchStart={start} onTouchEnd={end} onTouchCancel={() => { touch.current = null; }}>{children}</div>;
}
