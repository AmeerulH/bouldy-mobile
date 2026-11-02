import test from "node:test";
import assert from "node:assert/strict";
import { showsTabBar } from "../src/features/tab-bar.ts";

test("the tab bar stays on the four root screens only", () => {
  for (const path of ["/", "/explore", "/sessions", "/profile"]) {
    assert.equal(showsTabBar(path), true);
  }
  for (const path of [
    "/learn",
    "/learn/lessons/1",
    "/sessions/3",
    "/sessions/new",
    "/explore/feed",
    "/profile/edit",
    "/climbs",
    "/gyms/1",
    "/routes/11",
  ]) {
    assert.equal(showsTabBar(path), false);
  }
});
