# Migration planning verification

> **Historical baseline — current-state notice, 31 October 2026.** The app now exists and its approved v35 redesign is published. The original planning-only, exact-copy visual, five-tab and M0–M2-only instructions below are historical, not the current continuation task. Use [current progress](../../MIGRATION_PROGRESS.md) and [the redesign handoff](../redesign/HANDOFF.md); preserve unchanged journal/auth/privacy invariants and keep unverified acceptance gates open. Original baseline text is retained below for provenance.

Recorded 28 October 2026. This validates the source reference and planning artifacts; no migrated application exists yet.

## Current Next.js reference

- `npm run lint` — passed.
- `npx tsc --noEmit` — passed.
- `node --test tests/*.test.mjs` — all 10 existing tests passed.
- `npm run build -- --webpack` — passed using the bundled native Node runtime.

Existing warnings: Node reparses TypeScript modules because the package has no module type; Next reports a parent lockfile outside the repository. No dependency/configuration changes were made to remove these warnings. Webpack was selected explicitly; this does not verify the default Turbopack path.

## Audit scope

Source scan covers every current page route, component module, action export, API helper, library file, loading boundary and story file. The source snapshot and original image hashes are recorded in `source-inventory.json`.

The public FastAPI OpenAPI schema was fetched read-only and copied to `openapi-2026-10-28.json`. No accounts were created, no authenticated production request was made, and no production climbing data was written. Backend code/runtime ownership and atomicity were not re-audited.

Existing session and route-form reference images were inspected while writing the plan. This was not a fresh browser capture or a full screenshot review. The 44 source images are historical sample-data references. M0 must capture current goldens and fill missing states before implementation comparison.

## Planning artifact checks

The final preparation pass checks exact route/action/component/API-helper coverage, every source and screenshot hash, CSV/JSON counts, local document links, reference-fixture syntax, Markdown fence structure, package hashes and archive integrity. Notion publication stores full editable spec/register text plus downloadable reference files. Tool warnings or partial upload outcomes must be resolved before claiming the files are attached.

## Not verified / not implemented

New repo creation; Expo dependency installation; native/web app implementation; new golden generation; native auth/storage; application API adapter; device builds; parity tests; store compliance; store review; production cutover and rollback; old repo archival/deletion. All migration rows remain unstarted and unverified.
