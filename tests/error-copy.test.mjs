import test from "node:test";
import assert from "node:assert/strict";
import {
  describeError,
  describeLoadFailure,
  kindFromStatus,
} from "../src/features/error-copy.ts";

test("status maps to a kind", () => {
  assert.equal(kindFromStatus(0), "network");
  assert.equal(kindFromStatus(401), "auth");
  assert.equal(kindFromStatus(403), "forbidden");
  assert.equal(kindFromStatus(404), "notFound");
  assert.equal(kindFromStatus(409), "conflict");
  assert.equal(kindFromStatus(422), "validation");
  assert.equal(kindFromStatus(503), "unavailable");
  assert.equal(kindFromStatus(500), "server");
  assert.equal(kindFromStatus(undefined), "server");
});

test("network error offers retry and names the action", () => {
  const copy = describeError({ status: 0 }, "start-session", { canRetry: true });
  assert.equal(copy.title, "No connection");
  assert.match(copy.body, /start your visit/);
  assert.equal(copy.primary.action, "retry");
  assert.equal(copy.secondary?.action, "close");
});

test("without a retry the only action is to close", () => {
  const copy = describeError({ status: 500 }, "log-attempt");
  assert.equal(copy.primary.action, "close");
  assert.equal(copy.secondary, undefined);
});

test("auth failure asks the person to log in", () => {
  assert.equal(describeError({ status: 401 }).primary.action, "login");
});

test("missing resource offers to go back only when possible", () => {
  assert.equal(
    describeError({ status: 404 }, "load", { canGoBack: true }).primary.action,
    "back",
  );
  assert.equal(describeError({ status: 404 }).primary.action, "close");
});

test("developer detail text is never shown to people", () => {
  const raw = describeError({ status: 422, message: "value_error.missing: body -> {'gym_id'}" });
  assert.doesNotMatch(raw.body, /value_error|gym_id/);
  const authored = describeError({ status: 400, message: "That route does not belong to this gym" });
  assert.equal(authored.body, "That route does not belong to this gym.");
});

test("load failures give a short reason", () => {
  assert.equal(describeLoadFailure(0, "your visits").title, "Couldn't load your visits");
  assert.match(describeLoadFailure(0, "x").reason, /connection/);
  assert.match(describeLoadFailure(500, "x").reason, /our side/);
});

import { plainMessage } from "../src/features/error-copy.ts";
test("inline messages replace raw HTTP text but keep authored sentences", () => {
  assert.match(plainMessage({ status: 500, message: "Internal Server Error" }), /trouble/);
  assert.equal(
    plainMessage({ status: 500, message: "Could not add this sample gym. Try again." }),
    "Could not add this sample gym. Try again.",
  );
  assert.match(plainMessage({ status: 0, message: "x" }), /connection/);
  assert.equal(plainMessage({ status: 401, message: "Incorrect email or password" }), "Incorrect email or password");
});
