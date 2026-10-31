# Bouldy project guide

Current documentation index, refreshed 31 October 2026 against code/main `55b51d8`. Notion view/status observations below retain their separately stated dates. Start with the latest entry in [MIGRATION_PROGRESS.md](../MIGRATION_PROGRESS.md), then read only the documents relevant to the change. This avoids repeating the migration discovery.

## Product, design and engineering

| Document | Use it for |
| --- | --- |
| [PRODUCT.md](../PRODUCT.md) | Users, climbing-journal workflow, current capability and planned-feature boundaries. |
| [DESIGN.md](../DESIGN.md) | Existing identity, implemented tokens, fonts, layout, shared components and motion. |
| [CODE_QUALITY.md](CODE_QUALITY.md) | Mobile/native/PWA engineering requirements and change/release verification. |
| [AGENTS.md](../AGENTS.md) | Required working rules for coding agents and preservation boundaries. |
| [README.md](../README.md) | Live API startup, explicit fixture startup, toolchain and build commands. |
| [Redesign handoff](redesign/HANDOFF.md) and [continuation prompt](redesign/CONTINUE_PROMPT.md) | Current v35 implementation, recent changes, verification limits and resume instructions. |
| [REACT_NATIVE_MIGRATION_SPEC.md](REACT_NATIVE_MIGRATION_SPEC.md) | Original migration baseline. Exact-copy visual/five-tab restrictions are superseded by the approved v35 redesign; unchanged data/auth/privacy safeguards still apply. |
| [PWA_AND_RELEASE_RUNBOOK.md](PWA_AND_RELEASE_RUNBOOK.md) | Install, caching, updates, native prerequisites and future cutover/rollback. |
| [Migration register](migration/PARITY_REGISTER.md) | Coverage and acceptance structure; detailed screen/action/component CSVs live beside it. |
| [Android screenshot index](screenshots/android/README.md) | Page-by-page and feature/state evidence, with a linked gallery. |

`SOURCE_PRODUCT.md`, `SOURCE_DESIGN.md`, `SOURCE_MASTER_SPEC.md` and `reference/source/` preserve the old web project. Keep them as historical evidence; do not follow their old imports, deployment assumptions, stack or uncommitted-only restrictions over the current root documents. The original repository at `/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-web` is deprecated and must not be developed. Keep its history/reference files intact; no deletion/archive is authorised.

## Notion Kanban and coordination

The [Bouldy — Task Board](https://app.notion.com/p/4b6c2168a8ab47289704a345a3ae239c) is the shared task database inside [Bouldy — Product Planning](https://app.notion.com/p/40376faa3b39812bbf6aecd14595fe63). Its views were read through the Notion connection on 29 October 2026:

| View | Purpose |
| --- | --- |
| [Kanban](https://www.notion.so/4b6c2168a8ab47289704a345a3ae239c?v=40376faa3b39817bb5de000c7b7b71e7) | Main workflow grouped by Status. |
| [Frontend](https://www.notion.so/4b6c2168a8ab47289704a345a3ae239c?v=40376faa3b3981b79d95000ccec290ee) | Frontend board grouped by Status. |
| [Backend](https://www.notion.so/4b6c2168a8ab47289704a345a3ae239c?v=40376faa3b39812dbe1f000ce573c0ef) | Backend board grouped by Status. |
| [Priorities](https://www.notion.so/4b6c2168a8ab47289704a345a3ae239c?v=40376faa3b3981cb9825000c2123478f) | Priority-grouped planning. |
| [Decisions](https://www.notion.so/4b6c2168a8ab47289704a345a3ae239c?v=40376faa3b398187a0ad000c8aa5d5a4) | Decision cards grouped by Status. |

If a view link opens the default view on a phone, open the task-board link and select the named view. Integrations can use data source `collection://58d423be-a9b9-4b16-aa7a-a7c399eb1d8f`; exact page/view IDs are retained in [NOTION_LINKS.json](migration/NOTION_LINKS.json).

Status options are Needs decision, Backlog, Ready, In progress, In review and Done. Approval is a separate field; a backlog card is not permission to implement it. Preserve Task ID, existing dependencies, team/workstream tags and acceptance criteria. Update existing cards instead of duplicating them; attach the change, evidence, affected platforms and remaining blockers. Do not invent owners or due dates.

[BLY-077 — migration implementation](https://app.notion.com/p/40676faa3b398127a698d570e7631e24) is Done by the product owner's explicit request. Its unchecked parity/release gates remain open. [BLY-035 — installed PWA](https://app.notion.com/p/40376faa3b398131bb63f24b27833621) remains the companion verification task. Re-read their current properties before making a new status claim or changing them; this guide is a dated snapshot.

| Coordination reference | Link |
| --- | --- |
| Migration plan | [Bouldy — React Native Migration Plan](https://app.notion.com/p/40776faa3b39816289e3c6985884558e) |
| Full specification | [Specification — Bouldy 1:1 React Native Migration](https://app.notion.com/p/40776faa3b3981a9b8b4f75df22781cd) |
| Parity register | [Migration parity register](https://app.notion.com/p/40776faa3b3981729c3bd0a37ef2b7a3) |
| Agent handoff | [Migration agent handoff](https://app.notion.com/p/40776faa3b3981c09fadd67d4f57e945) |
| Phone review | [Screenshots, Page Index & Migration Status](https://app.notion.com/p/40876faa3b39810983cdd8e80fb4d41a) |

Use local specifications first. Notion supplies shared coordination and fallback documents. Report a material discrepancy explicitly; do not read duplicate full specifications just to collect more context or copy stale status into current docs.

## Code ownership and data flow

`src/app` contains Expo routes and API entrypoints; `src/components` owns shared UI; `src/theme` owns colour/style/motion values; `src/features` and `src/domain` hold interaction and climbing logic; `src/platform` isolates credentials, lifecycle, web/PWA and native behaviour; `src/data` owns shared contracts and the client; `src/server` owns trusted commands and FastAPI transport. Tests and synthetic fixtures live in `tests/` and `scripts/`.

Both clients use this repository's trusted adapter. Web uses its own origin; native uses `EXPO_PUBLIC_ADAPTER_ORIGIN`. The adapter calls `https://bouldy-api.onrender.com`. A static-only host cannot execute the server adapter. Simulator loopback is a local development address, not a deployable physical-device configuration.

## Working with Impeccable

Use the installed `impeccable` skill's `context` command once per session from this repository. Root PRODUCT/DESIGN are current context; the design sidecar is `.impeccable/design.json`. For documentation, extract the actual implementation; for a refinement, preserve the approved world. The approved v35 root design/handoff and explicit user instructions override historical exact-copy visual constraints and generic skill suggestions for new fonts, system skins, dark themes or larger-screen redesigns.

Run the relevant playbook for the requested task. Read the craft floor before UI edits; run the mechanical detector on changed UI when directed. Inspect and correct UI in bounded passes. A documentation-only update does not need a UI build or detector run. Do not install skill updates, start agents or change workflow defaults as a side effect; respect the current user-authorised scope.

## Current release boundary

The user selected GitHub main only. Current source/main was verified at `55b51d8` during this documentation pass; the last full recorded validation is the earlier `488ab9b` checkpoint. Native width is owner-confirmed on iPhone; full device/PWA/release acceptance remains open. Source is published; no new site deployment, old-site cutover, store release or source retirement has occurred. Live sign-in/read verification is scoped evidence, not approval to mutate production climbing records. Every claim of test success needs the command, date, platform/environment and evidence path in current progress.
