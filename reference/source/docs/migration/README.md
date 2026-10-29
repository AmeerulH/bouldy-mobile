# Bouldy migration planning package

Prepared 28 October 2026. This is a specification and reference package, not an implemented React Native app.

Start with [the full migration spec](../REACT_NATIVE_MIGRATION_SPEC.md), then [the parity register](PARITY_REGISTER.md) and [the agent handoff](IMPLEMENTATION_HANDOFF.md). The handoff includes Notion links and a copy-paste continuation prompt.

## Files

- `source-inventory.json`: source/config hashes, route/action/component mappings, 19 API-helper references and 44 screenshot hashes.
- `screen-parity.csv`: all 27 current page-route dispositions and two global UI states.
- `action-parity.csv`: all 11 existing Server Actions and the behaviours to preserve.
- `component-parity.csv`: all 31 current shared component modules, including dormant/development-only items.
- `PARITY_REGISTER.md`: the same coverage in a readable document.
- `openapi-2026-10-28.json`: read-only public API schema snapshot; it does not prove authenticated runtime behaviour.
- `reference-fixtures/sample-api.cjs.reference.txt`: inert archive of the local walkthrough fixture; see below.
- `NOTION_LINKS.json`: current plan, spec, register and tracking-page identities.
- `VERIFICATION.md`: what was checked while preparing the plan and what is still unverified.

Every migration row begins **Not started / Not verified**. Use these registers to record actual work later; do not infer completion from the existence of this package.

## Historical visual references

The 44 original captures are in `../visual-walkthrough/screenshots/`, at 390 × 844 with reduced motion, dated 24 October. They show sample data and are not production verification. Image paths and hashes are in `source-inventory.json`; the portable handoff archive includes them under `visual-walkthrough/screenshots/`.

The existing `../visual-walkthrough/bouldy-visual-walkthrough.html` can be opened as a standalone guide. Proposed-flow discussion in that guide does not change the migration's exact-copy scope.

## Archived fixture

The archived fixture is text, not a runnable project file. If authorised to reproduce a local source capture, copy it into a temporary `.cjs` test script and run it only as a loopback fixture. It binds to `127.0.0.1:4010`, uses obviously sample `.test` account data and provides normal/partial/empty/unavailable/note-error scenarios. Restart it to reset in-memory writes. Its sample token is not a real credential.

It does not emulate complete validation, ownership, concurrency, all response codes or every required edge scenario. Extend an isolated test harness during M0/M3; never treat the fixture as proof of backend security. Nothing in the fixture was run during this planning task.

## Portable package

`output/migration/bouldy-react-native-migration-handoff.zip` contains the spec, registers, handoff, API/fixture evidence, selected source documentation and all original screenshots. `PACKAGE_MANIFEST.json` records SHA-256 values for its entries. It is a handoff reference, **not** a full source/Git archive or a replacement for preserving the old repo.

No new repo, dependency installation, Expo scaffold, app implementation, production write, commit, push or deployment was performed.
