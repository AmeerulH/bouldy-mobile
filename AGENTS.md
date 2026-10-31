# Bouldy native and PWA application

## Start here

Read the latest section of [MIGRATION_PROGRESS.md](MIGRATION_PROGRESS.md), then [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md) and [docs/CODE_QUALITY.md](docs/CODE_QUALITY.md) as relevant to the task. [docs/PROJECT_GUIDE.md](docs/PROJECT_GUIDE.md) maps the source tree, verified Notion Kanban views and documentation. Do not repeat completed discovery or reread duplicate full specifications without a discrepancy to resolve.

Current product/visual authority is the owner-approved v35 redesign in root PRODUCT/DESIGN and [docs/redesign/HANDOFF.md](docs/redesign/HANDOFF.md). [docs/REACT_NATIVE_MIGRATION_SPEC.md](docs/REACT_NATIVE_MIGRATION_SPEC.md) retains the original migration baseline; its exact-copy visual/five-tab/start-from-zero instructions are historical and superseded. Preserve its data/authentication/privacy invariants unless explicitly changed. Local files are authoritative when available; Notion supplies fallback/shared coordination. Report conflicts explicitly. `docs/SOURCE_*` and `reference/source/` are preserved historical records, not current setup instructions.

## Product and design contract

Bouldy is a personal climbing journal: gym → session → route → attempt/result/private note → history. Build for iOS and Android with shared Expo web/PWA output. The owner approved the v35 mobile redesign on 31 October 2026. Implement it here in native Expo components, preserving fonts, brand artwork, counting, validation and uncertainty. Native screens/sheets fill the device width; only web keeps the centred 430-unit phone canvas. `../bouldy-web` is deprecated and must not be edited. The approved design board in `../bouldy-design-review` is the visual reference. Use current shared components; no stock native/template restyling or new backlog features.

When invoking Impeccable, load its context once per session and use root PRODUCT/DESIGN plus `.impeccable/design.json`. Preserve the brand while applying the approved cream limestone v35 design. The explicit migration brief overrides generic suggestions for system fonts, dark themes, Material/Cupertino reskins or expanded desktop/tablet layouts. Read the relevant playbook and craft floor before UI edits; do bounded visual verification and run the requested detector only on changed UI. Documentation work derives from actual code and evidence, not invented design choices. Single agent only unless the user explicitly changes that instruction.

## Engineering requirements

Follow [docs/CODE_QUALITY.md](docs/CODE_QUALITY.md). Keep strict types, clear state models, focused readable functions, shared primitives and explicit platform boundaries. Reuse existing helpers. Do not add speculative abstractions, duplicate feature logic, broad refactors or dependencies without a demonstrated need.

Client/native code must never import `src/server` at runtime. Only `+api.ts` endpoints cross that boundary. Preserve server-side validation/ownership and command-origin protection. Web credentials remain HTTP-only; native credentials use SecureStore. Never log or document passwords/tokens. Preserve account lifecycle guards, partial/ambiguous reads, current/prior session counts and failed drafts. No mutation queues or automatic write retries.

Normal `npm start`, `start:live` and `web` use the real API through the trusted adapter. Use `npm run fixture` plus `npm run start:fixture` for synthetic testing. Automated/exploratory record writes must use isolated fixtures unless the user specifically authorises the environment and records. A simulator loopback adapter origin is not a production/physical-phone configuration.

Verify safe areas, keyboard access, text scaling, focus, screen-reader state, Back/dismissal, touch geometry and reduced motion on affected platforms. Record any conflict with exact visual parity; do not silently redesign or certify accessibility. PWA caching remains public-fallback-only: no authenticated responses, private journal cache, forced draft-losing reload or write replay.

## Verification and reporting

Use arm64 Node 24.11.1 explicitly. Verify this directory's package.json before installing. Implementation checkpoints require lint, typecheck, meaningful domain/command tests, Expo compatibility/Doctor, web/server export and iOS/Android export as affected. Observe matching native/browser renders for UI changes. Docs-only changes need link, metadata, token/source and diff checks; do not rerun builds or write implementation-mirroring tests without a runtime change.

Do not export concurrently with active native/browser QA or source edits. Do not bypass a browser-control policy block with another automation surface. Record unavailable toolchains/devices honestly. Existing test results are dated evidence; the 78-test/export checkpoint at 488ab9b predates the later launch/error/skeleton/profile refinements. Do not claim those newer changes passed the older suite/build. An exported bundle is not a full-platform or release verdict. Do not suppress the known React Native compatibility mismatch or dependency advisories.

All original routes have local implementations. M2/M6 and every unaccepted cross-platform parity row remain OPEN. Start with the current redesign handoff and commit-specific `docs/redesign/evidence/publication-*` evidence. `live-api-*`, `android-final-*`, the 195-image gallery and `remaining-*` are historical evidence for earlier interfaces. Update progress and affected registers with what was actually observed. Keep unverified acceptance rows open.

## Task board and release boundaries

Use the existing [Bouldy — Task Board](https://app.notion.com/p/4b6c2168a8ab47289704a345a3ae239c), with Kanban/Frontend/Backend views linked in the project guide. Preserve Task IDs, dependencies, acceptance criteria, scope and existing evidence; do not duplicate cards or invent owners/dates. Read a card before updating it. Status Done does not itself approve production release.

BLY-077 is Done by owner request, with unchecked acceptance gates retained. BLY-035 installed-PWA verification remains open. Re-check live properties before reporting a later status.

The user authorised the initial public repository publication and the live-API follow-up, then clarified GitHub main only for now. Do not infer deployment, production record changes, signing/account provisioning, old-site cutover or source retirement from those pushes. Commit/push only within the user's authorised scope. Do not reset or edit the old `../bouldy-web` repository; preserve uncommitted work, source/history backups and rollback evidence. No deletion or archive operation is authorised. Toolchains, caches, dependencies and generated exports stay local/ignored.

31 October publication: the user explicitly authorised committing/pushing the approved native redesign and latest width/header fixes to GitHub main. This supersedes the redesign handoff's initial local-only restriction for this checkpoint, not future deployments, production record writes, signing or source retirement. Further UI work is deferred until requested.
