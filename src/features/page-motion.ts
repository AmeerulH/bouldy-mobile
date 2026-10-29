const TABS = ['/', '/explore', '/sessions', '/climbs', '/gyms', '/profile'];
const depth = (path: string) => Math.max(1, path.split('/').filter(Boolean).length);
const tabIndex = (path: string) => TABS.indexOf(`/${path.split('/')[1] ?? ''}`);
export function pageTransition(from: string, to: string) {
  if (from === to) return null;
  const deeper = depth(to) - depth(from);
  const direction = deeper !== 0 ? Math.sign(deeper) : tabIndex(to) < tabIndex(from) ? -1 : 1;
  return { distance: direction * (deeper !== 0 ? 28 : 18), duration: deeper !== 0 ? 260 : 220 };
}
export function tabSwipeDestination(path: string, start: { x: number; y: number }, end: { x: number; y: number }, width: number) {
  if (!TABS.includes(path) || start.x < 28 || start.x > width - 28) return null;
  const dx = end.x - start.x, dy = end.y - start.y;
  if (Math.abs(dx) < 90 || Math.abs(dx) < Math.abs(dy) * 2) return null;
  return TABS[TABS.indexOf(path) + (dx < 0 ? 1 : -1)] ?? null;
}
