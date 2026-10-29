import React, { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import { request, TransportError } from '../data/client';
import { clearFilterState } from './route-filters';
import { writeCredential } from './credentials';
import { IdentitySession } from './identity-session';
import type { UserResponse } from '../data/types';

export type Outcome = { destination?: string; replace?: boolean; status?: string; message?: string; notes?: string; credential?: string };
type Auth = { user: UserResponse | null; ready: boolean; revision: number; command: (name: string, fields: Record<string, string | number | string[]>) => Promise<Outcome>; expire: () => void; refresh: () => void; hydrationError: string; retry: () => void };
const Context = createContext<Auth>(null!);
const accountChanged = () => new TransportError(409, 'Your account changed. Reload and try again.');

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session] = useState(() => new IdentitySession<UserResponse>({
    read: async () => (await request<{ user: UserResponse }>('/api/identity')).user,
    write: writeCredential,
    clearFilters: clearFilterState,
    unauthorized: error => error instanceof TransportError && error.status === 401,
  }));
  const state = useSyncExternalStore(session.subscribe, session.snapshot, session.snapshot);
  useEffect(() => {
    void session.hydrate();
    if (Platform.OS === 'web') return () => session.cancelRead();
    let previous = AppState.currentState;
    const subscription = AppState.addEventListener('change', next => {
      if (next === 'active' && previous !== 'active' && session.snapshot().user) void session.hydrate(false);
      previous = next;
    });
    return () => { subscription.remove(); session.cancelRead(); };
  }, [session]);

  async function command(name: string, fields: Record<string, string | number | string[]>) {
    const generation = (name === 'login' || name === 'signup') ? session.beginLogin() : session.current();
    try {
      await session.flush();
      if (!session.isCurrent(generation)) throw accountChanged();
      const outcome = await request<Outcome>('/api/command', { command: name, fields });
      if (!session.isCurrent(generation)) throw accountChanged();
      if (name === 'logout') { await session.expire(); return outcome; }
      if ((name === 'login' || name === 'signup') && outcome.destination === '/') {
        if (Platform.OS !== 'web' && !outcome.credential) throw new TransportError(503, 'The application API is unavailable.');
        if (!await session.acceptLogin(outcome.credential ?? null, generation)) throw accountChanged();
      } else if (outcome.status === 'saved' || (outcome.destination && !outcome.destination.includes('error='))) {
        session.refresh();
      }
      return outcome;
    } catch (error) {
      // An old account's late 401 must never log out a newer account.
      if (session.isCurrent(generation) && error instanceof TransportError && error.status === 401) await session.expire();
      throw error;
    }
  }
  return <Context.Provider value={{
    user: state.user, ready: state.ready, revision: state.revision, hydrationError: state.error, command,
    expire: () => { void session.expire().catch(() => {}); }, refresh: session.refresh,
    retry: () => { void session.retry(); },
  }}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);
