import test from "node:test";
import assert from "node:assert/strict";
import { evaluateGoals, nextGoal, goalsDone } from "../src/domain/learn-goals.ts";
import {
  emptyLearnState,
  learnKey,
  orderLessons,
  parseLearnState,
  searchGlossary,
  toggleLesson,
  tourEntry,
} from "../src/domain/learn-progress.ts";
import { glossary, lessons, tourSteps } from "../src/content/learn.ts";

const session = (id, duration = 60, gym = 1, date = "2026-10-03") => ({ id, user_id: 1, gym_id: gym, session_date: date, duration_minutes: duration, notes: null });
const attempt = (id, route, result = "project", notes = null) => ({ id, session_id: 1, route_id: route, num_attempts: 1, result, notes });
const record = (s, attempts = [], loaded = true) => ({ session: s, attempts, loaded });
const journal = (records, sessionsLoaded = true) => ({ records, sessionsLoaded });
const status = (goals, id) => goals.find((g) => g.id === id).status;

test("an empty loaded journal has every goal to do and a first-session next goal", () => {
  const goals = evaluateGoals(journal([]));
  assert.ok(goals.every((g) => g.status === "todo"));
  assert.equal(nextGoal(goals).id, "first-session");
  assert.equal(goalsDone(goals), 0);
});

test("an unloaded journal never claims goals are to do", () => {
  const goals = evaluateGoals(journal([], false));
  assert.ok(goals.every((g) => g.status === "unknown"));
});

test("first session, finish and route goals follow real records", () => {
  const goals = evaluateGoals(journal([record(session(1, 0), [attempt(1, 5)])]));
  assert.equal(status(goals, "first-session"), "done");
  assert.equal(status(goals, "first-route"), "done");
  assert.equal(status(goals, "finish-session"), "todo");
  assert.equal(status(goals, "first-send"), "todo");
});

test("sends and flashes are done on evidence even with partial history", () => {
  const partial = journal([record(session(1), [attempt(1, 5, "flash")]), record(session(2), [], false)]);
  const goals = evaluateGoals(partial);
  assert.equal(status(goals, "first-send"), "done");
  assert.equal(status(goals, "first-flash"), "done");
  assert.equal(status(goals, "first-note"), "unknown");
  assert.equal(goals.find((g) => g.id === "five-routes").progress, undefined);
});

test("notes, route variety, gyms and monthly visits are counted", () => {
  const records = [
    record(session(1, 60, 1, "2026-10-01"), [attempt(1, 1, "send", "slopey"), attempt(2, 2), attempt(3, 3)]),
    record(session(2, 60, 2, "2026-10-08"), [attempt(4, 4), attempt(5, 5)]),
    record(session(3, 45, 2, "2026-10-15")),
  ];
  const goals = evaluateGoals(journal(records));
  assert.equal(status(goals, "first-note"), "done");
  assert.equal(status(goals, "five-routes"), "done");
  assert.equal(status(goals, "second-gym"), "done");
  assert.equal(status(goals, "three-visits"), "done");
  assert.deepEqual(goals.find((g) => g.id === "five-routes").progress, { value: 5, target: 5 });
});

test("active sessions do not count toward monthly visits", () => {
  const records = [1, 2, 3].map((id) => record(session(id, id === 3 ? 0 : 60, 1, "2026-10-0" + id)));
  assert.equal(status(evaluateGoals(journal(records)), "three-visits"), "todo");
});

test("tour entry: empty journal auto-opens, history offers, handled or unknown stays quiet", () => {
  assert.equal(tourEntry(emptyLearnState, journal([])), "auto");
  assert.equal(tourEntry(emptyLearnState, journal([record(session(1))])), "offer");
  assert.equal(tourEntry({ ...emptyLearnState, prompted: true }, journal([])), "none");
  assert.equal(tourEntry({ ...emptyLearnState, tourDone: true }, journal([])), "none");
  assert.equal(tourEntry(emptyLearnState, journal([], false)), "none");
});

test("stored state parses tolerantly and is keyed per user", () => {
  assert.deepEqual(parseLearnState(null), emptyLearnState);
  assert.deepEqual(parseLearnState("not json"), emptyLearnState);
  assert.deepEqual(parseLearnState("42"), emptyLearnState);
  const state = parseLearnState(JSON.stringify({ level: "beginner", tourDone: true, lessonsDone: ["a", 3] }));
  assert.equal(state.level, "beginner");
  assert.equal(state.tourDone, true);
  assert.deepEqual(state.lessonsDone, ["a"]);
  assert.equal(parseLearnState(JSON.stringify({ level: "pro" })).level, null);
  assert.notEqual(learnKey(1), learnKey(2));
});

test("lessons order by level, keep every lesson, and toggle completion", () => {
  assert.equal(orderLessons(lessons, null), lessons);
  for (const level of ["beginner", "experienced"]) {
    const ordered = orderLessons(lessons, level);
    assert.equal(ordered.length, lessons.length);
    assert.equal(ordered[0].level, level);
  }
  const done = toggleLesson(emptyLearnState, "grades");
  assert.deepEqual(done.lessonsDone, ["grades"]);
  assert.deepEqual(toggleLesson(done, "grades").lessonsDone, []);
});

test("glossary search filters by text and category, sorted A to Z", () => {
  assert.equal(searchGlossary(glossary, "", null).length, glossary.length);
  assert.deepEqual(searchGlossary(glossary, "flash", null).map((t) => t.id).includes("flash"), true);
  const holds = searchGlossary(glossary, "", "Holds");
  assert.ok(holds.length > 3 && holds.every((t) => t.category === "Holds"));
  const names = holds.map((t) => t.term);
  assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b)));
  assert.equal(searchGlossary(glossary, "zzzz", null).length, 0);
});

test("content has unique ids and no em dashes", () => {
  for (const list of [tourSteps, lessons, glossary]) assert.equal(new Set(list.map((x) => x.id)).size, list.length);
  assert.ok(!JSON.stringify({ tourSteps, lessons, glossary }).includes("\u2014"));
});
