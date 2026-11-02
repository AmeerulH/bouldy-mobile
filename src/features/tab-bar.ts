/** The four root screens keep the tab bar. Nested pages are full screen. */
const ROOTS = new Set(["/", "/explore", "/sessions", "/profile"]);

export function showsTabBar(path: string) {
  return ROOTS.has(path);
}
