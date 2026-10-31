import { reportFrom, reportFromDestination, useActionError } from "../components/error-sheet";
import { useState, useRef } from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Sheet } from "./sheet";
import {
  T,
  Hold,
  Result,
  Button,
  A,
  Feedback,
  Field,
  Chevron,
} from "./primitives";
import { useAuth } from "../platform/auth";
import type { RouteState } from "../features/session-state";
import type { AttemptResult } from "../data/types";
import { colors as c } from "../theme/colors";
import { s } from "../theme/styles";
export function RouteSheet({
  state,
  sessionId,
  ended,
  error,
  open,
  close,
  log,
  onSaved,
}: {
  state: RouteState;
  sessionId: number;
  ended: boolean;
  error?: string;
  open: boolean;
  close: () => void;
  log: (state: RouteState, intent: string) => Promise<void>;
  onSaved: (message: string) => void;
}) {
  const { route, attempt, ambiguous, previous } = state,
    auth = useAuth(),
    report = useActionError(),
    [correcting, setCorrecting] = useState(false),
    [result, setResult] = useState<AttemptResult>(attempt?.result ?? "project"),
    [count, setCount] = useState(String(attempt?.num_attempts ?? 1)),
    [draft, setDraft] = useState(attempt?.notes ?? ""),
    [issue, setIssue] = useState(""),
    [pending, setPending] = useState(""),
    busy = useRef(false),
    completed = attempt?.result === "send" || attempt?.result === "flash",
    loggable = !ended && route.status === "active" && !completed && !ambiguous,
    flash = previous.complete && !previous.ambiguous && !previous.tried;
  async function save(correction = false) {
    if (!attempt || busy.current) return;
    busy.current = true;
    setPending(correction ? "correction" : "note");
    setIssue("");
    try {
      const out = await auth.command(
        correction ? "correctAttempt" : "saveAttemptNote",
        correction
          ? {
              session_id: sessionId,
              route_id: route.id,
              attempt_id: attempt.id,
              result,
              num_attempts: count,
            }
          : { session_id: sessionId, attempt_id: attempt.id, notes: draft },
      );
      const failure = reportFromDestination(out.destination, {
          context: "log-attempt",
          retry: () => save(correction),
        }),
        message = failure
          ? failure.message
          : out.status === "error"
            ? out.message
            : null;
      if (failure?.server) report(failure);
      else if (message) setIssue(message);
      else {
        if (correction) setCorrecting(false);
        onSaved(
          correction
            ? "Route log corrected."
            : (out.message ?? "Private note saved."),
        );
      }
    } catch (e) {
      report(
        reportFrom(e, {
          context: "log-attempt",
          retry: () => save(correction),
        }),
      );
    } finally {
      busy.current = false;
      setPending("");
    }
  }
  return (
    <Sheet
      title={`${route.grade} · ${route.colour || "Route"}`}
      open={open}
      close={close}
      footer={
        attempt && !ambiguous ? (
          <>
            <Button
              pending={pending === "note"}
              pendingLabel="Saving note"
              onPress={() => void save()}
            >
              Save note
            </Button>
            {!ended ? (
              <Button
                variant="dark"
                onPress={() => {
                  setIssue("");
                  setResult(attempt.result);
                  setCount(String(attempt.num_attempts));
                  setCorrecting(true);
                }}
              >
                Correct count or result
              </Button>
            ) : null}
          </>
        ) : undefined
      }
    >
      <View style={{ gap: 20 }}>
        {error || issue ? <Feedback>{error || issue}</Feedback> : null}
        <View style={[s.row, { gap: 16 }]}>
          <Hold colour={route.colour} size={56} />
          <View style={{ flex: 1 }}>
            <T size={17} weight={700}>
              {route.route_name}
            </T>
            <T color={c["ink-muted"]}>
              {route.wall || "Wall unrecorded"}
              {route.status === "retired" ? " · Retired" : ""}
            </T>
          </View>
        </View>
        <View style={[s.row, { gap: 12, paddingVertical: 12 }]}>
          <T display size={36} weight={800}>
            {ambiguous ? "—" : (attempt?.num_attempts ?? 0)}
          </T>
          <T color={c["ink-muted"]}>tries this visit</T>
          {attempt && !ambiguous ? <Result result={attempt.result} /> : null}
        </View>
        {ambiguous ? (
          <Feedback>
            Conflicting logs. Review route history; logging and corrections are
            paused.
          </Feedback>
        ) : null}
        {loggable ? (
          <View style={[s.row, { gap: 8 }]}>
            {[
              "attempt",
              "send",
              ...(!attempt && flash ? ["flash"] : []),
              ...(route.is_competition ? ["zone"] : []),
            ].map((intent) => (
              <Button
                key={intent}
                variant="neutral"
                style={{ flex: 1, paddingHorizontal: 8 }}
                pending={pending === intent}
                pendingLabel=""
                onPress={async () => {
                  setPending(intent);
                  try {
                    await log(state, intent);
                  } finally {
                    setPending("");
                  }
                }}
              >
                {intent === "attempt"
                  ? "+1 try"
                  : intent === "send"
                    ? "Sent"
                    : intent === "flash"
                      ? "Flash"
                      : "Zone"}
              </Button>
            ))}
          </View>
        ) : null}
        <T size={12} color={c["ink-muted"]}>
          Count every try with +1. Sent keeps this count. Flash means a
          first-ever-try finish.
        </T>
        {attempt && !ambiguous ? (
          <>
            <Field
              label="Your private note"
              value={draft}
              onChangeText={setDraft}
              multiline
              editable={!pending}
              style={{ minHeight: 120, textAlignVertical: "top" }}
            />
            <T size={12} color={c["ink-muted"]}>
              Only you can see this note. Notes never change your try count.
            </T>
          </>
        ) : null}
        <A
          href={`/routes/${route.id}?from=${sessionId}`}
          style={[s.between, { minHeight: 64, gap: 12 }]}
        >
          <View>
            <T weight={700}>Your route history</T>
            <T color={c["ink-muted"]}>
              {previous.total === null
                ? "Earlier visits unavailable"
                : `${previous.total} tries on earlier visits`}
            </T>
          </View>
          <Chevron />
        </A>
      </View>
      <Sheet
        title="Correct count or result"
        open={open && correcting}
        close={() => {
          setCorrecting(false);
          setIssue("");
        }}
        footer={
          <Button
            pending={pending === "correction"}
            pendingLabel="Saving correction"
            onPress={() => void save(true)}
          >
            Save correction
          </Button>
        }
      >
        <View style={{ gap: 16 }}>
          <T>
            A correction changes your existing log. It doesn’t add another try.
          </T>
          <Field
            label="Tries this visit"
            value={count}
            onChangeText={setCount}
            keyboardType="number-pad"
          />
          <T weight={600}>Result</T>
          <Picker
            selectedValue={result}
            onValueChange={setResult}
            accessibilityLabel="Corrected result"
            itemStyle={{ color: c.ink, fontFamily: "Geist-500" }}
          >
            {(
              [
                ["project", "In progress"],
                ["send", "Sent"],
                ["flash", "Flash"],
                ["zone", "Zone"],
              ] as const
            )
              .filter(
                ([v]) =>
                  (v !== "flash" || flash || attempt?.result === "flash") &&
                  (v !== "zone" ||
                    route.is_competition ||
                    attempt?.result === "zone"),
              )
              .map(([value, label]) => (
                <Picker.Item key={value} value={value} label={label} />
              ))}
          </Picker>
          <T size={12} color={c["ink-muted"]}>
            A flash is always one try.
          </T>
          {issue ? <Feedback>{issue}</Feedback> : null}
        </View>
      </Sheet>
    </Sheet>
  );
}
