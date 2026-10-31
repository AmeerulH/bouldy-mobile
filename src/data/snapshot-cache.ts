import type { Snapshot } from "./snapshot";
// Process memory only. No private journal data or credentials are persisted.
export const snapshotCache = new Map<string, Snapshot>();
let epoch = 0;
export const snapshotEpoch = () => epoch;
export function clearSnapshotCache() {
  epoch++;
  snapshotCache.clear();
}
