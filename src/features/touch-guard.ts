// Native touch events bubble through the owning Pressable before the page wrapper.
// Retain a small transient set so controls/rails never trigger a peer-tab swipe.
const controls = new Set<number>();
export function markControlTouch(timestamp: number) {
  controls.add(timestamp);
  if (controls.size > 64) controls.delete(controls.values().next().value!);
}
export const isControlTouch = (timestamp: number) => controls.has(timestamp);
