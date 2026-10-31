# Bouldy mobile app

React Native + Expo SDK 58 / React Native 0.88 / React 19.3 / Expo Router 58, with React Native Web and a trusted application API adapter in this repository. All 24 source product screens, the history alias, both original development routes and all 11 commands now have local implementations. Full migration acceptance remains open; this has not been released as a replacement. Read [MIGRATION_PROGRESS.md](MIGRATION_PROGRESS.md) before continuing. Public repository: [AmeerulH/bouldy-mobile](https://github.com/AmeerulH/bouldy-mobile).

## Approved native redesign — 31 October 2026

Active development is **this Expo repository**. `../bouldy-web` is deprecated and must not be edited. The owner approved the v35 design board at https://bouldy-design-review.elatedbread66.chatgpt.site. Native implementation and remaining validation are recorded in [the redesign handoff](docs/redesign/HANDOFF.md). Earlier one-for-one visual migration instructions are historical for this redesign; journal/auth/ownership safeguards remain binding.

The owner authorised publishing the approved redesign and current width/header fixes to GitHub main on 31 October. Native width is edge-to-edge; browser preview retains its phone canvas. Final lint/typecheck, 78 tests and web/native exports pass; the existing React Native patch mismatch and remaining device/PWA/release gates remain documented in the handoff. Source publication is not a site deployment or store release.

For Expo Go on your physical iPhone, use the same Wi-Fi, sign into the same Expo account in the CLI and Expo Go, then run `npm run start:phone` and scan the QR code. This uses the **real API**, advertises the Mac’s LAN address for the trusted adapter, and keeps Metro running. A standalone binary still requires a hosted HTTPS adapter and signing; no release is implied.

## Project context

Start with [PRODUCT.md](PRODUCT.md) for what Bouldy does, [DESIGN.md](DESIGN.md) for the existing design specifications, and [CODE_QUALITY.md](docs/CODE_QUALITY.md) for mobile/native/PWA engineering and acceptance expectations. [PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) links the Notion Kanban/Frontend/Backend boards, specs, screenshots and code map. Coding agents must follow [AGENTS.md](AGENTS.md).

Root product/design records describe this Expo repository; `docs/SOURCE_*` preserves the old web context. Full parity and release acceptance remain open even though the owner closed the migration implementation card.

## Live API review

Normal startup connects the trusted adapter to `https://bouldy-api.onrender.com`. Native requests go through this repository's adapter, which keeps the original FastAPI authentication and command validation. Use an existing backend account; login takes its email, not its display username.

Use native arm64 Node 24.11.1 (the machine's login shell otherwise resolves an obsolete Node release). Confirm this directory's package.json exists before installing.

```sh
export PATH="/Users/Ambassador/.nvm/versions/node/v24.11.1/bin:$PATH"
npm ci --ignore-scripts
npm run start:live
```

`npm start` and `npm run web` select the same live mode. Both commands explicitly clear stale fixture overrides and disable the sample label. Metro serves the adapter and browser preview at `http://localhost:8081/welcome`. The live app can change real backend records when you submit forms; current verification uses sign-in and reads only.

## Live iOS review in Device Hub

After accepting the Xcode licence and completing its first-launch/runtime setup, run the live command above. Press `i` in that terminal after the simulator has booted. View the iPhone in Xcode's Device Hub. Keep Metro running; edits update the development app through Fast Refresh. This is Expo Go development testing, not a standalone/release binary or a physical-device performance check. See the [official Expo simulator workflow](https://docs.expo.dev/workflow/ios-simulator/).

The startup script supplies `EXPO_PUBLIC_ADAPTER_ORIGIN=http://127.0.0.1:8081` and the IPv4 DNS setting required by this Mac's iOS Simulator. A physical phone needs a reachable adapter origin and an appropriate network/hosting setup. First simulator boot/cache generation can be slow; no simulator data or runtime was removed to resolve it.

## Isolated fixture review

Use this mode for tests that create or edit synthetic records. In one terminal run `npm run fixture`; in another run:

```sh
npm run start:fixture
```

Add `-- --web` to open the browser preview. Fixture-only login: `climber@example.test` / `fixture-only`. These values are synthetic test data, not credentials for a real account. Protected previews show `Sample journal · local preview`. This explicit mode selects loopback API port 4010; it never enters production bundles. Stop the existing Metro instance before switching modes and reload the app so its native configuration updates. Real credentials are not for this fixture mode.

Implemented destinations cover auth, Home, Sessions/logging/history, Gyms and all Add/Edit route forms, Climbs, Profile, Explore and every original planned child/Beta page. Planned social/media/profile-edit features retain the source's planned status and copy. Global not-found/error states, nine source skeletons, navigation loading and a dev-only 20-group component catalogue are present. All parity acceptance rows remain open. See MIGRATION_PROGRESS.md for exact scoped observations and remaining gaps.

The current fixture 4010 includes enhanced fault scenarios and retains the Android-created sample records. `npm test` starts its own fixture on 4012. Verify listeners before reuse; preserve sample data before restarting and do not start duplicate processes.

## Live Android review and screenshots

[Open the Notion phone review: screenshots, page index and migration status](https://app.notion.com/p/40876faa3b39810983cdd8e80fb4d41a). All 195 PNGs in 59 galleries are uploaded; remote originals match local hashes. This link works independently of the local development server.

Historical Android fixture testing used Expo Go 58.0.5 on the separate `Bouldy_Migration_API31` AVD. Android is currently stopped; the selected review device is the Device Hub iPhone. [195 screenshots / page and feature index](docs/screenshots/android/README.md) · [Searchable gallery](docs/screenshots/android/index.html). All 27 source routes are captured, including all 24 product pages and source planned states. Raw PNGs include vertical scroll sections and feature/error/empty states. Full parity acceptance remains open.

The old emulator 30.8.4 could not resize storage. An isolated official emulator 37.2.12 was downloaded and checksum-verified, and the migration AVD was cloned before use. Original SDK remains untouched. For Android fixture review, use `npm run start:fixture`, then, only if this AVD is not already running:

```sh
ANDROID_SDK_ROOT=/Users/Ambassador/Library/Android/sdk reference/toolchains/android-emulator-37.2.12/emulator/emulator -avd Bouldy_Migration_API31 -no-snapshot-load -no-snapshot-save -partition-size 4096 -no-audio -no-boot-anim
```

Once booted, connect the Android loopback forwarding and open the app:

```sh
/Users/Ambassador/Library/Android/sdk/platform-tools/adb -s emulator-5554 reverse tcp:8081 tcp:8081
/Users/Ambassador/Library/Android/sdk/platform-tools/adb -s emulator-5554 shell am start -a android.intent.action.VIEW -d exp://127.0.0.1:8081 host.exp.exponent
```

Use tabs for Home; an already-open app can retain its current nested path on a bare root deep link. The user authorised adb/UIAutomator native testing; source/backend production writes stay unauthorised. `tests/android/route-smoke.py` and `capture-pages.py` run against an already signed-in fixture preview and mutate no records. Always-animated catalogues require framebuffer captures because UIAutomator cannot idle; never use a stale XML dump. `python3 scripts/build-screenshot-gallery.py` rebuilds the gallery from the preserved capture manifests. These are development/runtime observations; no standalone APK/AAB or release iOS build was produced. Modern Android JDK/SDK and release setup remain open.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npx expo install --check
npx expo-doctor
npm run test:e2e
npm run build
npm run export:native -- --output-dir dist-native
```

Fresh browser control was blocked by a URL policy in this session; do not bypass it using another browser/automation surface. The earlier six-test E2E/capture evidence is historical and stale after subsequent changes. When an authorised testing path is available, E2E expects `npm run fixture` and `npm run start:fixture -- --web`, runs serially and mutates only fixtures. Unit/adapter tests spawn their own loopback fixture on port 4012. Capture scripts need the frozen source copy running on port 3100, use matching synthetic records and preserve evidence in `docs/evidence`. See progress before rerunning expensive discovery/capture work. Do not build/export concurrently with live-source edits and browser QA; restart Metro after adding platform-specific modules if its SSR module graph becomes stale.

`npm run build` exports client files and trusted server routes; `npx expo serve dist --port 8083` hosts that output locally. A static folder or native binary cannot run the trusted commands alone. No deployment or hosting account exists from this work. The PWA manifest/icons, public-only service worker and generic offline fallback are implemented. Browser/installed-mode install/update/offline acceptance remains open. See [PWA_AND_RELEASE_RUNBOOK.md](docs/PWA_AND_RELEASE_RUNBOOK.md). No private caching, automatic mutation replay or offline queue is enabled.

## Boundaries

Web credentials stay in a 30-day-ceiling HTTP-only SameSite=Lax cookie (Secure in production). Native credentials use SecureStore and `/auth/me` validation. Client bundles import no trusted command implementation. Server transport is fixed to FastAPI; the loopback upstream override is development-only. Same-origin JSON commands replace Next's cookie-write protection. Resource 403 errors do not automatically clear authentication.

The preserved source, original Git-history bundle, pre-fix source/font/dependency references, file hashes and working-tree provenance are included in this repository under `reference/` and `docs/evidence`. Dependencies, build output, `.env` files, emulator binaries and AVD images remain ignored/local. The original repository remains intact. The user authorised the initial commit and push to a new public repository on 29 October 2026. On 29 October the user also authorised the live-API follow-up push and requested production publication; the user clarified GitHub main only for now, with no site deployment. Bouldy production record changes, signing/account provisioning and source deletion/archive remain unauthorised.

Current publication checks: **75/75 tests**, lint/TypeScript and fresh web/server/iOS/Android JS/assets exports pass. The official compatibility check now recommends React Native 0.88.1 against installed 0.88.0; Expo Doctor is **19/20**, superseding the earlier 20/20 checkpoint. Eight npm aggregate findings were recorded at the preceding audit (5 low, 3 high). Fresh browser/installed-PWA, full post-fix iOS regression, complete three-platform visual/state/motion/account checks, standalone/release and physical-device verification remain open. Original source hashes and dirty Git status are unchanged. The user authorised the initial public repository publication and subsequent live-API push. The user clarified GitHub main only for now; no site deployment, old-site cutover or native store release has occurred. Publication evidence: `docs/evidence/github-publication-*`; earlier results are historical.
