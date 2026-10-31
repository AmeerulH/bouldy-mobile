import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Keyboard, Platform } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { request, TransportError } from "./client";
import { useSnackbar } from "../components/snackbar";
import { snapshotCache, snapshotEpoch } from "./snapshot-cache";
import { useAuth } from "../platform/auth";
import type { UserResponse, Gym, Session, Route, Attempt } from "./types";
import type { Journal } from "../domain/journal-summary";
export type Snapshot = {
  user: UserResponse;
  journal: Journal;
  gyms: Gym[] | null;
  session: Session;
  gym: Gym;
  gymRoutes: Route[];
  routes: Route[] | null;
  attempts: Attempt[];
  route: Route;
  catalogueAdmin?: boolean;
};
export function useSnapshot(view = "home", id?: string, routeId?: string) {
  const notify = useSnackbar(),
    auth = useAuth(),
    params = useLocalSearchParams<{ sheet?: string }>(),
    key = `${auth.user?.id}:${view}:${id ?? ""}:${routeId ?? ""}`;
  const [state, setState] = useState<{
    key?: string;
    data?: Snapshot;
    error?: string;
    status?: number;
  }>({});
  useEffect(() => {
    if (state.key === key && state.data && state.error)
      notify("Couldn’t refresh. Showing your last saved view.", "warning");
  }, [state.key, state.data, state.error, key, notify]);
  const generation = useRef(0),
    focused = useRef(false),
    blocked = useRef(false);
  useEffect(() => {
    blocked.current = !!params.sheet;
  }, [params.sheet]);
  const keyboard = useRef(false);
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {
        keyboard.current = true;
      }),
      hide = Keyboard.addListener("keyboardDidHide", () => {
        keyboard.current = false;
      });
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  const read = useCallback(() => {
    if (!auth.user) return;
    const current = ++generation.current,
      epoch = snapshotEpoch();
    request<Snapshot>(
      `/api/snapshot?view=${view}${id ? `&id=${encodeURIComponent(id)}` : ""}${routeId ? `&routeId=${encodeURIComponent(routeId)}` : ""}`,
    )
      .then((data) => {
        if (current !== generation.current || epoch !== snapshotEpoch()) return;
        const cached = snapshotCache.get(key);
        if (
          cached?.journal?.sessionsLoaded &&
          data.journal &&
          !data.journal.sessionsLoaded
        ) {
          setState({
            key,
            data: cached,
            error: "Couldn’t refresh. Showing your last saved view.",
          });
          return;
        }
        snapshotCache.set(key, data);
        setState({ key, data });
      })
      .catch((error) => {
        if (current !== generation.current || epoch !== snapshotEpoch()) return;
        if (error instanceof TransportError && error.status === 401)
          auth.expire();
        else
          setState({
            key,
            data: snapshotCache.get(key),
            error: error.message,
            status: error instanceof TransportError ? error.status : 500,
          });
      });
    // Auth methods are recreated; identity/revision define request ownership.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, id, routeId, key, auth.user?.id, auth.revision]);
  useEffect(() => {
    read();
    const cancel = () => {
      generation.current++;
    };
    return cancel;
  }, [read]);
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      return () => {
        focused.current = false;
      };
    }, []),
  );
  useEffect(() => {
    const timer = setInterval(() => {
      if (
        focused.current &&
        !blocked.current &&
        !keyboard.current &&
        AppState.currentState === "active" &&
        !(
          Platform.OS === "web" &&
          ["INPUT", "TEXTAREA", "SELECT"].includes(
            document.activeElement?.tagName ?? "",
          )
        )
      )
        read();
    }, 60000);
    return () => clearInterval(timer);
  }, [read]);
  if (
    state.key === key &&
    state.error &&
    [400, 404].includes(state.status ?? 0) &&
    !state.data
  )
    throw new TransportError(state.status!, state.error);
  return state.key === key ? state : { data: snapshotCache.get(key) };
}
