# Bouldy React Native migration

React Native + Expo SDK 58 / React Native 0.88 / React 19.3 / Expo Router 58, with React Native Web and a trusted application API adapter in this repository. All 24 source product screens, the history alias, both original development routes and all 11 commands now have local implementations. Full migration acceptance remains open; this has not been released as a replacement. Read [MIGRATION_PROGRESS.md](MIGRATION_PROGRESS.md) before continuing. Public repository: [AmeerulH/bouldy-mobile](https://github.com/AmeerulH/bouldy-mobile).

## Local fixture review

Use native arm64 Node 24.11.1 (the machine's login shell otherwise resolves an obsolete Node release). Confirm this directory's package.json exists before installing.

```sh
export PATH="/Users/Ambassador/.nvm/versions/node/v24.11.1/bin:$PATH"
npm ci --ignore-scripts
npm run fixture
```

In another terminal, from this directory:

```sh
BOULDY_LOCAL_API=http://127.0.0.1:4010 EXPO_PUBLIC_FIXTURE_PREVIEW=1 npm run web
```

Open `http://localhost:8081`. Fixture-only login: `climber@example.test` / `fixture-only`. These values are synthetic test data, not credentials for a real account. Protected previews show the source's `Sample journal · local preview` label. The fixture binds to loopback and never enters production bundles. Native devices need `EXPO_PUBLIC_ADAPTER_ORIGIN` set to the Mac's reachable development origin; phone loopback does not reach the Mac.

## Live iOS review in Device Hub

After accepting the Xcode licence and completing its first-launch/runtime setup, start the fixture above, then run from this repository:

```sh
export PATH="/Users/Ambassador/.nvm/versions/node/v24.11.1/bin:$PATH"
NODE_OPTIONS=--dns-result-order=ipv4first BOULDY_LOCAL_API=http://127.0.0.1:4010 EXPO_PUBLIC_FIXTURE_PREVIEW=1 EXPO_PUBLIC_ADAPTER_ORIGIN=http://127.0.0.1:8081 EXPO_NO_DEV_MENU=1 npm start -- --localhost --port 8081
```

Press `i` in that terminal after the simulator has booted. View the iPhone in Xcode's Device Hub. Keep Metro and the fixture running; edits update the development app through Fast Refresh. The same Metro process serves `http://localhost:8081/welcome` for the browser preview. Use the synthetic login above on either target. This is Expo Go development testing, not a standalone/release binary or a physical-device performance check. See the [official Expo simulator workflow](https://docs.expo.dev/workflow/ios-simulator/).

The `127.0.0.1` adapter address works for this Mac's iOS Simulator. It is not a physical-phone setup. Do not use real accounts in this fixture preview. First simulator boot/cache generation can be slow: during the 28 October continuation, `simctl` finished booting but Expo Go launch timed out while `update_dyld_sim_shared_cache` was still running. A separate network failure was traced to Metro listening on IPv6 `::1` while Expo Go used IPv4 `127.0.0.1`. The Node DNS flag above fixes that mismatch without exposing the preview to the LAN. Bouldy subsequently rendered in Device Hub. No simulator data was erased or runtime removed.

Implemented destinations cover auth, Home, Sessions/logging/history, Gyms and all Add/Edit route forms, Climbs, Profile, Explore and every original planned child/Beta page. Planned social/media/profile-edit features retain the source's planned status and copy. Global not-found/error states, nine source skeletons, navigation loading and a dev-only 20-group component catalogue are present. All parity acceptance rows remain open. See MIGRATION_PROGRESS.md for exact scoped observations and remaining gaps.

The current fixture 4010 includes enhanced fault scenarios and retains the Android-created sample records. `npm test` starts its own fixture on 4012. Verify listeners before reuse; preserve sample data before restarting and do not start duplicate processes.

## Live Android review and screenshots

[Open the Notion phone review: screenshots, page index and migration status](https://app.notion.com/p/40876faa3b39810983cdd8e80fb4d41a). All 195 PNGs in 59 galleries are uploaded; remote originals match local hashes. This link works independently of the local development server.

Android now runs in Expo Go 58.0.5 on the separate `Bouldy_Migration_API31` AVD. It is left signed in on Home. [195 screenshots / page and feature index](docs/screenshots/android/README.md) · [Searchable gallery](docs/screenshots/android/index.html). All 27 source routes are captured, including all 24 product pages and source planned states. Raw PNGs include vertical scroll sections and feature/error/empty states. Full parity acceptance remains open.

The old emulator 30.8.4 could not resize storage. An isolated official emulator 37.2.12 was downloaded and checksum-verified, and the migration AVD was cloned before use. Original SDK remains untouched. Use the same loopback Metro command above, then, only if this AVD is not already running:

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

Fresh browser control was blocked by a URL policy in this session; do not bypass it using another browser/automation surface. The earlier six-test E2E/capture evidence is historical and stale after subsequent changes. When an authorised testing path is available, E2E expects the local fixture and Expo web server above, runs serially and mutates only fixtures. Unit/adapter tests spawn their own loopback fixture on port 4012. Capture scripts need the frozen source copy running on port 3100, use matching synthetic records and preserve evidence in `docs/evidence`. See progress before rerunning expensive discovery/capture work. Do not build/export concurrently with live-source edits and browser QA; restart Metro after adding platform-specific modules if its SSR module graph becomes stale.

`npm run build` exports client files and trusted server routes; `npx expo serve dist --port 8083` hosts that output locally. A static folder or native binary cannot run the trusted commands alone. No deployment or hosting account exists from this work. The PWA manifest/icons, public-only service worker and generic offline fallback are implemented. Browser/installed-mode install/update/offline acceptance remains open. See [PWA_AND_RELEASE_RUNBOOK.md](docs/PWA_AND_RELEASE_RUNBOOK.md). No private caching, automatic mutation replay or offline queue is enabled.

## Boundaries

Web credentials stay in a 30-day-ceiling HTTP-only SameSite=Lax cookie (Secure in production). Native credentials use SecureStore and `/auth/me` validation. Client bundles import no trusted command implementation. Server transport is fixed to FastAPI; the loopback upstream override is development-only. Same-origin JSON commands replace Next's cookie-write protection. Resource 403 errors do not automatically clear authentication.

The preserved source, original Git-history bundle, pre-fix source/font/dependency references, file hashes and working-tree provenance are included in this repository under `reference/` and `docs/evidence`. Dependencies, build output, `.env` files, emulator binaries and AVD images remain ignored/local. The original repository remains intact. The user authorised the initial commit and push to a new public repository on 29 October 2026. Deployment, Bouldy production records, signing/account provisioning, source deletion/archive and release remain separately unauthorised.

Current publication checks: **75/75 tests**, lint/TypeScript and fresh web/server/iOS/Android JS/assets exports pass. The official compatibility check now recommends React Native 0.88.1 against installed 0.88.0; Expo Doctor is **19/20**, superseding the earlier 20/20 checkpoint. Eight npm aggregate findings were recorded at the preceding audit (5 low, 3 high). Fresh browser/installed-PWA, full post-fix iOS regression, complete three-platform visual/state/motion/account checks, standalone/release and physical-device verification remain open. Original source hashes and dirty Git status are unchanged. The user authorised this public repository publication; deployment and release remain unauthorised. Publication evidence: `docs/evidence/github-publication-*`; earlier results are historical.
