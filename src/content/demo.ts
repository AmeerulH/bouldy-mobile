// Sample data for the practice screens in guides. Never read from or written to the journal.
import type { Attempt, Route } from "../data/types.ts";
import type { RouteState } from "../features/session-state.ts";
import type { GuideStep } from "./guides.ts";

export const demoGym = "Sample Boulder Club";

const route = (
  id: number,
  grade: string,
  colour: string,
  name: string,
  wall: string,
  styles: string[],
): Route => ({
  id,
  gym_id: 1,
  route_name: name,
  grade,
  colour,
  wall,
  setter: null,
  set_date: null,
  retired_date: null,
  status: "active",
  styles,
});

export const demoRoutes: Route[] = [
  route(1, "V1", "yellow", "First steps", "Vertical", ["Footwork"]),
  route(2, "V2", "purple", "A little reach", "Slab", ["Balance"]),
  route(3, "V3", "black", "Keep the tension", "Overhang", ["Core"]),
];

/** Practice attempts, by route id. */
export type DemoAttempts = Record<number, Attempt>;

// Every sample route is new to the user, so the flash button is on offer until it is tried.
const fresh = {
  entries: [],
  complete: true,
  ambiguous: false,
  total: 0,
  sent: false,
  tried: false,
};

export const demoStates = (attempts: DemoAttempts): RouteState[] =>
  demoRoutes.map((r) => ({
    route: r,
    attempt: attempts[r.id],
    ambiguous: false,
    previous: fresh,
    project: false,
  }));

/** The attempt a practice tap produces. A send or flash keeps the tries counted so far. */
export function demoLog(
  attempts: DemoAttempts,
  routeId: number,
  intent: string,
): DemoAttempts {
  const before = attempts[routeId],
    tries = before?.num_attempts ?? 0,
    next: Attempt = {
      id: routeId,
      session_id: 1,
      route_id: routeId,
      num_attempts:
        intent === "flash"
          ? 1
          : intent === "send"
            ? Math.max(1, tries)
            : tries + 1,
      result:
        intent === "flash" ? "flash" : intent === "send" ? "send" : "project",
      notes: null,
    };
  return { ...attempts, [routeId]: next };
}

/** Whether the user has done what a step asks. */
export function demoMet(step: GuideStep | undefined, attempts: DemoAttempts) {
  const want = step?.expect;
  if (!want) return true;
  const got = attempts[want.route];
  if (!got) return false;
  return want.kind === "try" ? got.num_attempts >= 1 : got.result === want.kind;
}
