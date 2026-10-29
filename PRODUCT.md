# Product: Bouldy

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

Bouldy targets iOS and Android with React Native + Expo, plus replacement web/PWA output from the same repository. A shared, phone-oriented identity is binding across platforms. Native safe areas, keyboard behaviour, accessibility and system Back must work without replacing the approved interface with stock Cupertino or Material styling. Tablet-specific layouts and a separate desktop dashboard are not approved scope.

## Users

Climbers logging bouldering visits between tries and reviewing their personal progress afterward. The core job is to record a route quickly, distinguish this visit from previous visits, and find the relevant history without losing the current session.

## Product Purpose

Bouldy is a personal climbing journal. Its core loop is gym → session → route → attempt/result/private note → session summary and history. Success means fast, trustworthy logging and readable progress across visits and wall resets.

Community, opt-in discovery, shared beta and rankings are longer-term product direction. Their planned screens are not evidence of delivered social features. No market-leadership, training-outcome or performance claims are established.

## Operating Context

The main destinations are Home, Explore, Sessions, Gyms and You. Sessions and Climbs are related journal views. Short interactions use sheets; long route forms use pushed pages. The app stays a phone-width experience on wider browsers.

The existing Next.js repository at `../bouldy-web` is preserved as the migration reference. This repository is `bouldy-mobile`; its published source is [AmeerulH/bouldy-mobile](https://github.com/AmeerulH/bouldy-mobile). Product work is tracked in the [Bouldy Task Board](https://app.notion.com/p/4b6c2168a8ab47289704a345a3ae239c); view links and working conventions are in [the project guide](docs/PROJECT_GUIDE.md).

## Capabilities and Constraints

- Existing implemented flows cover authentication, gym and route browsing/creation/editing, session logging, result correction, independent private notes, history, progress and an owner profile. All 27 original routes and 11 commands have local implementations; exact coverage and acceptance live in [MIGRATION_PROGRESS.md](MIGRATION_PROGRESS.md) and the parity registers.
- Persistent users, gyms, routes, sessions and attempts use the real FastAPI service at `https://bouldy-api.onrender.com`. The trusted adapter in this repository retains validation and ownership checks. Backend authorization and atomicity remain backend responsibilities.
- Login uses email in the backend OAuth2 `username` field. Web credentials are HTTP-only cookies; native credentials use SecureStore. Do not put test passwords or tokens in documentation.
- Normal startup selects the real API. Fixture mode is explicit and isolated; all automated or exploratory record writes use synthetic fixtures unless the user specifically authorises a different environment and records. See [README.md](README.md).
- Prior visits and the current session stay separate. Unknown reads and duplicate logs must remain visibly uncertain, not silently become zero activity. A correction changes a log; it does not add a physical try. Flash eligibility depends on complete, unambiguous history. Retired routes remain readable; reset routes with new IDs retain separate histories.
- Stored records summarise sessions/routes; exact physical-try timestamps, exact send timing and reliable same-day visit ordering must not be invented.
- Completed sessions lock attempt logging/correction while private notes remain editable. Preserve the source's note-clear payload and error behaviour.
- Planned social/media/profile-edit destinations retain their original planned copy. Do not implement new scoring, shared grades, rankings, groups, public profiles or persistent media merely to fill placeholders.
- PWA output is online-first. Its generic offline fallback is not offline journal support. There is no private response cache, automatic mutation retry, replay or offline write queue.

## Brand Commitments

Keep the name Bouldy, Bolt B mark, local climbing-hold artwork, established voice and current copy. Preserve the existing “The Climber’s Logbook” direction from the source design record. [DESIGN.md](DESIGN.md) records the implemented visual system; this migration remains implementation, not redesign.

## Evidence on Hand

The canonical behaviour contract is [REACT_NATIVE_MIGRATION_SPEC.md](docs/REACT_NATIVE_MIGRATION_SPEC.md). Preserved product/design records are [SOURCE_PRODUCT.md](docs/SOURCE_PRODUCT.md) and [SOURCE_DESIGN.md](docs/SOURCE_DESIGN.md); their old paths, stack and release restrictions are historical, not current instructions.

The [195-image Android gallery](docs/screenshots/android/README.md), [Notion phone review](https://app.notion.com/p/40876faa3b39810983cdd8e80fb4d41a) and [live API evidence](docs/evidence/live-api-connection.json) establish scoped observations. Screenshots use synthetic data; they are not accepted cross-platform goldens. Full installed-PWA, physical-device, release and parity acceptance remains open. Read current progress before citing a test result.

## Product Principles

- Make logging fast and clear while climbing.
- Preserve identity and history across visits, retirement and resets.
- Show uncertainty honestly; never manufacture progress or persistence.
- Keep personal data private and future sharing deliberate.
- Preserve approved behaviour before adding features or changing design.

## Accessibility & Inclusion

Support touch, keyboard and assistive technology; labelled controls and state changes; readable contrast; text scaling; safe-area and keyboard access; and reduced motion. [CODE_QUALITY.md](docs/CODE_QUALITY.md) defines verification expectations and how to record a conflict with exact visual parity. This document establishes expectations, not an accessibility certification.
