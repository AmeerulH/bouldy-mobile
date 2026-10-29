# Screen and interaction parity register

Prepared 28 October 2026. Baseline tables below are the frozen source contracts. Implementation updates for this local M0–M2 run are in the sibling CSV registers and MIGRATION_PROGRESS.md. No full screen/platform parity row is accepted. Source paths are relative to `bouldy-web`; target paths are proposed in `bouldy-mobile`. All production screens must pass on iOS, Android and Expo web.

| ID | URL / surface | Current state | Exact contract to retain | Source | Proposed target |
| --- | --- | --- | --- | --- | --- |
| S01 | `/welcome` — Welcome | Functional | Full-height dark welcome, exact holds, text and signup/login links | `app/(auth)/welcome/page.tsx` | `src/app/(auth)/welcome.tsx` |
| S02 | `/login` — Login | Functional | Email/password, exact validation and errors, pending label, signup link, Meet Bouldy | `app/(auth)/login/page.tsx` | `src/app/(auth)/login.tsx` |
| S03 | `/signup` — Signup | Functional | Username/email/password/optional current grade; register then login; no new onboarding | `app/(auth)/signup/page.tsx` | `src/app/(auth)/signup.tsx` |
| S04 | `/` — Home | Functional | Last session, actual summaries, recent three sessions, empty/partial/unavailable states | `app/(app)/page.tsx` | `src/app/(app)/index.tsx` |
| S05 | `/gyms` — Gyms | Functional | Current Add gym sheet remains visible; list/detail/Start and empty/error states | `app/(app)/gyms/page.tsx` | `src/app/(app)/gyms.tsx` |
| S06 | `/gyms/[id]` — Gym detail | Functional | Active routes, grade/search/filter browser, Start, add/edit links and planned leaderboard | `app/(app)/gyms/[id]/page.tsx` | `src/app/(app)/gyms/[id].tsx` |
| S07 | `/gyms/[id]/routes/new` — Add gym route | Functional | Exact long form, 14-colour grid, main/multiple styles, preview and sticky Add route; parent gym | `app/(app)/gyms/[id]/routes/new/page.tsx` | `src/app/(app)/gyms/[id]/routes/new.tsx` |
| S08 | `/gyms/[id]/routes/[routeId]/edit` — Edit route | Functional | Exact form populated from active same-gym route, beta link, sticky Save; invalid/retired guards | `app/(app)/gyms/[id]/routes/[routeId]/edit/page.tsx` | `src/app/(app)/gyms/[id]/routes/[routeId]/edit.tsx` |
| S09 | `/sessions` — Session journal | Functional | Featured latest visit, live/completed actions, Sessions/Climbs switch; three-month increments | `app/(app)/sessions/page.tsx` | `src/app/(app)/sessions.tsx` |
| S10 | `/sessions/[id]` — Session detail | Functional | Live/completed layouts, route sheet, +1/Flash/Sent/Zone gating, correction, notes, end sheet | `app/(app)/sessions/[id]/page.tsx` | `src/app/(app)/sessions/[id].tsx` |
| S11 | `/sessions/[id]/routes/new` — Add session route | Functional | Same route form returns to session; adding does not log an attempt; completed-session guard | `app/(app)/sessions/[id]/routes/new/page.tsx` | `src/app/(app)/sessions/[id]/routes/new.tsx` |
| S12 | `/climbs` — Climbs collection | Functional | Best-result ordering; gym then grade drill-in, tries/visits and filters; no matches vs empty | `app/(app)/climbs/page.tsx` | `src/app/(app)/climbs.tsx` |
| S13 | `/routes/[id]` — Owner route history | Functional | Per-visit records, retired route, partial/duplicate warnings, private notes, from-context links | `app/(app)/routes/[id]/page.tsx` | `src/app/(app)/routes/[id].tsx` |
| S14 | `/profile` — Owner profile | Functional | Read-only account/grade, real summaries, visited gyms, planned links, journal and logout | `app/(app)/profile/page.tsx` | `src/app/(app)/profile.tsx` |
| S15 | `/explore` — Explore hub | Planned UI | Exact planned groups, wording and links; no real feed or social functions | `app/(app)/explore/page.tsx` | `src/app/(app)/explore.tsx` |
| S16 | `/explore/feed` — Climbers sessions | Planned UI | Exact UnderConstruction content and related links; no invented activity | `app/(app)/explore/feed/page.tsx` | `src/app/(app)/explore/feed.tsx` |
| S17 | `/explore/climbers` — Find climbers | Planned UI | Exact UnderConstruction copy, blockers and links; no search implementation | `app/(app)/explore/climbers/page.tsx` | `src/app/(app)/explore/climbers.tsx` |
| S18 | `/explore/leaderboards` — Leaderboards | Planned UI | Exact UnderConstruction copy; no scores or rankings implementation | `app/(app)/explore/leaderboards/page.tsx` | `src/app/(app)/explore/leaderboards.tsx` |
| S19 | `/explore/challenges` — Challenges | Planned UI | Exact UnderConstruction copy; no challenge feature implementation | `app/(app)/explore/challenges/page.tsx` | `src/app/(app)/explore/challenges.tsx` |
| S20 | `/explore/groups` — Groups and leagues | Planned UI | Exact UnderConstruction copy; no group feature implementation | `app/(app)/explore/groups/page.tsx` | `src/app/(app)/explore/groups.tsx` |
| S21 | `/profile/edit` — Edit profile | Planned UI | Exact planned display-name/bio/photo page; keep read-only capability boundary | `app/(app)/profile/edit/page.tsx` | `src/app/(app)/profile/edit.tsx` |
| S22 | `/profile/public` — Public profile | Planned UI | Exact private/planned preview wording; no public account data | `app/(app)/profile/public/page.tsx` | `src/app/(app)/profile/public.tsx` |
| S23 | `/profile/privacy` — Privacy | Planned UI | Exact planned privacy controls explanation; no new toggle behaviour | `app/(app)/profile/privacy/page.tsx` | `src/app/(app)/profile/privacy.tsx` |
| S24 | `/routes/[id]/beta` — Route beta | Planned UI | Load genuine route header, validate route ID, preserve planned media copy and back link | `app/(app)/routes/[id]/beta/page.tsx` | `src/app/(app)/routes/[id]/beta.tsx` |
| S25 | `/history` — Legacy history alias | Redirect | Replace to /sessions; no additional screen or history entry | `app/(app)/history/page.tsx` | `src/app/(app)/history.tsx` |
| S26 | `/brand-preview` — Brand preview | Development only | Preserve development reference; unavailable in production | `app/(auth)/brand-preview/page.tsx` | `src/app/(auth)/brand-preview.tsx` |
| S27 | `/loading-preview` — Loading preview | Development only | Preserve motifs/skeleton reference; unavailable in production | `app/(app)/loading-preview/page.tsx` | `src/app/(app)/loading-preview.tsx` |
| G01 | `unknown route / invalid resource` — Branded not found | Global state | Same 404 hold artwork, copy and Back to Bouldy; auth resolves / to Home or Welcome | `app/not-found.tsx` | `src/app/+not-found.tsx` |
| G02 | `authenticated route failure` — App error boundary | Global state | Exact page error and Reload page pending state; no new dialog or silent empty result | `app/(app)/error.tsx` | `src/features/errors/AppError.tsx` |

## Server Action parity

| ID | Current function | Preserve | Navigation/result |
| --- | --- | --- | --- |
| A01 | `loginAction` at `lib/actions.ts:32` | Email in OAuth username; retain errors; establish platform session | Home /; same auth screens on failure |
| A02 | `signupAction` at `lib/actions.ts:52` | Same fields, required checks, optional grade; register then login | Home /; same signup errors |
| A03 | `logoutAction` at `lib/actions.ts:80` | Clear platform credentials and account-scoped cached data | Welcome /welcome |
| A04 | `startSessionAction` at `lib/actions.ts:85` | Positive gym ID; current authenticated user; current UTC date; duration 0 | New session /sessions/:id |
| A05 | `addGymAction` at `lib/actions.ts:112` | Trim name/location; exact required copy; no admin-only redesign | Same sheet on error; close and show success on /gyms |
| A06 | `addRouteAction` at `lib/actions.ts:133` | Same grade/name/colour validation, deduplicated allowlisted styles, UTC set_date | Parent gym/session on success; same full-screen form on error |
| A07 | `editRouteAction` at `lib/actions.ts:184` | Validate route/gym; preserve same-gym check, fields, style filtering | Parent gym on success; edit form on error |
| A08 | `logAttemptAction` at `lib/actions.ts:220` | Re-read session/route/current logs; active/same gym, duplicates, stale IDs, flash/zone guards; preserve exact count rules | Replace sheet after success; anchor route; error reopens affected route sheet |
| A09 | `correctAttemptAction` at `lib/actions.ts:268` | Positive count, flash exactly 1 and lifetime checks, same session, duplicate/Zone restrictions; never increments | Same sheet on error; success closes and shows correction snackbar |
| A10 | `endSessionAction` at `lib/actions.ts:328` | Same duration rule: positive supplied value else 1; current UI default 60; no actual timer | Session journal on success; same end-session sheet on failure |
| A11 | `saveAttemptNoteAction` at `lib/actions.ts:346` | Same session/attempt verification; PATCH notes only, allow empty text; preserve draft on failure | Stay in context; close editor on success and show saved snackbar |

## Shared component parity

| Current module | Migration contract |
| --- | --- |
| `components/app-shell.tsx` | Port layout/layers/430px canvas; safe areas; overlay outside page transform. |
| `components/attempt-note.tsx` | Inline editor inside route sheet; standalone note sheet in history; failure preserves draft. |
| `components/auth-heading.tsx` | Same words, layout and holds for login/signup. |
| `components/bottom-nav.tsx` | Custom identical five-tab bar; never substitute system tabs; hide only on current form paths. |
| `components/bouldy-loader.tsx` | Port ascent/traverse/hold variants and reduced motion. |
| `components/brand-wordmark.tsx` | Same Bolt B SVG, Bouldy typography and compact variant. |
| `components/journal-switch.tsx` | Same Sessions/Climbs segment appearance and navigation. |
| `components/journal-warning.tsx` | Same incomplete-data wording, retry link and warning appearance. |
| `components/kokonutui/slide-text-button.tsx` | Preserve link wording and web hover/focus text slide; tap navigates without extra step. |
| `components/month-groups.tsx` | Same 3-month reveal step and sticky headings, not infinite scrolling. |
| `components/page-loader.tsx` | Same loading labels; 8-second patience label. |
| `components/page-motion.tsx` | Preserve measured directional translation/fade and deliberate tab swipe thresholds; disable duplicate navigator animation. |
| `components/page-skeleton.tsx` | All 9 geometry variants; 19 loading boundaries plus layout loading. |
| `components/result-badge.tsx` | Same labels/colours including legacy Zone. |
| `components/route-browser.tsx` | Extract portable filters/grouping without changing behaviour; replace ReactNode rows with same row renderers. |
| `components/route-form-screen.tsx` | Exact pushed header and form layout; no tabs, sticky save supplied by form. |
| `components/route-form.tsx` | Same field order, controlled preview, 14 colours, style expansion, selected values and planned comp block. |
| `components/route-hold.tsx` | Preserve 14 colour map, grey fallback, blue triangle name rule and local SVG paths. |
| `components/route-loading-overlay.tsx` | Replace click interception with navigation lifecycle; retain destination skeleton, layout and exit conditions. |
| `components/route-mark.tsx` | Dormant/isolated component; retain in catalogue, do not expose as new app feature. |
| `components/route-rows.tsx` | Gym/session/climb row variants; exact metadata, badges and trailing +1. |
| `components/submit-button.tsx` | Same per-button spinner, retained label space, disabled state and pending copy. |
| `components/theme-switcher.tsx` | Unmounted dev-only accent preview; preserve reference, do not ship theme selection as a new feature. |
| `components/ui/bottom-sheet.tsx` | Identical panel/backdrop/handle/close; URL/state adapter; Back closes before leaving; no added detents. |
| `components/ui/button.ts` | Replace Tailwind class utility with identical style tokens and variant/size contracts. |
| `components/ui/feedback-message.tsx` | Same inline errors/warnings and announcements; never convert errors to transient toast. |
| `components/ui/form-field.tsx` | Same Input/Select/Textarea labels, values, validation and closed appearance; keyboard/autofill adapters. |
| `components/ui/screen-header.tsx` | Same 56px header, back chevron and explicit parent destination. |
| `components/ui/section-heading.tsx` | Same type, spacing and optional aside. |
| `components/ui/snackbar.tsx` | Same top overlay, 5s lifetime, tap dismissal, 260ms entry/180ms exit; consume notice once. |
| `components/under-construction.tsx` | Same placeholder template, per-route copy, holds and related links. |

## Reference images

See `source-inventory.json` for each screen’s image links and the SHA-256 of every original capture. Existing images are local sample data at 390 × 844 with reduced motion, captured 24 October. They are references, not a newly verified or complete native golden set.

## State coverage still required

For each production screen record normal, empty, long-content, loading, API error and unauthenticated/expired states where applicable. Explicitly add not-found, duplicate logs, unavailable prior history, failed note save with draft retention, filter restoration, completed session, retired/reset routes, keyboard-visible forms, reduced motion and repeated navigation/Back. The archived walkthrough fixture does not implement every one of these cases.
