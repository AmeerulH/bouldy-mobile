import { View } from "react-native";
import { Heading, PageTitle, T } from "../../components/primitives";
import { Pressable } from "../../components/pressable";
import { Screen } from "../../components/screen";
import { NotFound } from "../../components/not-found";
import { SectionError } from "../../components/section-error";
import { useActionError, type ErrorReport } from "../../components/error-sheet";
import { useSnackbar } from "../../components/snackbar";
import { colors as c } from "../../theme/colors";

/** Local preview only: every error scenario as the real components render it. */
const sheets: { page: string; label: string; report: ErrorReport }[] = [
  { page: "Start session", label: "Offline", report: { status: 0, context: "start-session" } },
  { page: "Start session", label: "Server error (500)", report: { status: 500, context: "start-session" } },
  { page: "Start session", label: "Service busy (503)", report: { status: 503, context: "start-session" } },
  { page: "Start session", label: "Conflict (409)", report: { status: 409, context: "start-session", message: "You already have a visit open" } },
  { page: "Log a climb", label: "Route removed (404)", report: { status: 404, context: "log-attempt", canGoBack: true } },
  { page: "Log a climb", label: "Offline", report: { status: 0, context: "log-attempt" } },
  { page: "Log a climb", label: "Server error, no retry", report: { status: 500, context: "log-attempt", retry: undefined } },
  { page: "Finish visit", label: "Bad input (422, developer text)", report: { status: 422, context: "finish-session", message: "value_error: body -> duration_minutes" } },
  { page: "Finish visit", label: "Bad input (400, our sentence)", report: { status: 400, context: "finish-session", message: "That visit is already finished" } },
  { page: "Add gym", label: "No access (403)", report: { status: 403, context: "add-gym" } },
  { page: "Save route", label: "Server error (500)", report: { status: 500, context: "save-route" } },
  { page: "Any action", label: "Login expired (401)", report: { status: 401, context: "generic" } },
];
const lists: { page: string; what: string; status: number; note: string }[] = [
  { page: "Sessions", what: "your visits", status: 0, note: "Offline" },
  { page: "Gyms", what: "gyms", status: 500, note: "Server error" },
  { page: "Gym routes", what: "this gym's routes", status: 503, note: "Service busy" },
  { page: "Climbs", what: "your climbs", status: 404, note: "Removed" },
  { page: "Profile", what: "your profile", status: 403, note: "No access" },
];

export default function ErrorPreview() {
  const report = useActionError(),
    snackbar = useSnackbar();
  if (!__DEV__) return <NotFound />;
  const pages = [...new Set(sheets.map((s) => s.page))];
  return (
    <Screen>
      <View style={{ padding: 20, gap: 28 }}>
        <View style={{ gap: 8 }}>
          <Heading size={30}>Error catalogue</Heading>
          <T color={c["ink-muted"]} style={{ lineHeight: 24 }}>
            Local preview only. Failed loads show inline where the content would
            be. Failed actions open a bottom sheet.
          </T>
        </View>

        <View style={{ gap: 4 }}>
          <Heading size={22}>Failed load: inline</Heading>
          <T color={c["ink-muted"]}>
            Same footprint as the list, so nothing around it moves.
          </T>
        </View>
        <View style={{ gap: 12 }}>
          <T size={12} weight={600} color={c["ink-muted"]}>
            SESSIONS PAGE IN CONTEXT
          </T>
          <View
            style={{
              borderWidth: 1,
              borderColor: c.hairline,
              borderRadius: 16,
              padding: 16,
              gap: 16,
            }}
          >
            <PageTitle>Sessions</PageTitle>
            <SectionError what="your visits" status={0} retry={() => {}} />
          </View>
        </View>
        {lists.map((l) => (
          <View key={l.page} style={{ gap: 8 }}>
            <T size={12} weight={600} color={c["ink-muted"]}>
              {l.page.toUpperCase()} · {l.note.toUpperCase()}
            </T>
            <SectionError what={l.what} status={l.status} retry={() => {}} />
          </View>
        ))}

        <View style={{ gap: 4 }}>
          <Heading size={22}>Failed action: bottom sheet</Heading>
          <T color={c["ink-muted"]}>
            Tap a scenario. Try again runs the action again.
          </T>
        </View>
        {pages.map((page) => (
          <View key={page} style={{ gap: 8 }}>
            <T size={12} weight={600} color={c["ink-muted"]}>
              {page.toUpperCase()}
            </T>
            {sheets
              .filter((s) => s.page === page)
              .map((s) => (
                <Pressable
                  key={s.label}
                  accessibilityRole="button"
                  onPress={() =>
                    report({
                      ...s.report,
                      retry:
                        "retry" in s.report
                          ? s.report.retry
                          : () => snackbar("Ran the action again."),
                    })
                  }
                  style={({ pressed }) => ({
                    minHeight: 52,
                    justifyContent: "center",
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: c.hairline,
                    backgroundColor: pressed ? c.pressed : "transparent",
                  })}
                >
                  <T weight={600}>{s.label}</T>
                </Pressable>
              ))}
          </View>
        ))}
      </View>
    </Screen>
  );
}
