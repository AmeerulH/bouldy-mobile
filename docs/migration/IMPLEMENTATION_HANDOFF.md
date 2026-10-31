# Bouldy migration — agent handoff

> **Historical baseline — current-state notice, 31 October 2026.** The app now exists and its approved v35 redesign is published. The original planning-only, exact-copy visual, five-tab and M0–M2-only instructions below are historical, not the current continuation task. Use [the current handoff](../redesign/HANDOFF.md) and [continuation prompt](../redesign/CONTINUE_PROMPT.md); preserve unchanged journal/auth/privacy invariants and keep unverified acceptance gates open. Original baseline text is retained below for provenance.

Prepared 28 October 2026. **Planning complete; implementation has not started.**

## Open the plan

- [Native migration plan](https://app.notion.com/p/40776faa3b39816289e3c6985884558e?pvs=204)
- [Full migration specification](https://app.notion.com/p/40776faa3b3981a9b8b4f75df22781cd?pvs=204)
- [Screen, action and component parity register](https://app.notion.com/p/40776faa3b3981729c3bd0a37ef2b7a3?pvs=204)
- [Notion agent handoff](https://app.notion.com/p/40776faa3b3981c09fadd67d4f57e945?pvs=204)
- [Existing tracking card BLY-077](https://app.notion.com/p/40676faa3b398127a698d570e7631e24?pvs=204)

Canonical local spec: `docs/REACT_NATIVE_MIGRATION_SPEC.md`. The full text, a downloadable `.md` and a portable reference package are published in Notion. Local plan files are uncommitted.

## Current state

Source repository: `/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-web`.

Inspected HEAD: `5467a433ea6699c1206b6e9019430fccff693918`. Use the working-tree hashes in `source-inventory.json`; HEAD alone does not preserve local work or untracked reference artifacts.

Proposed new sibling repository: `/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-mobile`. It has **not** been created. No remote, Expo project, bundle ID, signing account, native build or new deployment was provisioned. No migration screen, command or backend change has been implemented. All parity rows are Not started / Not verified.

Audit coverage: 27 page routes (14 functional, 10 planned, one alias, two development previews), two global states, 19 loading boundaries, 31 component modules, 20 story files, 11 Server Actions, 19 API helpers and 10 existing unit tests. Forty-four historical reference screenshots and their hashes are included in the portable package.

The public API contract was fetched read-only on 28 October and is saved as `openapi-2026-10-28.json`. Backend source and authenticated production writes were not audited. The archived sample API is inert text and only provides a partial local fixture, not a security emulator.

## Instructions that must survive handoff

1. Build native iOS/Android with React Native + Expo, plus the replacement web/PWA output from the same new app repo. This supersedes the earlier PWA-first recommendation.
2. Make an exact copy of the existing app-controlled UI and flows. No redesign, renamed copy, changed order, new native theme, simplified journey or product wishlist implementation.
3. Preserve the source phone canvas, fonts, colours, hold artwork, custom five-tab bar, motion, sheets, forms, pending/errors/success placement and link behaviour.
4. Preserve all domain invariants and current placeholder screens. Keep Add gym and other currently visible actions; do not implement future photos, social, onboarding, admin rules or offline writes as part of migration.
5. Follow the proposed trusted API-adapter design or prove an equally safe replacement. Current Server Action guards must not disappear into client-only validation. Keep the existing FastAPI backend, record IDs and private data ownership.
6. Keep browser cookies separate from native credential storage. Do not invent refresh endpoints, use an open forwarding proxy, cache private responses in a worker, or enable automatic mutation replay.
7. Source captures are historical sample data, not current production verification or complete native goldens. M0 must refresh/freeze the reference and cover missing states.
8. Work locally and keep changes uncommitted/unpushed until the user changes that boundary. Preserve unrelated edits; never reset the old repo or overwrite an existing target checkout.
9. Keep the old repository and deployment until parity, replacement, observation and rollback gates pass. No deletion, remote archival, store submission or production cutover is authorised by this handoff alone.
10. Separate parity acceptance from store compliance changes. Report any required new UI, including account deletion, as an exception for review.

## Resume order when implementation is requested

- Read `AGENTS.md`, `README.md`, `MASTER_SPEC.md`, frontend/backend specs, `DESIGN.md`, the migration spec and `PARITY_REGISTER.md`.
- Compare all source hashes. Explain any changes before redefining the baseline. Preserve the pre-existing dirty/untracked state.
- Complete M0 reference freeze and missing state fixtures, then create the separate target repo in M1.
- Prove M2: identical shell, login, a route sheet, +1/Send, saved history and a failed-save state on iPhone, Android and web. Validate auth, deployed adapter assumptions, fonts/SVG, Back and process restart.
- Re-estimate M3–M7 after M2. Port domain/commands, shared UI, all screens, browser/PWA compatibility, then verify and prepare replacement.
- Update parity evidence and status as actual work completes. A generated plan, a scaffold or screenshots alone never mark the migration complete.

## Copy-paste continuation prompt

Use this only when asking the next agent to begin implementation:

```text
Continue Bouldy's planned 1:1 React Native migration. Read the complete spec at
docs/REACT_NATIVE_MIGRATION_SPEC.md and docs/migration/PARITY_REGISTER.md in
/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-web, or their linked Notion
copies in docs/migration/IMPLEMENTATION_HANDOFF.md.

The target is a separate React Native + Expo app repository, proposed as the
sibling bouldy-mobile, with iOS/Android primary and replacement web/PWA output
from that same repo. No target repo or migration code exists yet.

Preserve every current screen, app-controlled visual detail, copy, flow, sheet,
form, motion and business rule. Keep planned screens planned and do not mix in
the brainstorm backlog. The source working tree is the reference, not only HEAD
and not the public deployment. First compare source-inventory.json hashes and
preserve all unrelated/dirty/untracked work.

Begin with M0 and M1, then prove the exact M2 native/web slice before expanding.
Retain trusted server-side command checks through the new application adapter
or an equivalently verified backend boundary. Keep FastAPI and existing data;
do not invent contracts, replace the database or queue offline writes.

Work locally. Do not commit, push, deploy, submit to stores, alter production
records or delete/archive the current repo without further instruction. Record
actual evidence in the parity register and report blockers and any unavoidable
UI difference before treating it as accepted.
```

## Validation recorded for the source

On 28 October, the current Next.js reference passed lint, TypeScript, all 10 existing unit tests and a webpack production build. Existing Node module-type and parent-lockfile warnings remain. These checks validate the old reference only. No new native or Expo web implementation exists to validate.

The portable package contains planning/reference files and the original screenshot set, not a full Git backup or the complete app source. Keep the source repository available and copy required provenance before eventual retirement.
