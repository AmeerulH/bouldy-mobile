import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import Animated, { cubicBezier } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Brand,
  Chevron,
  Heading,
  Hold,
  Icon,
  IconButton,
  PageTitle,
  Result,
  T,
} from "./primitives";
import { SessionRouteList } from "./session-route-list";
import { StatusMark } from "./learn";
import { TourTarget } from "./tour-context";
import type { Scene } from "../content/guides";
import {
  demoGym,
  demoRoutes,
  demoStates,
  type DemoAttempts,
} from "../content/demo";
import type { RouteState } from "../features/session-state";
import { useReducedMotion } from "../platform/reduced-motion";
import { colors as c } from "../theme/colors";
import { motion } from "../theme/motion";
import { s } from "../theme/styles";

const tabs = [
  ["Home", "home"],
  ["Explore", "explore"],
  ["Sessions", "sessions"],
  ["Profile", "profile"],
] as const;

const Pill = ({
  children,
  tone = "accent",
  style,
}: {
  children: string;
  tone?: "accent" | "panel";
  style?: object;
}) => (
  <View
    style={[
      s.button,
      { backgroundColor: tone === "accent" ? c.accent : c.panel },
      style,
    ]}
  >
    <T
      weight={700}
      color={tone === "accent" ? c["accent-ink"] : c["panel-ink"]}
    >
      {children}
    </T>
  </View>
);

const Row = ({
  title,
  hint,
  right,
}: {
  title: string;
  hint: string;
  right?: ReactNode;
}) => (
  <View
    style={[
      s.between,
      {
        gap: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: c.hairline,
      },
    ]}
  >
    <View style={{ flex: 1 }}>
      <T size={16} weight={600}>
        {title}
      </T>
      <T color={c["ink-muted"]}>{hint}</T>
    </View>
    {right ?? <Chevron />}
  </View>
);

/** The app's chrome around a practice screen: sample banner, content, footer and tab bar. */
function Frame({
  tab,
  footer,
  children,
  scroll = true,
}: {
  tab: (typeof tabs)[number][0];
  footer?: ReactNode;
  children: ReactNode;
  scroll?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: insets.top }}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderColor: c.hairline,
        }}
      >
        <T size={12} weight={600} color={c["ink-muted"]}>
          Practice mode · sample data, nothing is saved
        </T>
      </View>
      {scroll ? (
        <ScrollView
          scrollEnabled={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      {footer}
      <TourTarget id="demo-tabs">
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderColor: c.hairline,
            paddingTop: 8,
            paddingBottom: Math.max(8, insets.bottom),
            backgroundColor: c.bg,
          }}
        >
          {tabs.map(([label, icon]) => {
            const active = label === tab;
            return (
              <View
                key={label}
                style={{
                  flex: 1,
                  alignItems: "center",
                  gap: 4,
                  paddingVertical: 6,
                }}
              >
                <Icon name={icon} color={active ? c.accent : c["ink-faint"]} />
                <T
                  size={11}
                  weight={500}
                  color={active ? c.accent : c["ink-faint"]}
                >
                  {label}
                </T>
              </View>
            );
          })}
        </View>
      </TourTarget>
    </View>
  );
}

const Footer = ({ children }: { children: ReactNode }) => (
  <View
    style={{
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      gap: 12,
      backgroundColor: c.bg,
    }}
  >
    {children}
  </View>
);

function Home() {
  return (
    <Frame
      tab="Home"
      footer={
        <Footer>
          <TourTarget id="demo-home-action">
            <Pill>Start session</Pill>
          </TourTarget>
        </Footer>
      }
    >
      <View style={[s.page, { gap: 20 }]}>
        <Brand />
        <View style={{ gap: 8 }}>
          <Heading size={36}>Good to see you, Sam.</Heading>
          <T size={16} color={c["ink-muted"]}>
            A little progress, every visit.
          </T>
        </View>
        <TourTarget id="demo-home-month">
          <View style={s.panel}>
            <Heading color={c["panel-ink"]}>This month</Heading>
            <View style={[s.row, { gap: 16, marginTop: 20 }]}>
              {[
                ["4", "visits"],
                ["11", "finishes"],
                ["5.2h", "climbing"],
              ].map(([value, label]) => (
                <View key={label} style={{ flex: 1 }}>
                  <Heading
                    size={40}
                    color={c["panel-ink"]}
                    style={{ textTransform: "none" }}
                  >
                    {value}
                  </Heading>
                  <T color={c["panel-ink-muted"]}>{label}</T>
                </View>
              ))}
            </View>
            <T size={12} color={c["panel-ink-muted"]} style={{ marginTop: 20 }}>
              Finishes include first-try finishes.
            </T>
          </View>
        </TourTarget>
        <View style={s.between}>
          <Heading>Last visit</Heading>
          <T weight={600}>All visits</T>
        </View>
        <View style={[s.between, { gap: 12 }]}>
          <View
            style={{
              backgroundColor: c.panel,
              borderRadius: 8,
              padding: 10,
              alignItems: "center",
            }}
          >
            <T size={12} color={c["panel-ink"]}>
              OCT
            </T>
            <Heading size={30} color={c["panel-ink"]}>
              28
            </Heading>
          </View>
          <View style={{ flex: 1 }}>
            <T size={16} weight={700}>
              {demoGym}
            </T>
            <T color={c["ink-muted"]}>75 min · 6 routes</T>
          </View>
          <Chevron />
        </View>
      </View>
    </Frame>
  );
}

function Sessions() {
  return (
    <Frame
      tab="Sessions"
      footer={
        <Footer>
          <TourTarget id="demo-sessions-actions">
            <View style={[s.row, { gap: 12 }]}>
              <Pill tone="panel" style={{ flex: 1 }}>
                Record a past visit
              </Pill>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: c.accent,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="plus" color={c["accent-ink"]} size={22} />
              </View>
            </View>
          </TourTarget>
        </Footer>
      }
    >
      <View style={[s.page, { flexGrow: 1 }]}>
        <TourTarget id="demo-sessions-title">
          <PageTitle>Sessions</PageTitle>
        </TourTarget>
        <View style={[s.panel, s.between, { gap: 12 }]}>
          <View style={{ flex: 1 }}>
            <T size={16} weight={700} color={c["panel-ink"]}>
              Climbing now
            </T>
            <T color={c["panel-ink-muted"]}>{demoGym}</T>
            <T size={12} color={c["panel-ink-muted"]}>
              Opened Nov 2, 2026
            </T>
          </View>
          <Chevron />
        </View>
        <View>
          <View style={[s.between, { paddingBottom: 8 }]}>
            <Heading>October 2026</Heading>
            <T size={12} color={c["ink-muted"]}>
              4 visits
            </T>
          </View>
          {[
            ["28", "75 min · 6 routes · 4 finishes"],
            ["21", "90 min · 8 routes · 5 finishes"],
            ["14", "60 min · 4 routes · 2 finishes"],
          ].map(([day, line]) => (
            <View
              key={day}
              style={[
                s.row,
                {
                  gap: 16,
                  minHeight: 76,
                  borderBottomWidth: 1,
                  borderColor: c.hairline,
                },
              ]}
            >
              <Heading size={30} style={{ width: 36 }}>
                {day}
              </Heading>
              <View style={{ flex: 1 }}>
                <T size={16} weight={700}>
                  {demoGym}
                </T>
                <T color={c["ink-muted"]}>{line}</T>
              </View>
              <Chevron />
            </View>
          ))}
        </View>
      </View>
    </Frame>
  );
}

function Gym() {
  return (
    <Frame
      tab="Sessions"
      footer={
        <Footer>
          <TourTarget id="demo-gym-start">
            <Pill>Start session</Pill>
          </TourTarget>
        </Footer>
      }
    >
      <View style={[s.page, { flexGrow: 1 }]}>
        <PageTitle>New session</PageTitle>
        <Heading>Choose your gym</Heading>
        <View>
          {[demoGym, "Granite Works", "The Crux Room"].map((name, i) => (
            <View
              key={name}
              style={[
                s.between,
                {
                  gap: 12,
                  minHeight: 64,
                  borderBottomWidth: 1,
                  borderColor: c.hairline,
                },
              ]}
            >
              <T size={16} weight={i === 0 ? 700 : 500}>
                {name}
              </T>
              {i === 0 ? <Icon name="check" color={c.accent} /> : null}
            </View>
          ))}
        </View>
      </View>
    </Frame>
  );
}

const Stat = ({ value, label }: { value: string; label: string }) => (
  <View style={{ flex: 1 }}>
    <T display size={30} weight={700}>
      {value}
    </T>
    <T size={12} weight={600} color={c["ink-muted"]} style={{ marginTop: 4 }}>
      {label}
    </T>
  </View>
);

function Climbs() {
  return (
    <Frame tab="Sessions">
      <View style={[s.page, { paddingTop: 24 }]}>
        <TourTarget id="demo-climbs-title">
          <View>
            <T color={c["ink-muted"]}>Every route you&apos;ve logged.</T>
            <View style={{ marginTop: 8 }}>
              <PageTitle size={44}>Your climbs</PageTitle>
            </View>
          </View>
        </TourTarget>
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: c.hairline,
            paddingVertical: 16,
          }}
        >
          <Stat value="12" label="Routes" />
          <Stat value="9" label="Sent" />
          <Stat value="2" label="Gyms" />
        </View>
        {demoRoutes.map((r, i) => (
          <View key={r.id} style={[s.row, { gap: 12, minHeight: 64 }]}>
            <Hold colour={r.colour} name={r.route_name} />
            <View style={{ flex: 1 }}>
              <View style={[s.row, { alignItems: "baseline", gap: 8 }]}>
                <Heading size={20}>{r.grade}</Heading>
                <T size={12} weight={600} color={c["ink-muted"]}>
                  {r.colour}
                </T>
              </View>
              <T weight={600}>{r.route_name}</T>
              <T size={12} color={c["ink-muted"]}>
                {i === 0 ? "3 tries · 2 visits" : "Tries unavailable · 1 visit"}
              </T>
            </View>
            <Result result={i === 1 ? "flash" : "send"} />
          </View>
        ))}
      </View>
    </Frame>
  );
}

function Explore() {
  return (
    <Frame tab="Explore">
      <View style={[s.page, { gap: 28, paddingTop: 24 }]}>
        <PageTitle>Explore</PageTitle>
        <TourTarget id="demo-explore-status">
          <View style={s.panel}>
            <Heading color={c["panel-ink"]}>Climb with others.</Heading>
            <T color={c["panel-ink"]} style={{ marginTop: 8, lineHeight: 24 }}>
              The community side of Bouldy is being built. Your journal stays
              private until sharing exists and you choose it.
            </T>
          </View>
        </TourTarget>
        <View>
          {[
            ["Challenges", "Gym and community goals with dates"],
            ["Groups and leagues", "Private crews and seasons"],
          ].map(([title, hint]) => (
            <Row
              key={title}
              title={title}
              hint={hint}
              right={
                <T size={12} weight={600} color={c["ink-muted"]}>
                  Coming soon
                </T>
              }
            />
          ))}
        </View>
      </View>
    </Frame>
  );
}

function Profile() {
  return (
    <Frame tab="Profile">
      <View style={[s.page, { paddingTop: 24 }]}>
        <View style={[s.panel, { gap: 4 }]}>
          <Heading color={c["panel-ink"]}>Sam</Heading>
          <T color={c["panel-ink-muted"]}>sam@example.com</T>
        </View>
        <View>
          <Row title="Home gym" hint={demoGym} />
          <Row title="Units" hint="Metric" />
          <TourTarget id="demo-profile-learn">
            <Row
              title="Learn & guide"
              hint="Guides, lessons, glossary and goals"
            />
          </TourTarget>
        </View>
      </View>
    </Frame>
  );
}

const goalRows: [string, string, "done" | "todo"][] = [
  ["Log your first session", "Start a session and finish it", "done"],
  ["Log your first route", "Add a try to any route", "done"],
  ["Send a route", "Top a route and tick it off", "todo"],
  ["Flash a route", "Top a route on your first try ever", "todo"],
];

function Goals() {
  return (
    <Frame tab="Profile">
      <View style={[s.page, { paddingTop: 24 }]}>
        <PageTitle>Goals</PageTitle>
        <TourTarget id="demo-goals">
          <View>
            {goalRows.map(([title, hint, status]) => (
              <Row
                key={title}
                title={title}
                hint={hint}
                right={<StatusMark status={status} />}
              />
            ))}
          </View>
        </TourTarget>
      </View>
    </Frame>
  );
}

/** A route's details sheet, drawn for explanation only. */
function Sheet({ attempts }: { attempts: DemoAttempts }) {
  const r = demoRoutes[0],
    logged = attempts[r.id],
    result = logged?.result ?? "send",
    tries = logged?.num_attempts ?? 1,
    chip = (label: string, on: boolean) => (
      <View
        key={label}
        style={{
          minHeight: 40,
          paddingHorizontal: 14,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: c.hairline,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: on ? c.panel : "transparent",
        }}
      >
        <T weight={700} color={on ? c["panel-ink"] : c.ink}>
          {label}
        </T>
      </View>
    );
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: c.bg,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        gap: 16,
        boxShadow: "0 -4px 24px rgba(13,13,13,.18)",
      }}
    >
      <View style={[s.row, { gap: 12 }]}>
        <Hold colour={r.colour} name={r.route_name} size={32} />
        <View>
          <Heading size={22}>
            {r.grade} {r.colour}
          </Heading>
          <T weight={700}>{r.route_name}</T>
        </View>
      </View>
      <TourTarget id="demo-sheet-note">
        <View style={{ gap: 6 }}>
          <T size={14} weight={600}>
            Note
          </T>
          <View
            style={{
              minHeight: 56,
              borderWidth: 1,
              borderColor: c.hairline,
              borderRadius: 12,
              padding: 12,
            }}
          >
            <T color={c["ink-muted"]}>Heel hook on the left, trust the foot.</T>
          </View>
        </View>
      </TourTarget>
      <TourTarget id="demo-sheet-correct">
        <View style={{ gap: 10 }}>
          <T size={14} weight={600}>
            Correct this log
          </T>
          <View style={[s.row, { gap: 8, flexWrap: "wrap" }]}>
            {(
              [
                ["Project", "project"],
                ["Zone", "zone"],
                ["Send", "send"],
                ["Flash", "flash"],
              ] as const
            ).map(([label, value]) => chip(label, result === value))}
          </View>
          <View style={[s.row, { gap: 12 }]}>
            <T weight={600}>Tries</T>
            <View
              style={[
                s.row,
                {
                  gap: 16,
                  borderWidth: 1,
                  borderColor: c.hairline,
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  minHeight: 40,
                },
              ]}
            >
              <T weight={700}>-</T>
              <T weight={700}>{tries}</T>
              <T weight={700}>+</T>
            </View>
          </View>
          <Pill tone="panel">Save correction</Pill>
        </View>
      </TourTarget>
    </View>
  );
}

function Practice({
  attempts,
  pending,
  onPractice,
  sheet,
}: {
  attempts: DemoAttempts;
  pending: { id: number; intent: string } | null;
  onPractice: (state: RouteState, intent: string) => Promise<void>;
  sheet: boolean;
}) {
  const logged = Object.values(attempts),
    finishes = logged.filter(
      (a) => a.result === "send" || a.result === "flash",
    ).length;
  return (
    <Frame tab="Sessions" scroll={false}>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 6 }}>
          <View style={s.between}>
            <IconButton name="back" label="Back" />
            <TourTarget id="demo-finish">
              <Pill style={{ minHeight: 44 }}>Finish</Pill>
            </TourTarget>
          </View>
          <Heading size={32}>{demoGym}</Heading>
          <T color={c["ink-muted"]}>Climbing now</T>
          <T size={12} color={c["ink-muted"]}>
            {logged.length} routes · {finishes} finishes
          </T>
        </View>
        <SessionRouteList
          practice
          states={demoStates(attempts)}
          sessionId={0}
          ended={false}
          pending={pending}
          open={() => {}}
          log={onPractice}
        />
        {sheet ? <Sheet attempts={attempts} /> : null}
      </View>
    </Frame>
  );
}

/**
 * Practice screens for the guides. They are drawn in place of the app, so a step never waits for
 * real data, and practice taps stay in memory.
 */
export function DemoStage({
  scene,
  sheet,
  attempts,
  pending,
  onPractice,
}: {
  scene: Scene;
  sheet: boolean;
  attempts: DemoAttempts;
  pending: { id: number; intent: string } | null;
  onPractice: (state: RouteState, intent: string) => Promise<void>;
}) {
  const reduced = useReducedMotion();
  return (
    // Keyed by scene so a new screen eases in; steps on the same screen keep it.
    <Animated.View
      key={scene}
      style={[
        { flex: 1, backgroundColor: c.bg },
        reduced
          ? {}
          : {
              animationName: { from: { opacity: 0 } },
              animationDuration: "160ms",
              animationTimingFunction: cubicBezier(...motion.easeOut),
              animationFillMode: "backwards",
            },
      ]}
    >
      {scene === "home" ? (
        <Home />
      ) : scene === "sessions" ? (
        <Sessions />
      ) : scene === "gym" ? (
        <Gym />
      ) : scene === "practice" ? (
        <Practice
          attempts={attempts}
          pending={pending}
          onPractice={onPractice}
          sheet={sheet}
        />
      ) : scene === "climbs" ? (
        <Climbs />
      ) : scene === "explore" ? (
        <Explore />
      ) : scene === "profile" ? (
        <Profile />
      ) : (
        <Goals />
      )}
    </Animated.View>
  );
}
