---
name: Bouldy
description: Approved v35 cream and limestone climbing journal for Expo native and web.
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
  neutral: "#e7e0d4"
  control-neutral: "#ddd6c9"
  rail: "#eee8dc"
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
    lineHeight: 1.125
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.125
    letterSpacing: "-0.02em"
  title:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1.125
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist-400, Geist, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Geist-600, Geist, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.5
rounded:
  control: "12px"
  card: "12px"
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
    backgroundColor: "{colors.bg}"
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

Source snapshot: `55b51d8` (31 October 2026). The structured tokens below describe shared primitives; page-specific values such as the profile hero’s larger corners and PageTitle’s compressed heading metrics are intentional exceptions. Preview ramps are generated documentation aids, not extra runtime colours. The original migration screenshots and earlier 78-test evidence do not verify this entire current design.

## Material, type and controls

- Warm cream `#f5f1e8`, ink `#0d0d0d`, muted `#605b53`, hairline `#ddd6c9`; existing red brand accent and dark panels remain.
- Approved limestone WebP assets copied unchanged into `assets/textures/`, provenance retained. Grain at 12% opacity; navbar rock at 8%. Material never receives touch events.
- Local Geist body and Barlow Condensed headings, existing Bolt B and hold artwork. Shared text leading grows with font size to avoid clipped smaller text; default platform text scaling is retained.
- Primary/red and secondary/dark actions share pill geometry and minimum48 height. Stacked task actions use12 spacing and stay below the scrolling content. Circular back/help/add controls44; row chevrons32.
- Full-width hairline separators divide rows; spacing does not create detached separator bands. Row press/hover uses a warm brown tint. Solid linked actions retain their fill under press.

## Task layout

- Native root/loading frames and sheets fill the device; only the browser canvas and web sheets retain the centred 430-unit cap. The outer native safe-area background uses cream.
- Planned subpage headers use a 12-unit label/badge gap and a 12-unit gap above the title, with shared Heading leading.
- Main-page PageTitle combines the Bolt B mark and condensed title. Active-visit cards use a faint, noninteractive staggered Bolt B pattern.
- Shared pages scroll/bounce only when measured content exceeds the viewport; forms and long lists remain scrollable when needed.
- Four main destinations: Home, Explore, Sessions, You. No profile shortcut duplicates the main navigation. Home header scrolls naturally.
- Home: greeting, monthly completed-visit progress, latest completed visit, active visit resume, progress link and fixed primary action. Empty state centred in remaining space. Missing/partial history is explicit.
- Explore: upcoming climber/community/competition destinations retain coming-soon status. No invented public activity or sharing.
- Sessions: active visit, dated monthly journal rows, Your climbs and fixed Record past visit action. Setup selects an existing gym and protects against sequential second-session creation.
- Live session: fixed header/back/help/Finish button, search and grade chips; only the virtualized FlatList scrolls.20-record batches expand on reaching the end. This is incremental rendering of fetched data, not backend pagination.
- Route: full-row detail target and independent sibling +1/Sent/eligible Flash controls. A finish preserves try count. Route sheet contains private note and fixed Save note/Correct count or result actions. Correction opens a nested sheet and returns to the original with its draft retained.
- Finish: scrolling native hours/minutes selectors, one Finish and keep climbs action. No redundant Keep climbing or forced-leave sheet. Completed visits show only actually logged routes.
- You: dark rounded hero with an initial avatar, name/email and faint Bolt B artwork; settings sit directly beneath it, without detached separator bands. Catalogue administrators see the Manage gyms row; ordinary accounts do not. The admin Gyms page lists catalogue entries and add/edit actions behind the existing server-ID allowlist. Logout remains adjacent to settings, without the removed separator below it.

## Motion, loading and feedback

- Animation-only launch uses a dark panel with rising holds, Bolt B resolution and a settling wordmark. The current implementation holds until 2800ms then fades for 200ms; Reduce Motion uses a static 400ms alternative. There are no splash buttons. These are code timings, not measured device timing acceptance.
- Navigation and first-paint HTML/PWA metadata use cream; routes are eagerly bundled (`asyncRoutes: false`) to avoid an extra route-loading blank frame. Source configuration does not prove every device transition is flash-free.
- Main-tab changes have no directional entrance; pushed screens retain the existing short transitions. Buttons retain restrained press feedback; existing sheet drag, enter/exit and reduced-motion behavior remain.
- Sheet handle, title and close stay outside the scrolling body; fixed footer controls and keyboard avoidance are shared.
- Success/error/info/warning snackbars have matching icons. They float at the top of the active presentation layer, never taking layout space. Only one host announces/renders; success/info expire4s, errors/warnings require dismissal.
- Read failures use SectionError at the failed section; action failures use the contextual error sheet and user-facing status copy in `src/features/error-copy.ts`. Retry is explicit; no mutation is automatically replayed. `/error-preview` has a development guard. `/skeleton-preview` exists for inspection but its production exclusion remains unverified.
- Skeletons mirror current page layouts and are cold data boundaries. Navigation no longer overlays an unconditional skeleton. Owner-keyed process-memory snapshots survive background refresh failure; no private offline persistence, tokens or mutation queue. Refresh is deferred while a sheet, keyboard or editable web control is active. Identity change/logout invalidates caches and discards late reads.

## Do's and Don'ts

### Do:

- **Do** preserve the approved cream/limestone identity, supplied fonts and brand artwork.
- **Do** fill the native device width while preserving the browser phone canvas.
- **Do** use shared controls, explicit error recovery, account-safe state and reduced motion.
- **Do** record exact commits and platforms when accepting behaviour.

### Don't:

- **Don't** revert to the old five-tab or exact-copy visual baseline.
- **Don't** invent activity, timing, admin authority or offline persistence.
- **Don't** treat screenshots, previews or a source commit as full device/PWA/release acceptance.

## Verification scope

Native iPhone simulator Welcome/Login captures and shared Expo browser flow checks are recorded in `docs/redesign/HANDOFF.md`. Device Hub interaction remained unavailable. Physical iPhone, Android, native keyboard/gesture/VoiceOver and complete screenshot/motion parity remain acceptance gates. An exported native bundle is not a signed app or a release verdict.

Input surfaces use the existing cream background token on native and web, including multiline notes and route search. Web autofill keeps that cream fill and ink text through an inset fill, while retaining keyboard-focus outlines and system colours in forced-colour mode.
