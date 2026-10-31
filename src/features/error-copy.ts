/**
 * One place that turns a failure into words people understand.
 *
 * The backend sends only `{ detail: string }` plus an HTTP status, so the HTTP
 * status is the contract today. When the backend adds stable error codes
 * (see the P1 "Standardise backend error responses" card), `kindFromCode`
 * is the single place to extend; everything else keeps working.
 */
export type ErrorKind =
  | "network"
  | "unavailable"
  | "auth"
  | "forbidden"
  | "notFound"
  | "conflict"
  | "validation"
  | "server";

export type ErrorContext =
  | "load"
  | "start-session"
  | "log-attempt"
  | "finish-session"
  | "save-route"
  | "add-gym"
  | "logout"
  | "generic";

export type ErrorAction = "retry" | "close" | "login" | "back";
export type ErrorCopy = {
  kind: ErrorKind;
  title: string;
  body: string;
  primary: { label: string; action: ErrorAction };
  secondary?: { label: string; action: ErrorAction };
};

/** Status 0 means the request never reached the server (offline, DNS, CORS, timeout). */
export function kindFromStatus(status: number | undefined): ErrorKind {
  if (status === 0) return "network";
  if (status === 401) return "auth";
  if (status === 403) return "forbidden";
  if (status === 404) return "notFound";
  if (status === 409) return "conflict";
  if (status === 400 || status === 422) return "validation";
  if (status === 502 || status === 503 || status === 504) return "unavailable";
  return "server";
}

/** Reserved for backend error codes once they exist. Unknown codes fall back to status. */
export function kindFromCode(
  code: string | undefined,
  status: number | undefined,
): ErrorKind {
  void code;
  return kindFromStatus(status);
}

/** What the person was trying to do, in the phrase used inside a sentence. */
const verbs: Record<ErrorContext, string> = {
  load: "load this",
  "start-session": "start your visit",
  "log-attempt": "save that climb",
  "finish-session": "finish your visit",
  "save-route": "save that route",
  "add-gym": "add that gym",
  logout: "log you out",
  generic: "do that",
};

const gone: Record<ErrorContext, string> = {
  load: "This may have been removed.",
  "start-session": "That gym may have been removed.",
  "log-attempt": "That visit or route may have been removed.",
  "finish-session": "That visit may have been removed.",
  "save-route": "That route or gym may have been removed.",
  "add-gym": "That gym may have been removed.",
  logout: "Your account may have changed.",
  generic: "It may have been removed.",
};

export function describeError(
  error: { status?: number; message?: string },
  context: ErrorContext = "generic",
  options: { canRetry?: boolean; canGoBack?: boolean } = {},
): ErrorCopy {
  const kind = kindFromCode(undefined, error.status),
    verb = verbs[context],
    retry = options.canRetry
      ? ({ label: "Try again", action: "retry" } as const)
      : ({ label: "Got it", action: "close" } as const),
    close = { label: "Close", action: "close" } as const;
  switch (kind) {
    case "network":
      return {
        kind,
        title: "No connection",
        body: `We couldn't ${verb}. Check your internet connection and try again.`,
        primary: retry,
        secondary: options.canRetry ? close : undefined,
      };
    case "unavailable":
      return {
        kind,
        title: "Bouldy is taking a breather",
        body: `We couldn't ${verb} because the service is busy or starting up. Wait a moment and try again.`,
        primary: retry,
        secondary: options.canRetry ? close : undefined,
      };
    case "auth":
      return {
        kind,
        title: "Please log in again",
        body: "Your login has expired. Log in again to carry on. Nothing you saved has been lost.",
        primary: { label: "Log in", action: "login" },
      };
    case "forbidden":
      return {
        kind,
        title: "You can't do that",
        body: "Your account doesn't have access to this. If you think it should, check you're logged in to the right account.",
        primary: { label: "Got it", action: "close" },
      };
    case "notFound":
      return {
        kind,
        title: "That's no longer there",
        body: gone[context],
        primary: options.canGoBack
          ? { label: "Go back", action: "back" }
          : { label: "Got it", action: "close" },
        secondary: options.canGoBack ? close : undefined,
      };
    case "conflict":
      return {
        kind,
        title: "That clashes with something",
        body: friendly(
          error.message,
          `We couldn't ${verb} because something changed. Refresh and try again.`,
        ),
        primary: { label: "Got it", action: "close" },
      };
    case "validation":
      return {
        kind,
        title: "Check your details",
        body: friendly(
          error.message,
          `We couldn't ${verb}. Check what you entered and try again.`,
        ),
        primary: { label: "Got it", action: "close" },
      };
    default:
      return {
        kind: "server",
        title: "Something went wrong on our side",
        body: `We couldn't ${verb}. This isn't your fault. Try again in a moment.`,
        primary: retry,
        secondary: options.canRetry ? close : undefined,
      };
  }
}

/**
 * Backend `detail` strings are developer text. Only show a message we authored
 * (a short sentence with no field paths, codes, or stack-like content).
 */
function friendly(message: string | undefined, fallback: string) {
  if (!message) return fallback;
  const text = message.trim();
  if (
    text.length < 4 ||
    text.length > 140 ||
    /[{}[\]<>]|\bnull\b|\bundefined\b|\bvalue_error\b|\bfield required\b|\bstring\b.*\btype\b/i.test(
      text,
    )
  )
    return fallback;
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

/** Short reason shown inside a failed list or section. */
export function describeLoadFailure(
  status: number | undefined,
  what: string,
): { title: string; reason: string } {
  const kind = kindFromStatus(status);
  const title = `Couldn't load ${what}`;
  if (kind === "network")
    return { title, reason: "Check your connection and try again." };
  if (kind === "unavailable")
    return {
      title,
      reason: "Bouldy is busy or starting up. Try again in a moment.",
    };
  if (kind === "forbidden")
    return { title, reason: "Your account doesn't have access to this." };
  if (kind === "notFound")
    return { title, reason: "It may have been removed." };
  return { title, reason: "That's on our side. Try again in a moment." };
}

/**
 * One sentence for places that keep errors inline (forms). Network and server
 * failures get plain words; anything else keeps the authored message.
 */
export function plainMessage(error: { status?: number; message?: string }) {
  const kind = kindFromStatus(error.status);
  if (kind === "network")
    return "Couldn't reach Bouldy. Check your connection and try again.";
  // Only swap generic HTTP text. A sentence we wrote ourselves stays as written.
  const generic =
    !error.message ||
    /^(internal server error|bad gateway|service unavailable|gateway timeout|something went wrong)\.?$/i.test(
      error.message.trim(),
    );
  if ((kind === "unavailable" || kind === "server") && generic)
    return "Bouldy is having trouble right now. Try again in a moment.";
  return error.message || "Something went wrong. Try again.";
}
