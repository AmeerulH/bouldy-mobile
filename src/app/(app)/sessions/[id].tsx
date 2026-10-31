import { useRef, useState } from "react";
import { reportFrom, reportFromDestination, useActionError } from "../../../components/error-sheet";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Heading,
  T,
  IconButton,
  Button,
  Feedback,
} from "../../../components/primitives";
import { Screen, Waiting } from "../../../components/screen";
import { Surface } from "../../../components/surface";
import { RouteSheet } from "../../../components/route-sheet";
import { SessionRouteList } from "../../../components/session-route-list";
import { DurationPicker } from "../../../components/duration-picker";
import { Sheet } from "../../../components/sheet";
import { useSnackbar } from "../../../components/snackbar";
import { useSnapshot } from "../../../data/snapshot";
import { useAuth } from "../../../platform/auth";
import { useSheetNavigation } from "../../../platform/sheet-navigation";
import { routeStates, type RouteState } from "../../../features/session-state";
import {
  duplicateRouteIds,
  journalComplete,
} from "../../../domain/journal-summary";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";
export default function Session() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    nav = useSheetNavigation(),
    auth = useAuth(),
    snackbar = useSnackbar(),
    { data: d, error } = useSnapshot("session", id),
    [pending, setPending] = useState<number | null>(null),
    busy = useRef(false),
    report = useActionError(),
    [issue, setIssue] = useState(""),
    [duration, setDuration] = useState(60),
    [ending, setEnding] = useState(false);
  if (!d)
    return (
      <Screen back="/sessions">
        <Waiting error={error} page="session" />
      </Screen>
    );
  const ended = d.session.duration_minutes > 0,
    logged = new Set(d.attempts.map((a) => a.route_id)),
    byId = new Map(d.gymRoutes.map((r) => [r.id, r]));
  for (const r of d.routes ?? [])
    if (r.gym_id === d.session.gym_id) byId.set(r.id, r);
  const states = routeStates(
      [...byId.values()].filter((r) =>
        ended ? logged.has(r.id) : r.status === "active" || logged.has(r.id),
      ),
      d.attempts,
      d.journal,
      d.session.id,
      ended,
    ),
    duplicates = duplicateRouteIds(d.attempts),
    sends = d.attempts.filter(
      (a) => a.result === "send" || a.result === "flash",
    ).length,
    selected = states.find((state) => nav.sheet === `route-${state.route.id}`);
  async function log(state: RouteState, intent: string) {
    if (busy.current) return;
    busy.current = true;
    setPending(state.route.id);
    setIssue("");
    try {
      const out = await auth.command("logAttempt", {
        session_id: Number(id),
        route_id: state.route.id,
        intent,
        ...(state.attempt ? { attempt_id: state.attempt.id } : {}),
      });
      if (out.destination) {
        const failure = reportFromDestination(out.destination, {
          context: "log-attempt",
          retry: () => log(state, intent),
        });
        if (failure) {
          nav.open(`route-${state.route.id}`);
          if (failure.server) report(failure);
          else setIssue(failure.message ?? "");
        } else {
          const url = new URL(out.destination, "http://local");
          const notice = url.searchParams.get("notice");
          if (notice) snackbar(notice);
        }
      }
    } catch (e) {
      report(
        reportFrom(e, {
          context: "log-attempt",
          retry: () => log(state, intent),
        }),
      );
    } finally {
      busy.current = false;
      setPending(null);
    }
  }
  async function finish() {
    if (ending) return;
    if (duration < 1) {
      setIssue("Choose a duration of at least one minute.");
      return;
    }
    setEnding(true);
    setIssue("");
    try {
      const out = await auth.command("endSession", {
        session_id: Number(id),
        duration_minutes: duration,
      });
      if (out.destination) {
        const failure = reportFromDestination(out.destination, {
          context: "finish-session",
          retry: finish,
        });
        if (failure) {
          if (failure.server) report(failure);
          else setIssue(failure.message ?? "");
        } else {
          nav.close();
          snackbar("Visit saved. A little further.");
        }
      }
    } catch (e) {
      report(reportFrom(e, { context: "finish-session", retry: finish }));
    } finally {
      setEnding(false);
    }
  }
  return (
    <Surface>
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 12,
          gap: 16,
          borderBottomWidth: 1,
          borderColor: c.hairline,
        }}
      >
        <View style={s.between}>
          <IconButton href="/sessions" name="back" label="Back to sessions" />
          <View style={[s.row, { gap: 8 }]}>
            {!ended ? (
              <>
                <IconButton
                  name="help"
                  label="How to log a climb"
                  onPress={() => nav.open("logging-help")}
                />
                <Button onPress={() => nav.open("end-session")}>Finish</Button>
              </>
            ) : null}
          </View>
        </View>
        <View>
          <Heading size={30}>{d.gym.name}</Heading>
          <T color={c["ink-muted"]}>
            {ended ? "Completed visit" : "Climbing now"}
          </T>
        </View>
        <View style={s.between}>
          <T>
            {logged.size} routes　{duplicates.size ? "—" : sends} finishes
          </T>
          <T color={c["ink-muted"]}>
            {ended
              ? `${d.session.duration_minutes} min`
              : d.session.session_date}
          </T>
        </View>
        {!journalComplete(d.journal) ? (
          <T size={12} color={c["accent-strong"]}>
            Some earlier visits are unavailable. Flash eligibility is paused.
          </T>
        ) : null}
      </View>
      <SessionRouteList
        states={states}
        sessionId={Number(id)}
        ended={ended}
        pending={pending}
        open={(routeId) => {
          setIssue("");
          nav.open(`route-${routeId}`);
        }}
        log={log}
      />
      {selected ? (
        <RouteSheet
          key={selected.route.id}
          state={selected}
          sessionId={Number(id)}
          ended={ended}
          error={issue || nav.error}
          open
          close={nav.close}
          log={log}
          onSaved={snackbar}
        />
      ) : null}
      <Sheet
        title="Finish this visit?"
        open={!ended && nav.sheet === "end-session"}
        close={nav.close}
        footer={
          <Button
            pending={ending}
            pendingLabel="Finishing visit"
            onPress={() => void finish()}
          >
            Finish and keep climbs
          </Button>
        }
      >
        <View style={{ gap: 16 }}>
          <T>
            {logged.size} routes logged. Your climbs and notes will stay in your
            journal.
          </T>
          <DurationPicker value={duration} onChange={setDuration} />
          {issue || nav.error ? (
            <Feedback>{issue || nav.error}</Feedback>
          ) : null}
        </View>
      </Sheet>
      <Sheet
        title="Every try counts"
        open={nav.sheet === "logging-help"}
        close={nav.close}
      >
        <View style={{ gap: 16 }}>
          <T>
            Use +1 for each physical try. Sent records a finish and keeps your
            try count.
          </T>
          <T>
            Flash is a finish on your first-ever try, offered only when your
            complete route history confirms it.
          </T>
          <T>
            Tap a route to add a private note or correct its count and result.
          </T>
        </View>
      </Sheet>
    </Surface>
  );
}
