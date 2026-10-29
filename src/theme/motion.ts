// Exact source values. The migration contract takes precedence over library defaults.
export const motion = {
  easeOut: [.22, 1, .36, 1] as const,
  sheetExit: [.64, 0, .78, 0] as const,
  sheetInMs: 260, sheetOutMs: 200,
  snackbarInMs: 260, snackbarOutMs: 180, snackbarVisibleMs: 5000,
  welcomeMs: 500,
};
