# Bouldy web/PWA and native release handoff

Implementation is local. This runbook grants no permission to deploy, provision accounts/signing, submit binaries, replace the existing web deployment or change production records.

## Build and local review

Use Node 24.11.1. `npm run build` generates the allowlisted PWA worker then exports the shared screens and trusted server adapter. `npx expo serve <export-directory> --port 8083` hosts a local production-mode export. HTTPS or localhost is required for service-worker registration. Development/fixture previews never register a worker.

The manifest preserves `/` as launch URL and scope, standalone display, portrait orientation and the source Bolt B artwork. PNGs are deterministic raster derivatives of the preserved `assets/source/icon.svg`, on the source light background; maskable artwork is inset inside its safe zone. No new logo was created.

## Install

- iOS Safari: open the intended HTTPS app, use Share, then Add to Home Screen and Open as Web App where offered. Launch the installed icon separately from the browser tab.
- Android Chrome: open the intended HTTPS app and use its Install app/Add to Home screen menu.
- Desktop supported browsers: use the address-bar install control or browser app installation menu.

No new installation banner appears in the product. Browser support/wording varies; test actual supported browser versions before release.

## Cache and update policy

The worker caches only `/offline.html` and the three explicit public icon PNGs. It never caches authenticated HTML, JavaScript bundles, API reads, commands, cookies, private notes or journal data. Navigation is network-first with the generic offline document only on network failure. Commands remain online-only; failed writes are never queued or replayed.

`prepare-pwa.cjs` hashes the public fallback assets into the cache version. Worker changes install normally, without `skipWaiting`, `clients.claim`, update banners or automatic reload. Users close all app/browser windows before a waiting worker activates. This protects open drafts; it does not promise draft durability after an intentional close or process termination.

Before acceptance, exercise real browser and installed modes: fresh install, cold launch, deep links, sign in, logout, account change, network loss while reading/writing, failed note draft retention, offline restart, waiting-worker update while a form is dirty, all-window close/activation and reconnection. VM worker tests prove policy, not browser installation behavior.

## Cookie and data continuity

Web uses `bouldy_token`, Path=/, HttpOnly, SameSite=Lax and the existing 30-day ceiling; Secure in production. Reuse depends on the intended origin/domain, HTTPS/proxy configuration, matching backend token validity and preserved cookie scope. A different origin generally requires sign-in again. Native uses SecureStore. No password, token import, account duplication, record migration, refresh endpoint or offline write queue is added. Validate shared IDs/notes using approved isolated backend test accounts before any cutover.

## Native prerequisites and acceptance

Bundle/asset exports are not app binaries. A local development binary needs the iOS/Android toolchain and reachable adapter URL. A physical device cannot reach the Mac through 127.0.0.1. Do not expose the adapter publicly or provision signing/accounts without authorisation. Standalone/release builds, physical iOS/Android checks and performance review remain required. Shipping apps must use an authorised HTTPS adapter and the existing backend; never the synthetic fixture. Resolve current advisory and compatibility checks before release.

## Authorised cutover and rollback, later

Keep the old web deployment and repository as rollback targets. Record the approved host/domain, signing identities, backend/test accounts, cookie continuity result and observation period. Deploy only after explicit authorisation and all parity gates. Verify intended URLs/queries/cookies and no double-created records or replayed writes after cutover.

If rollback is required, first preserve the current export and diagnostics. Serve the previous frontend. To remove this worker safely on the same origin, deploy a deliberate replacement `/sw.js` that unregisters itself and deletes only `bouldy-public-*` caches after controlled activation; do not clear unrelated origin storage, accounts or user drafts. Test this procedure on an isolated staging origin before a production incident. No rollback, worker removal or source retirement has been performed.
