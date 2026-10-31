import { useState, useRef } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable } from "../../../components/pressable";
import { Screen, Waiting } from "../../../components/screen";
import {
  Heading,
  T,
  Button,
  A,
  Feedback,
  Field,
  Icon,
} from "../../../components/primitives";
import { TaskFooter } from "../../../components/task-footer";
import { useSnapshot } from "../../../data/snapshot";
import { useAuth } from "../../../platform/auth";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";

function openedOn(date: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (date === today) return "Opened today";
  const label = new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
  return `Opened ${label}`;
}

export default function NewSession() {
  const { past } = useLocalSearchParams<{ past?: string }>(),
    { data, error } = useSnapshot("home"),
    auth = useAuth(),
    [gym, setGym] = useState<number | null>(null),
    [date, setDate] = useState(new Date().toISOString().slice(0, 10)),
    [pending, setPending] = useState(false),
    [issue, setIssue] = useState(""),
    busy = useRef(false);
  if (!data)
    return (
      <Screen back="/sessions">
        <Waiting error={error} />
      </Screen>
    );
  const active = data.journal.records.filter(
      (r) => r.session.duration_minutes === 0,
    ),
    canStart = data.journal.sessionsLoaded && !!data.gyms;
  async function start() {
    if (busy.current || !gym) return;
    busy.current = true;
    setPending(true);
    setIssue("");
    try {
      const out = await auth.command("startSession", {
        gym_id: gym,
        ...(past ? { session_date: date } : {}),
      });
      if (out.destination) {
        const url = new URL(out.destination, "http://local");
        if (url.searchParams.has("error"))
          setIssue(url.searchParams.get("error") ?? "");
        else router.replace(out.destination as never);
      }
    } catch (e) {
      setIssue((e as Error).message);
    } finally {
      busy.current = false;
      setPending(false);
    }
  }
  return (
    <Screen
      back="/sessions"
      footer={
        !active.length && canStart ? (
          <TaskFooter>
            <Button
              pending={pending}
              pendingLabel="Starting session"
              onPress={() =>
                gym ? void start() : setIssue("Choose a gym first.")
              }
            >
              {past ? "Record visit" : "Start session"}
            </Button>
          </TaskFooter>
        ) : undefined
      }
    >
      <View style={s.page}>
        <Heading size={36}>
          {active.length > 1
            ? `${active.length} sessions are open`
            : active.length
              ? "A session is already open"
              : past
                ? "Record a past visit"
                : "Where are you climbing?"}
        </Heading>
        {active.length ? (
          <>
            <T size={16} color={c["ink-muted"]}>
              Finish an open visit before starting another. Your climbs and
              notes stay with that visit.
            </T>
            <View
              style={{
                marginHorizontal: -20,
                borderTopWidth: 1,
                borderColor: c.hairline,
              }}
            >
              {active.map((r) => {
                const name =
                  data.gyms?.find((g) => g.id === r.session.gym_id)?.name ??
                  "Gym name unavailable";
                const opened = openedOn(r.session.session_date);
                const routes = !r.loaded
                  ? "Routes unavailable"
                  : r.attempts.length === 1
                    ? "1 route logged"
                    : `${r.attempts.length} routes logged`;
                return (
                  <View
                    key={r.session.id}
                    style={{
                      gap: 16,
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderColor: c.hairline,
                    }}
                  >
                    <View>
                      <T size={17} weight={700}>
                        {name}
                      </T>
                      <T color={c["ink-muted"]} style={{ marginTop: 4 }}>
                        {opened} · {routes}
                      </T>
                    </View>
                    <View style={[s.row, { gap: 12 }]}>
                      <A
                        href={`/sessions/${r.session.id}`}
                        accessibilityLabel={`Resume session at ${name}, ${opened}`}
                        style={[
                          s.button,
                          { flex: 1, backgroundColor: c.accent },
                        ]}
                        color={c["accent-ink"]}
                      >
                        Resume
                      </A>
                      <A
                        href={`/sessions/${r.session.id}?sheet=end-session`}
                        accessibilityLabel={`Finish visit at ${name}, ${opened}`}
                        style={[
                          s.button,
                          { flex: 1, backgroundColor: c.panel },
                        ]}
                        color={c["panel-ink"]}
                      >
                        Finish
                      </A>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <>
            {!canStart ? (
              <Feedback>
                Couldn’t load your gyms or active visits. Try again before
                starting.
              </Feedback>
            ) : null}
            {past ? (
              <Field
                label="Visit date (YYYY-MM-DD)"
                value={date}
                onChangeText={setDate}
                placeholder="2026-10-31"
              />
            ) : null}
            <T color={c["ink-muted"]}>
              Choose an existing gym. Routes are managed by your gym’s
              administrators.
            </T>
            {data.gyms?.map((g) => (
              <Pressable
                key={g.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: gym === g.id }}
                onPress={() => setGym(g.id)}
                style={({ pressed }) => [
                  s.between,
                  {
                    gap: 12,
                    minHeight: 80,
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    marginHorizontal: -20,
                    borderBottomWidth: 1,
                    borderColor: c.hairline,
                    backgroundColor: pressed ? c.pressed : "transparent",
                  },
                ]}
              >
                <View style={{ flex: 1 }}>
                  <T size={16} weight={700}>
                    {g.name}
                  </T>
                  <T color={c["ink-muted"]}>{g.location}</T>
                </View>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: c.ink,
                    backgroundColor: gym === g.id ? c.panel : "transparent",
                  }}
                >
                  {gym === g.id ? (
                    <Icon name="check" color={c["panel-ink"]} size={22} />
                  ) : null}
                </View>
              </Pressable>
            ))}
          </>
        )}
        {issue ? <Feedback>{issue}</Feedback> : null}
      </View>
    </Screen>
  );
}
