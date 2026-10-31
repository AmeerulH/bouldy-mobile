import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { Sheet } from "./sheet";
import { Button, T } from "./primitives";
import {
  describeError,
  type ErrorAction,
  type ErrorContext,
} from "../features/error-copy";
import { colors as c } from "../theme/colors";

export type ErrorReport = {
  /** HTTP status, or 0 when the request never reached the server. */
  status?: number;
  message?: string;
  context?: ErrorContext;
  /** When given, the sheet offers "Try again" and runs this. */
  retry?: () => void | Promise<void>;
  /** When true, a missing resource can send the person back. */
  canGoBack?: boolean;
};

const Context = createContext<(report: ErrorReport) => void>(() => {});

/** Report a failed action. Shows the error bottom sheet. */
export function useActionError() {
  return useContext(Context);
}

/** Pull `{ status, message }` out of any thrown value. */
export function reportFrom(
  error: unknown,
  rest: Omit<ErrorReport, "status" | "message"> = {},
): ErrorReport {
  const e = error as { status?: unknown; message?: unknown } | null;
  return {
    status: typeof e?.status === "number" ? e.status : undefined,
    message: typeof e?.message === "string" ? e.message : undefined,
    ...rest,
  };
}

/**
 * Commands that fail on the server redirect back with `?error=` and, when the
 * backend was the source, `&errorStatus=`. Returns null when it was a success.
 */
export function reportFromDestination(
  destination: string | undefined,
  rest: Omit<ErrorReport, "status" | "message"> = {},
): (ErrorReport & { server: boolean }) | null {
  if (!destination) return null;
  const params = new URL(destination, "http://local").searchParams,
    message = params.get("error");
  if (!message) return null;
  const status = params.get("errorStatus");
  return {
    message,
    status: status === null ? undefined : Number(status),
    server: status !== null,
    ...rest,
  };
}

export function ErrorSheetProvider({ children }: { children: ReactNode }) {
  const [report, setReport] = useState<ErrorReport | null>(null),
    [open, setOpen] = useState(false),
    copy = report
      ? describeError(report, report.context, {
          canRetry: !!report.retry,
          canGoBack: report.canGoBack,
        })
      : null;
  function show(next: ErrorReport) {
    setReport(next);
    setOpen(true);
  }
  const close = () => setOpen(false);
  function run(action: ErrorAction) {
    setOpen(false);
    if (action === "retry") void report?.retry?.();
    else if (action === "back") router.back();
  }
  return (
    <Context.Provider value={show}>
      {children}
      <Sheet
        title={copy?.title ?? "Something went wrong"}
        open={open}
        close={close}
        footer={
          copy ? (
            <View style={{ gap: 8 }}>
              <Button onPress={() => run(copy.primary.action)}>
                {copy.primary.label}
              </Button>
              {copy.secondary ? (
                <Button
                  variant="neutral"
                  onPress={() => run(copy.secondary!.action)}
                >
                  {copy.secondary.label}
                </Button>
              ) : null}
            </View>
          ) : undefined
        }
      >
        <T size={16} color={c["ink-muted"]} style={{ lineHeight: 24 }}>
          {copy?.body}
        </T>
      </Sheet>
    </Context.Provider>
  );
}
