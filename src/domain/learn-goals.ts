import type { Journal } from "./journal-summary.ts";

export type GoalStatus = "done" | "todo" | "unknown";
export type Goal = {
  id: string;
  title: string;
  hint: string;
  href: string;
  hrefLabel: string;
  status: GoalStatus;
  /** Only present when the journal is complete enough to count honestly. */
  progress?: { value: number; target: number };
};

// Evidence of an achievement is enough to mark it done even if some history is missing.
// Absence is only "todo" when the whole journal has loaded; otherwise it stays unknown.
const decide = (found: boolean, complete: boolean): GoalStatus =>
  found ? "done" : complete ? "todo" : "unknown";

export function evaluateGoals(journal: Journal): Goal[] {
  const { records, sessionsLoaded } = journal;
  const complete = sessionsLoaded && records.every((r) => r.loaded);
  const attempts = records.flatMap((r) => r.attempts);
  const monthCounts = new Map<string, number>();
  for (const r of records)
    if (r.session.duration_minutes > 0) {
      const month = r.session.session_date.slice(0, 7);
      monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1);
    }
  const routes = new Set(attempts.map((a) => a.route_id)).size,
    gyms = new Set(records.map((r) => r.session.gym_id)).size,
    busiestMonth = Math.max(0, ...monthCounts.values());
  const counted = (value: number, target: number) =>
    complete ? { value: Math.min(value, target), target } : undefined;
  return [
    {
      id: "first-session",
      title: "Log your first session",
      hint: "Pick a gym and start a visit.",
      href: "/sessions/new",
      hrefLabel: "Start a session",
      status: decide(records.length > 0, sessionsLoaded),
    },
    {
      id: "first-route",
      title: "Log your first route",
      hint: "Add a route to a session and count your tries.",
      href: "/sessions",
      hrefLabel: "Open Sessions",
      status: decide(attempts.length > 0, complete),
    },
    {
      id: "finish-session",
      title: "Finish a session",
      hint: "Tap Finish and set how long you climbed.",
      href: "/sessions",
      hrefLabel: "Open Sessions",
      status: decide(
        records.some((r) => r.session.duration_minutes > 0),
        sessionsLoaded,
      ),
    },
    {
      id: "first-send",
      title: "Log your first send",
      hint: "Mark a route as Sent when you top it.",
      href: "/sessions",
      hrefLabel: "Open Sessions",
      status: decide(
        attempts.some((a) => a.result === "send" || a.result === "flash"),
        complete,
      ),
    },
    {
      id: "first-flash",
      title: "Log your first flash",
      hint: "Finish a route on your very first try.",
      href: "/sessions",
      hrefLabel: "Open Sessions",
      status: decide(
        attempts.some((a) => a.result === "flash"),
        complete,
      ),
    },
    {
      id: "first-note",
      title: "Write a private note",
      hint: "Open a route and note what worked.",
      href: "/sessions",
      hrefLabel: "Open Sessions",
      status: decide(
        attempts.some((a) => !!a.notes?.trim()),
        complete,
      ),
    },
    {
      id: "five-routes",
      title: "Log five different routes",
      hint: "Try a few problems across your visits.",
      href: "/climbs",
      hrefLabel: "Open your climbs",
      status: decide(routes >= 5, complete),
      progress: counted(routes, 5),
    },
    {
      id: "second-gym",
      title: "Climb at a second gym",
      hint: "Log a visit at a different gym.",
      href: "/sessions/new",
      hrefLabel: "Start a session",
      status: decide(gyms >= 2, sessionsLoaded),
      progress: sessionsLoaded ? { value: Math.min(gyms, 2), target: 2 } : undefined,
    },
    {
      id: "three-visits",
      title: "Three visits in one month",
      hint: "Finish three sessions in the same calendar month.",
      href: "/sessions/new",
      hrefLabel: "Start a session",
      status: decide(busiestMonth >= 3, sessionsLoaded),
      progress: sessionsLoaded
        ? { value: Math.min(busiestMonth, 3), target: 3 }
        : undefined,
    },
  ];
}

export const nextGoal = (goals: Goal[]) => goals.find((g) => g.status !== "done");
export const goalsDone = (goals: Goal[]) =>
  goals.filter((g) => g.status === "done").length;
