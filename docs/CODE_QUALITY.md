# Bouldy mobile and PWA code quality

These requirements govern future changes to the React Native/Expo app and shared web/PWA. They are a review contract, not a claim that the existing migration has passed every check. Read [PRODUCT.md](../PRODUCT.md), [DESIGN.md](../DESIGN.md), the [migration spec](REACT_NATIVE_MIGRATION_SPEC.md) and current [progress](../MIGRATION_PROGRESS.md) before changing behaviour. Follow the task's authorised scope; keep unrelated refactors separate.

## Correctness and maintainability

- Keep TypeScript strict. Use typed domain models and explicit loading/success/partial/error states. Narrow unknown external input at the responsible boundary; avoid new `any`, unchecked casts, non-null assertions or suppression comments without a specific justification.
- Keep route compositions, reusable UI, pure climbing rules, platform capabilities and trusted commands in their existing layers. Shared primitives should not fetch page-specific data. Do not import `src/server` into client/native runtime code; only API entrypoints cross into it.
- Reuse existing helpers and primitives. Prefer one clear implementation over copied JSX, speculative abstraction or a new dependency. Avoid dense one-line control flow in new work; keep functions/components focused and readable. Do not reformat the entire migration to enforce this.
- Treat effects, subscriptions, animation timers, listeners and asynchronous requests as owned resources. Clean them up; prevent stale responses or previous-account state from updating the current screen. Keep pure derivations out of effects where possible.
- Validate identifiers, enum values, counts and command payloads at the trusted boundary. Resource ownership and domain checks must remain server-side even when the UI also validates. Do not mask backend errors with invented successful data.
- Preserve current/prior-visit separation, route IDs, retirement history, duplicate uncertainty, flash eligibility, note-clear semantics and completed-session locking. A correction must not append a try. Use regression cases for these invariants.

## Authentication, privacy and network behaviour

Keep browser credentials in HTTP-only SameSite cookies with Secure in production; keep native credentials in SecureStore. Do not expose tokens to browser JavaScript, AsyncStorage, URLs, screenshots, logs or docs. Validate identity on restoration and foreground return; clear invalid identity without treating a resource-level 403 as automatic logout. Prevent previous-account data/drafts/filter state from leaking to another account.

The trusted adapter retains same-origin command protection, bounded request parsing, native credential handling and upstream error distinctions. Production native builds need an authorised HTTPS adapter origin. Do not deploy a binary with simulator loopback or fixture configuration. Expo documents the server requirement for [API routes](https://docs.expo.dev/router/web/api-routes/).

Read failures must remain distinguishable from empty data. Prevent double submissions while pending; keep recoverable drafts on failure and offer an explicit retry. Do not automatically retry/replay mutations or add a queue. Test writes against isolated fixtures; live API checks default to sign-in and authorised reads. Do not register new real accounts or modify existing climbing records without specific authorisation.

## Native interaction and accessibility

Check safe areas, status/navigation bars, keyboard/IME avoidance, small displays, larger text, focus order and usable scrolling. Verify screen-reader labels, roles, selected/expanded/busy states, modal focus ownership, dismissal and actionable error announcements on VoiceOver and TalkBack. React Native's [accessibility guidance](https://reactnative.dev/docs/accessibility) describes the platform-specific APIs; testing one platform does not certify the other.

Preserve the approved touch geometry while recording conflicts. Aim for [iOS 44-point](https://developer.apple.com/design/tips/) and [Android 48-dp](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views) touch regions, using non-overlapping hit areas where appropriate; do not silently enlarge the visible design or declare existing 44-unit Android controls compliant. Test Back, modal cancellation and foreground/restart behaviour. Do not replace the branded UI with platform-default typography, colours or navigation as a shortcut.

For web/PWA, use [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/) as the review target: readable contrast, meaningful names/states, keyboard operation, visible and unobscured focus, zoom/reflow, and errors associated with their fields. Test actual colour pairs; a token name does not prove contrast. WCAG's [24 CSS-pixel target-size criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum/) has exceptions and is distinct from comfortable mobile touch sizing. Do not use colour alone to communicate a route result or error.

Respect reduced-motion settings without removing essential state feedback. Preserve access to controls when animation is disabled. Record any conflict between accessibility, native expectations and exact source parity in the affected register/card for an explicit product decision. No new dark theme or tablet redesign is implied by this quality guide.

## PWA lifecycle and caching

Keep install metadata, icons, scope, launch URL and public assets correct. Test browser and installed modes independently on supported iOS/Android browsers. Verify deep-link cold launch, login/logout/account change, offline navigation/restart, failed-save draft retention and reconnection.

The worker may cache only its explicit public fallback assets. Never cache authenticated HTML, API responses, commands, tokens, private notes or journal data. Do not add write replay, private offline storage, automatic worker activation or forced reload of dirty forms. Exercise a waiting update with an open form and all-window close/activation. Check cache boundaries with both automated policy tests and a real installed app; a worker unit test alone is insufficient. Follow the [PWA/release runbook](PWA_AND_RELEASE_RUNBOOK.md).

## Performance and dependencies

Profile the affected path before optimising. Keep logging responsive during scroll and network latency; measure JS/UI-thread stalls, screen loading, large-list rendering and image/font cost. Use UI-thread gestures/animation where the implementation requires them; avoid per-frame React state updates. Bound or paginate growing work where the API supports it, and avoid repeated whole-journal reads when a stable shared result suffices. Optimise without changing counting or uncertainty semantics.

Measure on representative hardware and a production/release build before claiming performance acceptance. Expo Go and simulator behaviour are useful development evidence. React Native's [performance guidance](https://reactnative.dev/docs/performance) explains the limits of development-mode measurements. Do not promise a frame rate or startup budget without a measured baseline.

Use the pinned arm64 Node runtime and lockfile. Review the need, licence, bundle/native impact and maintenance of new dependencies. Upgrade individually or in a small related group with release notes, lockfile review and targeted regression checks. Do not force-upgrade, suppress compatibility checks or run broad automated fixes to hide findings. Security tools may inspect dependencies without exposing secrets; record unresolved advisories and the evidence's limits.

## Verification by change type

| Change | Required evidence |
| --- | --- |
| Docs/context only | Valid local links, parsed JSON/YAML, source/token consistency, accurate dated status and clean diff. No new runtime success claim. |
| Domain or trusted API logic | Lint, typecheck, relevant regression/adapter tests, adverse inputs, auth/ownership/partial/failure paths; demonstrate that the old behaviour fails the regression when practical. |
| Shared UI, navigation, credentials or lifecycle | Relevant automated checks plus observed iOS, Android and web states; safe area, keyboard, focus, Back, restart and reduced motion as affected. Compare matching source/state references. |
| Dependency/config/build output | Compatibility/Doctor, lint/typecheck/tests and web/server/iOS/Android exports as affected; review bundle boundaries and runtime behaviour. |
| Production/release candidate | Complete acceptance matrix, real browser/installed-PWA tests, authorised account checks, standalone/release builds, physical-device/performance evidence, approved adapter origin and rollback plan. |

For an implementation checkpoint, run the existing commands from the repository with native Node 24.11.1:

```sh
npm run lint
npm run typecheck
npm test
npx expo install --check
npx expo-doctor
npm run build -- --output-dir dist/review/web
npm run export:native -- --output-dir dist/review/native
```

Use meaningful behaviour tests, not tests that merely repeat the implementation or an arbitrary coverage percentage. The [React Native testing overview](https://reactnative.dev/docs/testing-overview) distinguishes static, component and end-to-end confidence. Browser E2E uses the explicit fixture server and fixture preview described in README; never point a mutation harness at the real API. Do not bypass a browser-control policy block with another automation surface. Do not export concurrently with active native/browser QA or source edits.

The prior live-API checkpoint records 75 tests, lint/typecheck and web/native exports passing. Expo Doctor is 19/20 because React Native 0.88.0 differs from the recommended 0.88.1. Dependency advisories and full platform/PWA/release checks remain open. These are dated findings in current progress, not permanent exemptions or results for a new change.

## Review and completion

Review correctness, readability, architecture, privacy/security and performance; report material defects ahead of style preferences. Check that tests cover the failure that motivated the change. Use the relevant engineering/security skills when their scope applies; respect the current single-agent instruction. Do not add tests for a reversible documentation-only change.

Before calling work complete:

- Match the requested behaviour and preserved design; explain any approved deviation.
- Record exactly what ran, what passed/failed, platform, environment and evidence paths.
- Keep unavailable, stale, partial and untested checks explicit; do not equate exported JS with an app binary.
- Update progress, affected parity rows and the existing task card without accepting unverified gates.
- Keep credentials and unrelated work out of the diff; preserve the old repo and rollback evidence.
- Treat commit/push, deployment, production records, signing and source retirement as separate scopes. The latest publication choice is GitHub main only.

A product-owner Done status can close implementation while acceptance remains open. That distinction must remain visible in the task and handoff; a green test suite is not a complete release verdict.
