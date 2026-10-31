---
name: Bouldy
description: The existing phone-oriented climbing journal, preserved across Expo native and web.
colors:
  accent: "#d8151e"
  accent-strong: "#b30000"
  accent-ink: "#fbf7f7"
  accent-tint: "#ffe2dd"
  accent-tint-ink: "#8a050d"
  bg: "#f5f1e8"
  ink: "#0d0d0d"
  ink-muted: "#605b53"
  ink-faint: "#736d63"
  hairline: "#ddd6c9"
  panel: "#1c1a1a"
  panel-ink: "#f8f8f8"
  panel-ink-muted: "#b0adae"
  panel-track: "#393738"
  neutral: "#eceaeb"
  rail: "#f0eeee"
  flash-bg: "#c8f2c8"
  flash-ink: "#004b00"
  send-bg: "#cfe7ff"
  send-ink: "#004192"
  zone-bg: "#fee9be"
  zone-ink: "#6d4400"
  focus-web: "#d32828"
typography:
  display:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist-400, Geist, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4285714285714286
  label:
    fontFamily: "Geist-600, Geist, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3333333333333333
rounded:
  control: "12px"
  card: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  page: "20px"
  section: "24px"
  bottom: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-dark:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.panel-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-soft:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-tint-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    height: "48px"
  summary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.panel-ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  result-send:
    backgroundColor: "{colors.send-bg}"
    textColor: "{colors.send-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Approved native design, v35

The owner approved the design review on 31 October 2026 and directed all work to this Expo app. The old Next.js repository is deprecated. Visual source: https://bouldy-design-review.elatedbread66.chatgpt.site and the sibling `bouldy-design-review/components/design-review` source. This supersedes the previous one-for-one visual migration restriction. Domain/authentication/privacy safeguards remain unchanged.

## Material, type and controls

- Warm cream `#f5f1e8`, ink `#0d0d0d`, muted `#605b53`, hairline `#ddd6c9`; existing red brand accent and dark panels remain.
- Approved limestone WebP assets copied unchanged into `assets/textures/`, provenance retained. Grain at 12% opacity; navbar rock at 8%. Material never receives touch events.
- Local Geist body and Barlow Condensed headings, existing Bolt B and hold artwork. Shared text leading grows with font size to avoid clipped smaller text; default platform text scaling is retained.
- Primary/red and secondary/dark actions share pill geometry and minimum48 height. Stacked task actions use12 spacing and stay below the scrolling content. Circular back/help/add controls44; row chevrons32.
- Full-width hairline separators divide rows; spacing does not create detached separator bands. Row press/hover uses a warm brown tint. Solid linked actions retain their fill under press.

## Task layout

- Four main destinations: Home, Explore, Sessions, You. No profile shortcut duplicates the main navigation. Home header scrolls naturally.
- Home: greeting, monthly completed-visit progress, latest completed visit, active visit resume, progress link and fixed primary action. Empty state centred in remaining space. Missing/partial history is explicit.
- Explore: upcoming climber/community/competition destinations retain coming-soon status. No invented public activity or sharing.
- Sessions: active visit, dated monthly journal rows, Your climbs and fixed Record past visit action. Setup selects an existing gym and protects against sequential second-session creation.
- Live session: fixed header/back/help/Finish button, search and grade chips; only the virtualized FlatList scrolls.20-record batches expand on reaching the end. This is incremental rendering of fetched data, not backend pagination.
- Route: full-row detail target and independent sibling +1/Sent/eligible Flash controls. A finish preserves try count. Route sheet contains private note and fixed Save note/Correct count or result actions. Correction opens a nested sheet and returns to the original with its draft retained.
- Finish: scrolling native hours/minutes selectors, one Finish and keep climbs action. No redundant Keep climbing or forced-leave sheet. Completed visits show only actually logged routes.
- You: name/email, disabled forthcoming account controls with icons, adjacent logout row. Catalogue management is server-ID allowlisted and hidden from ordinary accounts.

## Motion, loading and feedback

- Animation-only launch: climbing hold rises and settles over2.2s, dismissed after2.4s. Reduce Motion uses a static600ms alternative. No splash buttons.
- Main-tab changes have no directional entrance; pushed screens retain the existing short transitions. Buttons retain restrained press feedback; existing sheet drag, enter/exit and reduced-motion behavior remain.
- Sheet handle, title and close stay outside the scrolling body; fixed footer controls and keyboard avoidance are shared.
- Success/error/info/warning snackbars have matching icons. They float at the top of the active presentation layer, never taking layout space. Only one host announces/renders; success/info expire4s, errors/warnings require dismissal.
- Skeletons are cold data boundaries. Navigation no longer overlays an unconditional skeleton. Owner-keyed process-memory snapshots survive background refresh failure; no private offline persistence, tokens or mutation queue. Refresh is deferred while a sheet, keyboard or editable web control is active. Identity change/logout invalidates caches and discards late reads.

## Verification scope

Native iPhone simulator Welcome/Login captures and shared Expo browser flow checks are recorded in `docs/redesign/HANDOFF.md`. Device Hub interaction remained unavailable. Physical iPhone, Android, native keyboard/gesture/VoiceOver and complete screenshot/motion parity remain acceptance gates. An exported native bundle is not a signed app or a release verdict.
