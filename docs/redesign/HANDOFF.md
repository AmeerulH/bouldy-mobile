# Approved native redesign — 31 October 2026

## Target and authority

- Active checkout: `/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-mobile`, branch `codex/approved-native-redesign`. The owner authorised publishing this redesign and UI fixes to GitHub main on 31 October; see the publication checkpoint below. No deployment, signing or production record mutation.
- Owner explicitly deprecated `../bouldy-web`. Do not develop there. The earlier implementation in that repository was the wrong target; it is not native completion evidence.
- Approved visual source: sibling `/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-design-review/components/design-review`, v35, public review https://bouldy-design-review.elatedbread66.chatgpt.site. Refer to this source, not invented screenshots or the previous dark native design.
- Shared task board: https://app.notion.com/p/4b6c2168a8ab47289704a345a3ae239c. Original UX feedback: https://app.notion.com/p/ameerul/Bouldy-Mobile-UX-Issues-for-Agent-Review-c05210062b3c439aa31ee1343d39debe. No Notion card was changed in this implementation pass; do not infer an acceptance status from implementation.

## Implemented here

- Approved cream/limestone palette and supplied texture assets, Barlow/Geist fonts and hold artwork. Pill primary/secondary geometry,12-unit stacked task actions, circular back/help/add controls and full-width separators. Shared text leading corrected.
- Four tabs Home/Explore/Sessions/You; Gyms removed from main navigation. Home header is not sticky and has no duplicate profile icon.
- Welcome/Login/Signup with new copy/composition and fixed actions. Animation-only launch hold ascent2.2s/2.4s total, static600ms reduced-motion alternative.
- Home uses actual monthly completed visits, finishes, climbing duration, latest visit and active resume; first-use centred. Explore retains planned community/competition destinations. Profile focuses on account/disabled forthcoming settings plus adjacent logout.
- Sessions uses dated monthly rows, active session, Your climbs and Record past visit. New session setup chooses an existing gym, accepts validated past dates and offers Resume/Finish while another visit is active.
- Session workbench keeps header, search and grade chips outside its scrolling FlatList.20-record batches expand on end reach; FlatList bounds mounted rows. Whole row opens details, independent sibling controls log +1/Sent/eligible Flash, trailing chevron. Complete visits only show actual logged routes.
- Route sheet has private note and fixed Save note/Correct count or result actions. Nested correction sheet returns to original, preserving the draft through correction save. Both platforms keep header/handle/close outside body scroll.
- Native HH:MM finish selectors and fixed Finish and keep climbs action. Duration validated1–1440 server-side; picker currently reaches23:59. Back navigation can leave an active visit without forcing finish.
- Semantic top-floating success/error/info/warning snackbars, one active host per presentation,4s success/info and persistent dismissible errors/warnings. Inline actionable errors retained. No layout-space snackbar container.
- Navigation no longer paints a forced loading overlay. Cold skeletons remain. Owner-keyed process-memory snapshots retain successful content on refresh failures; identity lifecycle clears cache, late reads are epoch-guarded. No private persistent/offline cache or mutation replay. Background read at most1/min while focused/active, deferred during sheets, keyboard or web form editing.
- `BOULDY_ADMIN_USER_IDS` is a server-only explicit ID allowlist; default deny. Email grants no rights. Catalogue read routes and authoring commands are guarded at the trusted adapter; ordinary account UI redirects to Profile. Existing ownership, ambiguity, retired-history, flash eligibility and completed-session rules remain.
- `npm run start:phone` starts **live API** LAN preview and derives a reachable Mac address. Existing startup stays live by default. Fixtures remain explicit, development-only and isolated.

## Observed checks

- iPhone17Pro/iOS26.2 Expo Go: approved Welcome and Login rendered, captured in `evidence/ios-welcome.png` and `ios-login.png`. Native bundles compiled via Metro.
- Device Hub display connection timed out, including after non-erasing simulator restart. Native touch/keyboard/nested Modal/VoiceOver flows are NOT verified. Do not equate the browser checks below with native interaction acceptance.
- Shared Expo browser output: fetched Home; route detail→nested correction→close retained draft; correction count1→2 persisted and returned to original; note saved; +1 then Sent stored one try and send on the second route.90-minute finish persisted; completed visit showed2 logged routes/2finishes. Existing-gym selection started a further synthetic visit.
- Browser QA used the existing synthetic loopback fixture4010 only. It preserved earlier fixture data. Current sample visit100 ended at90min; route11 has2tries/send and a synthetic QA note; route12 has1try/send. A later empty visit was started at Sample Climbing Lab. No real account mutations.
- Browser found/fixed dropped link background styling, invalid nested buttons and whitespace text nodes. Reformatting an active context module caused a transient Fast Refresh context mismatch; full reload restored the provider. No claim that old development logs are a final release verdict.
- Export/quality gate outputs are saved under `evidence/`; read the final results below. Known baseline compatibility remains installed RN0.88.0 vs recommended0.88.1, Expo Doctor19/20. No dependency upgrade or suppression.

## Remaining acceptance and backend work

- Physical iPhone and Android QA; native gestures, keyboard avoidance, long content/text scaling, screen-reader focus and reduced-motion behavior. Full matched screen/state/motion parity is not accepted.
- Real API account read/write and two-account lifecycle QA were not repeated; user can test live through Expo Go. Backend access control for direct catalogue requests and atomic single-active-session uniqueness remain backend responsibilities. The sequential adapter check cannot prevent concurrent requests.
- API lists are still whole-list fetches; incremental rendering is not backend pagination. No reliable elapsed-session timer exists because the API has no start timestamp. No invented timing or social/profile-edit capabilities.
- Standalone device builds require signing and an authorised hosted HTTPS adapter origin. LAN/localhost Expo Go is development only. No TestFlight/store/release build.
- Legacy admin/history surfaces retain some prior composition with updated shared controls; no blanket pixel-for-pixel claim for every legacy route.

## Runtime and continuation

Use native arm64 Node24.11.1. On this host a known working runtime is `/Users/Ambassador/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin`.

Normal local simulator preview: `npm start -- --ios`. Physical iPhone: `npm run start:phone`, same Wi-Fi and Expo account, scan QR. These use the real API. Fixture mutation QA requires the explicit fixture startup. Do not run exports concurrently with Metro UI QA/source editing; stop the owned server, export, then restart.

Read AGENTS.md, PRODUCT.md, DESIGN.md and docs/CODE_QUALITY.md. Continue from this implementation; do not repeat the old migration scaffold or edit the deprecated Next.js app. Preserve unrelated work, keep pending acceptance gates open and update this handoff with observed evidence.

## Final verification results

- `npm run lint`: passed, no findings.
- `npm run typecheck`: passed, no diagnostics.
- `npm test`:78 passed,0 failed. Updated duration/tab assertions follow the newly approved contract; added active-session/read-failure, admin default-deny and invalid/future-date regressions.
- `npm run build -- --output-dir dist/review/web`: passed, client/server/middleware and3API routes exported.
- `npm run export:native -- --output-dir dist/review/native`: passed, iOS and Android Hermes bundles/assets exported. These are not signed binaries.
- Expo compatibility and Doctor: known RN0.88.0 vs0.88.1 recommendation; Doctor19/20. Not hidden or waived.
- Native bundle boundary scan: selected server-only admin/config/fixture credential markers absent from both bundles; `evidence/native-boundary.json`. This is a scoped scan, not a comprehensive security audit.
- Targeted review: admin authority comes from authenticated server-issued IDs; original exact-origin/HTTP-only/native SecureStore boundary retained. Snapshot cache is process-only, cleared on account lifecycle, with generation/epoch guards for late reads. Backend atomicity/direct-endpoint authorization remain open as above.
- `git diff --check` and sidecar JSON parse passed. No product dependency was added. Prettier was used as an ephemeral formatting tool.

The final preview is running in live API LAN mode through `npm run start:phone`, owned terminal session82704, Metro port8081. Status endpoint reports running; iOS bundled2051 modules and the Expo Go URL was reopened. Inspect its listener before running a second server. Automated writes used fixtures only. The existing fixture4010 was preserved and does not affect live-mode configuration.

## Physical iPhone width correction — 31 October 2026

The owner observed white side strips in Expo Go and confirmed their removal after this change. `src/app/_layout.tsx` now shares a cream-backed frame between loading/loaded states, applies the 430-unit cap only to web and colours the outer safe-area provider. `src/components/sheet.tsx` no longer caps native sheets to the browser width. Web layout and web sheets retain the phone-canvas cap. Inner content gutters are intentional and unchanged.

Root render/constraint verification reproduces 5-unit side gaps at native width440 before the fix and zero afterward. Native loading/loaded frames fill all checked widths; browser widths remain capped. Fresh lint/typecheck and78/78 tests pass; Metro compiles/serves iOS successfully; the targeted Impeccable layout scan has no findings. This scoped physical-iPhone confirmation does not close the remaining native interaction/release gates. Device Hub display remains timed out. Changes are local/uncommitted; prior uncommitted redesign work is preserved. See `evidence/native-width-fix.json`.

## Publication checkpoint — 31 October 2026

The owner asked to push the current approved redesign and UI fixes, then continue UI work later. This publication includes the physical-iPhone width fix and the shared planned-subpage header correction: 12-unit eyebrow/badge and vertical title gaps, with the shared heading leading instead of the legacy32.4 override. The header's new iOS bundle compiles; its fresh physical-device visual check remains unverified.

Final publication validation: lint/typecheck,78/78 tests, web/server/middleware export and both native Hermes/assets exports pass. Compatibility retains RN0.88.0 vs0.88.1 and Doctor19/20. A selected ASCII-marker scan of40 exported client/native files found no server-only admin/fixture markers. Read `evidence/publication-checks.json`, `publication-boundary.json` and their matching logs for scope; no broad security, device parity or release claim follows. Export directories are ignored under `dist/redesign-publication-20261031/`.

GitHub main is the authorised publication target. Check Git for the exact resulting commit/ref rather than inferring deployment. The old source remains untouched; no real records, signing, hosting or store release changed. Metro was paused for export checks and is restarted in live-API LAN mode afterward. Use listeners/process state rather than old terminal session numbers on continuation.
