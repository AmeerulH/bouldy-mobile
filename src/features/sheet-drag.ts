// Source pointer-down/up distance, independent of a recognizer's activation reset.
export function sheetDragDistance(start: number, current: number) {
  'worklet';
  return Math.max(0, current - start);
}
export function sheetDragDismisses(start: number, current: number) {
  'worklet';
  return current - start > 80;
}
