# Bouldy — implementation starter prompt

> **Historical baseline — current-state notice, 31 October 2026.** The app now exists and its approved v35 redesign is published. The original planning-only, exact-copy visual, five-tab and M0–M2-only instructions below are historical, not the current continuation task. Use [the current continuation prompt](../redesign/CONTINUE_PROMPT.md); preserve unchanged journal/auth/privacy invariants and keep unverified acceptance gates open. Original baseline text is retained below for provenance.

Paste the text below into a new local Codex chat with access to the source checkout. Model/effort is selected in the app; this prompt does not change that setting. The first run deliberately targets M0–M2 so the foundation can be reviewed before the bulk screen migration.

```text
Begin implementing Bouldy's specified 1:1 React Native migration. The planning
is complete; proceed with implementation rather than writing another plan.

Source repository:
/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-web

Proposed separate target repository:
/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-mobile

FIRST READ
Read source AGENTS.md, then:
- docs/REACT_NATIVE_MIGRATION_SPEC.md — complete migration contract and M0–M7.
- docs/migration/IMPLEMENTATION_HANDOFF.md — state, boundaries and source links.
- docs/migration/PARITY_REGISTER.md — every screen, command and component.
- docs/migration/source-inventory.json — source hashes and reference mappings.
Follow their required source-document reading order. Read each once, then read
relevant source files as needed rather than repeatedly dumping whole documents.

If local documents are unavailable, use the full Notion spec and its attached
Markdown/reference package:
https://app.notion.com/p/40776faa3b3981a9b8b4f75df22781cd
Plan: https://app.notion.com/p/40776faa3b39816289e3c6985884558e
Register: https://app.notion.com/p/40776faa3b3981729c3bd0a37ef2b7a3
Handoff: https://app.notion.com/p/40776faa3b3981c09fadd67d4f57e945
These are fallback copies, not an instruction to reread both local and remote
versions. If app source is missing, obtain source access before claiming parity;
the reference ZIP is not a complete source/Git backup.

CONTEXT AND TARGET
Bouldy is a personal bouldering journal: choose a gym, start a session, log
attempts/sends/flashes, finish and review history. The current app is Next.js
with a separate FastAPI backend at https://bouldy-api.onrender.com.
Build React Native + Expo for iOS/Android first, plus replacement web/PWA output
through React Native Web from the same new app repo. PWA means the browser
delivery, not the native binary. The PWA-first recommendation is superseded.

At planning handoff no target repo or migration code existed. Verify current
state before creating anything; resume existing work rather than overwriting it.
Recorded source HEAD: 5467a433ea6699c1206b6e9019430fccff693918.
The actual working tree, including local/untracked work, is authoritative. Compare
the inventory hashes, explain drift and preserve unrelated changes. Do not reset
the source to HEAD. Check that the proposed target path is safe to use and create
a local codex/ branch when appropriate. No remote creation or push is authorised.

STRICT PARITY
Copy the existing app exactly: screens, copy, field order, colours, fonts, SVGs,
hold artwork, icons, spacing, phone canvas, five tabs, sheets, sticky actions,
motion, loading/error/empty states, navigation destinations and number of steps.
Do not redesign, simplify flows or substitute default native/template styling.
Keep planned pages planned. Do not implement the brainstorm backlog, remove Add
gym, add onboarding/social/media/admin features, or add offline mutation queues.
Record any unavoidable app difference as an unresolved issue; do not accept it
yourself. Match logical viewports/data/state and compare renders and interactions.

Coverage is 27 page routes (14 functional, 10 planned, one alias, two dev-only),
two global states, 31 component modules, 19 loading boundaries, 11 Server Actions
and 19 API helpers. The inventory/register is the completion checklist.

LOGIC AND TRUST BOUNDARIES
Keep FastAPI, existing users, record IDs and history. No database migration.
Next Server Actions currently perform trusted checks; preserve them through the
spec's proposed application API adapter in the new repo, or prove an equally
safe server boundary. Do not move security checks exclusively into client code.
Preserve native secure credential storage versus HTTP-only web cookies, auth
hydration, account isolation, command error handling and the existing API shapes.
Do not invent refresh endpoints or backend guarantees; recheck contracts/source.

Preserve all counting rules: current and previous visits stay separate; Send on
an existing project adds no try; Flash needs confirmed lifetime eligibility;
duplicate/partial history stays uncertain; retired/reset IDs remain distinct;
notes update notes only and preserve failed-save drafts. Port the existing logic
assertions. Follow the spec for correction and completed-session restrictions.

THIS RUN: M0–M2
1. M0: freeze recoverable source/reference evidence; verify hashes and the
   current UI; refresh deterministic visual references and missing state fixtures.
   The 44 existing screenshots are historical samples, not fresh native goldens.
2. M1: create the separate local Expo repo, carry the spec/register/references
   into it, pin compatible dependencies, and establish native/web/API-adapter
   foundations. Check toolchain availability before claiming device builds.
3. M2: prove an exact shell/login/session/route-sheet slice, +1 and Send, saved
   history, failed-save feedback, Back/dismissal and restart/auth handling across
   iPhone, Android and web. Re-estimate remaining work from actual evidence.

Run applicable checks and inspect rendered UI. If devices, signing or toolchain
prevent a check, report it as unverified and continue independent work. Do not
fabricate device evidence or weaken the acceptance criteria. Stop at the M2
checkpoint before M3–M7 for foundation review; this is not migration completion.

WORKING AND TOKEN BOUNDARIES
- Keep all changes local/uncommitted/unpushed. Preserve the old repo/deployment.
- Do not deploy, provision paid services/accounts, submit to stores, alter
  production records, rewrite backend contracts or archive/delete the old repo.
- Use isolated fixtures for mutation tests. Keep credentials out of code/logs.
- Work as one agent; no automatic subagents or duplicate audits.
- Use targeted searches/reads and batched independent checks. Fix proven issues
  at their source; avoid speculative rewrites and repeated unchanged test loops.
- Keep updates concise and record file paths/evidence instead of pasting logs.
- Create MIGRATION_PROGRESS.md in the target with current phase, decisions,
  files changed, tests/evidence, blockers and the exact next step. Update it at
  milestones and before handoff; update parity rows only from observed evidence.

Start by verifying source/target state and reading the spec, then do M0–M2.
At the checkpoint report completed work, evidence, unresolved differences,
unverified checks, remaining phases and a concise continuation instruction.
```
