import { useState } from "react";
import { View } from "react-native";
import {
  T,
  Heading,
  A,
  Button,
  IconButton,
  Chevron,
} from "../../../components/primitives";
import { Screen, Waiting } from "../../../components/screen";
import { TaskFooter } from "../../../components/task-footer";
import { EmptyState } from "../../../components/empty-state";
import { useSnapshot } from "../../../data/snapshot";
import {
  duplicateRouteIds,
  type JournalRecord,
} from "../../../domain/journal-summary";
import { colors as c } from "../../../theme/colors";
import { s } from "../../../theme/styles";
export default function Sessions() {
  const { data: d, error } = useSnapshot("journal"),
    [limit, setLimit] = useState(3);
  if (!d)
    return (
      <Screen>
        <Waiting error={error} page="sessions" />
      </Screen>
    );
  const active = d.journal.records.filter(
      (r) => r.session.duration_minutes === 0,
    ),
    completed = d.journal.records.filter((r) => r.session.duration_minutes > 0),
    months = new Map<string, JournalRecord[]>(),
    gym = (id: number) =>
      d.gyms?.find((g) => g.id === id)?.name ?? "Gym name unavailable";
  for (const record of completed) {
    const key = record.session.session_date.slice(0, 7);
    months.set(key, [...(months.get(key) ?? []), record]);
  }
  return (
    <Screen
      footer={
        <TaskFooter>
          <A
            href="/sessions/new?past=1"
            style={[s.button, { backgroundColor: c.panel }]}
            color={c["panel-ink"]}
          >
            Record a past visit
          </A>
        </TaskFooter>
      }
    >
      <View style={[s.page, { flexGrow: 1 }]}>
        <View style={s.between}>
          <Heading size={36}>Sessions</Heading>
          <IconButton href="/sessions/new" name="plus" label="Start session" />
        </View>
        {error || !d.journal.sessionsLoaded ? (
          <T color={c["accent-strong"]}>
            {error || "Your journal couldn’t load. Try again."}
          </T>
        ) : null}
        {active.map((r) => (
          <A
            key={r.session.id}
            href={`/sessions/${r.session.id}`}
            style={[s.panel, s.between, { gap: 12 }]}
          >
            <View style={{ flex: 1 }}>
              <T size={16} weight={700} color={c["panel-ink"]}>
                Climbing now
              </T>
              <T color={c["panel-ink-muted"]}>{gym(r.session.gym_id)}</T>
            </View>
            <Chevron />
          </A>
        ))}
        {!active.length && !completed.length && d.journal.sessionsLoaded ? (
          <EmptyState title="Your journal starts here">
            Your visits and climbs will collect here after your first session.
          </EmptyState>
        ) : null}
        {[...months].slice(0, limit).map(([month, records]) => (
          <View key={month}>
            <View style={[s.between, { paddingBottom: 16 }]}>
              <Heading>
                {new Intl.DateTimeFormat("en", {
                  month: "long",
                  year: "numeric",
                }).format(new Date(`${month}-15T12:00:00`))}
              </Heading>
              <T size={12} color={c["ink-muted"]}>
                {records.length} visits
              </T>
            </View>
            {records.map((r) => (
              <A
                key={r.session.id}
                href={`/sessions/${r.session.id}`}
                style={[
                  s.row,
                  {
                    gap: 16,
                    marginHorizontal: -20,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    minHeight: 88,
                    borderBottomWidth: 1,
                    borderColor: c.hairline,
                  },
                ]}
              >
                <Heading size={30} style={{ width: 36 }}>
                  {r.session.session_date.slice(-2)}
                </Heading>
                <View style={{ flex: 1 }}>
                  <T size={16} weight={700}>
                    {gym(r.session.gym_id)}
                  </T>
                  <T color={c["ink-muted"]}>
                    {r.session.duration_minutes} min ·{" "}
                    {r.loaded && !duplicateRouteIds(r.attempts).size
                      ? `${r.attempts.length} routes · ${r.attempts.filter((a) => a.result === "send" || a.result === "flash").length} finishes`
                      : "Summary unavailable"}
                  </T>
                </View>
                <Chevron />
              </A>
            ))}
          </View>
        ))}
        {months.size > limit ? (
          <Button variant="dark" onPress={() => setLimit((v) => v + 3)}>
            Show earlier visits
          </Button>
        ) : null}
        <A href="/climbs" style={[s.between, { gap: 12, paddingVertical: 16 }]}>
          <View>
            <T size={16} weight={700}>
              Your climbs
            </T>
            <T color={c["ink-muted"]}>Routes and projects across visits</T>
          </View>
          <Chevron />
        </A>
      </View>
    </Screen>
  );
}
