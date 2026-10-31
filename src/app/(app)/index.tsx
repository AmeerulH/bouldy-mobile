import { View } from "react-native";
import { Image } from "expo-image";
import { Brand, Heading, T, A, Chevron } from "../../components/primitives";
import { Screen, Waiting } from "../../components/screen";
import { TaskFooter } from "../../components/task-footer";
import { BrandPattern } from "../../components/brand-pattern";
import { SkeletonFooter } from "../../components/page-skeleton";
import { EmptyState } from "../../components/empty-state";
import { useSnapshot } from "../../data/snapshot";
import {
  duplicateRouteIds,
  journalComplete,
} from "../../domain/journal-summary";
import { colors as c } from "../../theme/colors";
import { s } from "../../theme/styles";
export default function Home() {
  const { data: d, error } = useSnapshot();
  if (!d)
    return (
      <Screen footer={<SkeletonFooter />}>
        <Waiting error={error} />
      </Screen>
    );
  const now = new Date(),
    month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    active = d.journal.records.find((r) => r.session.duration_minutes === 0),
    completed = d.journal.records.filter((r) => r.session.duration_minutes > 0),
    recent = completed[0],
    monthly = completed.filter((r) => r.session.session_date.startsWith(month)),
    reliable =
      journalComplete(d.journal) &&
      monthly.every((r) => !duplicateRouteIds(r.attempts).size),
    finishes = monthly.reduce(
      (sum, r) =>
        sum +
        r.attempts.filter((a) => a.result === "send" || a.result === "flash")
          .length,
      0,
    ),
    minutes = monthly.reduce((sum, r) => sum + r.session.duration_minutes, 0),
    empty = d.journal.sessionsLoaded && !d.journal.records.length;
  const gym = (id: number) =>
      d.gyms?.find((g) => g.id === id)?.name ?? "Gym name unavailable",
    target = active ? `/sessions/${active.session.id}` : "/sessions/new";
  return (
    <Screen
      footer={
        <TaskFooter>
          <A
            href={target}
            style={[s.button, { backgroundColor: c.accent }]}
            color={c["accent-ink"]}
          >
            {active
              ? "Resume session"
              : empty
                ? "Start your first session"
                : "Start session"}
          </A>
        </TaskFooter>
      }
    >
      <View style={[s.page, { flexGrow: 1, gap: 20 }]}>
        <Brand />
        {empty ? (
          <EmptyState title="Your first move.">
            A journal that grows with you. Choose your gym, find a route and
            record your tries. That’s your first entry.
          </EmptyState>
        ) : (
          <>
            <View style={{ gap: 8 }}>
              <Heading size={36}>Good to see you, {d.user.username}.</Heading>
              <T size={16} color={c["ink-muted"]}>
                {active
                  ? "Your session is waiting for you."
                  : "A little progress, every visit."}
              </T>
            </View>
            {!reliable ? (
              <T color={c["accent-strong"]}>
                Some history is unavailable. Totals may be incomplete.
              </T>
            ) : null}
            <View style={[s.panel, { overflow: "hidden" }]}>
              <Image
                source={require("../../../assets/source/brand/bolt-b.svg")}
                accessibilityElementsHidden
                importantForAccessibility="no"
                pointerEvents="none"
                style={{
                  position: "absolute",
                  right: -24,
                  top: -22,
                  width: 150,
                  height: 150,
                  opacity: 0.14,
                }}
              />
              <Heading color={c["panel-ink"]}>This month</Heading>
              <View style={[s.row, { gap: 16, marginTop: 20 }]}>
                {[
                  [String(monthly.length), "visits"],
                  [reliable ? String(finishes) : "—", "finishes"],
                  [`${Math.round(minutes / 6) / 10}h`, "climbing"],
                ].map(([value, label]) => (
                  <View key={label} style={{ flex: 1 }}>
                    <Heading size={40} color={c["panel-ink"]} style={{textTransform:"none"}}>
                      {value}
                    </Heading>
                    <T color={c["panel-ink-muted"]}>{label}</T>
                  </View>
                ))}
              </View>
              <T
                size={12}
                color={c["panel-ink-muted"]}
                style={{ marginTop: 20 }}
              >
                Finishes include first-try finishes.
              </T>
            </View>
            {active ? (
              <A
                href={target}
                style={[s.panel, s.between, { gap: 12, overflow: "hidden" }]}
              >
                <BrandPattern />
                <View style={{ flex: 1 }}>
                  <T size={16} weight={700} color={c["panel-ink"]}>
                    Climbing now
                  </T>
                  <T color={c["panel-ink-muted"]}>
                    {gym(active.session.gym_id)}
                  </T>
                </View>
                <Chevron />
              </A>
            ) : null}
            {recent ? (
              <>
                <View style={s.between}>
                  <Heading>Last visit</Heading>
                  <A href="/sessions" color={c.ink}>
                    All visits
                  </A>
                </View>
                <A
                  href={`/sessions/${recent.session.id}`}
                  style={[s.between, { gap: 12, paddingBottom: 20 }]}
                >
                  <View
                    style={{
                      backgroundColor: c.panel,
                      borderRadius: 8,
                      padding: 10,
                      alignItems: "center",
                    }}
                  >
                    <T size={12} color={c["panel-ink"]}>
                      {new Intl.DateTimeFormat("en", { month: "short" })
                        .format(
                          new Date(`${recent.session.session_date}T12:00:00`),
                        )
                        .toUpperCase()}
                    </T>
                    <Heading size={30} color={c["panel-ink"]}>
                      {recent.session.session_date.slice(-2)}
                    </Heading>
                  </View>
                  <View style={{ flex: 1 }}>
                    <T size={16} weight={700}>
                      {gym(recent.session.gym_id)}
                    </T>
                    <T color={c["ink-muted"]}>
                      {recent.session.duration_minutes} min ·{" "}
                      {recent.loaded
                        ? `${recent.attempts.length} routes`
                        : "Routes unavailable"}
                    </T>
                  </View>
                  <Chevron />
                </A>
              </>
            ) : null}
            <A
              href="/climbs"
              style={[
                s.between,
                {
                  gap: 12,
                  borderTopWidth: 1,
                  borderColor: c.hairline,
                  marginHorizontal: -20,
                  padding: 20,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <T size={16} weight={700}>
                  See your climbing progress
                </T>
                <T color={c["ink-muted"]}>Your routes, across visits</T>
              </View>
              <Chevron />
            </A>
          </>
        )}
      </View>
    </Screen>
  );
}
