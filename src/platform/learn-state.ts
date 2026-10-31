import { useCallback, useEffect, useSyncExternalStore } from "react";
import {
  emptyLearnState,
  learnKey,
  parseLearnState,
  type LearnState,
} from "../domain/learn-progress";
import { readLearn, writeLearn } from "./learn-storage";
import { useAuth } from "./auth";

type Entry = { state: LearnState; ready: boolean };
const pending: Entry = { state: emptyLearnState, ready: false };
const entries = new Map<number, Entry>();
const loads = new Map<number, Promise<Entry>>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

function load(id: number) {
  const known = entries.get(id);
  if (known) return Promise.resolve(known);
  let p = loads.get(id);
  if (!p) {
    p = readLearn(learnKey(id))
      .then((raw) => ({ state: parseLearnState(raw), ready: true }))
      .catch(() => ({ state: emptyLearnState, ready: true }))
      .then((entry) => {
        // A write may have landed while reading; never overwrite it.
        const current = entries.get(id) ?? entry;
        entries.set(id, current);
        loads.delete(id);
        emit();
        return current;
      });
    loads.set(id, p);
  }
  return p;
}

/** Device-local tour and lesson progress for the signed-in user. */
export function useLearnState() {
  const { user } = useAuth(),
    id = user?.id;
  const entry = useSyncExternalStore(
    subscribe,
    () => (id === undefined ? pending : (entries.get(id) ?? pending)),
    () => pending,
  );
  useEffect(() => {
    if (id !== undefined) void load(id);
  }, [id]);
  const update = useCallback(
    async (change: (state: LearnState) => LearnState) => {
      if (id === undefined) return;
      const current = await load(id),
        next = { state: change(current.state), ready: true };
      entries.set(id, next);
      emit();
      await writeLearn(learnKey(id), JSON.stringify(next.state));
    },
    [id],
  );
  return { state: entry.state, ready: entry.ready, update };
}
