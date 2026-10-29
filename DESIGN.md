---
name: Bouldy
description: The existing phone-oriented climbing journal, preserved across Expo native and web.
colors:
  accent: "#d8151e"
  accent-strong: "#b30000"
  accent-ink: "#fbf7f7"
  accent-tint: "#ffe2dd"
  accent-tint-ink: "#8a050d"
  bg: "#fafafa"
  ink: "#0d0d0d"
  ink-muted: "#4e4c4d"
  ink-faint: "#706e6e"
  hairline: "#d6d3d4"
  panel: "#1c1a1a"
  panel-ink: "#f8f8f8"
  panel-ink-muted: "#b0adae"
  panel-track: "#393738"
  neutral: "#eceaeb"
  rail: "#f0eeee"
  flash-bg: "#c8f2c8"
  flash-ink: "#004b00"
  send-bg: "#cfe7ff"
  send-ink: "#004192"
  zone-bg: "#fee9be"
  zone-ink: "#6d4400"
  focus-web: "#d32828"
typography:
  display:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "48px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "BarlowCondensed-800, Barlow Condensed, Impact, sans-serif"
    fontSize: "24px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist-400, Geist, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4285714285714286
  label:
    fontFamily: "Geist-600, Geist, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.3333333333333333
rounded:
  control: "12px"
  card: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  page: "20px"
  section: "24px"
  bottom: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-dark:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.panel-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-soft:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-tint-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    height: "48px"
  summary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.panel-ink}"
    rounded: "{rounded.card}"
    padding: "20px"
  result-send:
    backgroundColor: "{colors.send-bg}"
    textColor: "{colors.send-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Bouldy

## Overview

**Creative North Star: "The Climber’s Logbook"**

This records the existing visual direction, not a new proposal. Bouldy feels like a compact personal logbook used between attempts: direct, easy to scan and specific to climbing. Condensed gym-signage headings sit above calm interface text. Detailed hold artwork and the Bolt B mark provide identity without turning records into decoration.

The canonical [migration specification](docs/REACT_NATIVE_MIGRATION_SPEC.md) governs exact parity. This document describes the current Expo implementation, checked against the preserved [source design](docs/SOURCE_DESIGN.md), theme modules and [Android fixture captures](docs/screenshots/android/README.md) on 29 October 2026. Captures establish visual evidence, not accepted parity. Any difference between source, code and this record must be reported and resolved rather than silently redesigned.

**Key Characteristics:**

- A light phone canvas with restrained dark summaries and one action accent.
- Condensed uppercase headings, readable Geist controls and accurate session data.
- Flat records, pill actions, detailed climbing holds and purposeful state feedback.
- Shared branded UI with working native safe areas, keyboard behaviour and dismissal.

## Colors

Frontmatter records the implemented sRGB values from [colors.ts](src/theme/colors.ts) and [semantic-colors.ts](src/theme/semantic-colors.ts). The preserved source uses OKLCH; conversion provenance is in the migration evidence. Do not substitute visually similar values or reconvert tokens ad hoc.

### Primary

Send Red is `accent`; `accent-strong` provides the stronger red role. Accent ink and the paired tint/tint-ink support actions and inline feedback. Use the shared tokens, not page-local red approximations.

### Secondary

Flash uses the green pair, Send the blue pair and competition Zone the amber pair. These communicate results, not alternative brand themes. Hold colour is route metadata and uses the assets and options in [route-options.ts](src/domain/route-options.ts).

### Neutral

Chalk White is `bg`; Wall Black is `ink`. Panel Black uses its own panel-ink and panel-muted pair. Hairline divides records and fields. Neutral and rail support subdued controls; faint ink is supporting text, not a substitute for readable primary copy.

**The One Red Rule.** One shared action accent establishes hierarchy; do not assign unrelated accent themes per route or tab.

**The Paired Surface Rule.** Dark summaries use the panel text tokens, while semantic badges keep their matched foreground/background pair.

**Recorded exception:** the current web focus outline comes from [global.css](src/app/global.css) and differs from the accent. `focus-web` records that actual value. This documentation does not silently align the colours or certify their contrast.

## Typography

Local Barlow Condensed carries headings, grades and the wordmark; Geist carries body copy, labels, inputs and buttons. Geist Mono is loaded for technical identifiers. Font files, licence records and corrected native family identities live in [assets/fonts](assets/fonts) and [provenance.json](assets/fonts/provenance.json).

Frontmatter describes the shared `Heading` and `T` roles in [primitives.tsx](src/components/primitives.tsx), not a mandate to flatten page-specific typography. Headings are uppercase with the existing tight tracking. Body defaults to the compact journal scale; inputs use larger text. The bottom-nav label has its own smaller size and line height. Preserve explicit page overrides and source line breaks rather than globally normalising them to the historical source document's suggested scale.

**The Two-Voice Rule.** Condensed type identifies climbing content; Geist makes controls and journal detail readable. Do not replace either family with a platform default as a migration shortcut.

## Layout

The root canvas fills narrow viewports and stays centred at a maximum width of 430 logical units on larger displays. Web uses the dynamic viewport height; native layout respects safe areas. The cap is implemented in [the root layout](src/app/_layout.tsx), not a breakpoint that reveals a desktop dashboard.

The shared page style uses horizontal/top padding from `page`, bottom padding from `bottom`, and section gaps from `section` in the frontmatter. Individual screens may preserve source-specific spacing. Do not introduce a universal spacing reset to force every page onto the same composition.

Five bottom tabs are Home, Explore, Sessions, Gyms and You. Route add/edit pages hide that bar in favour of their Save action. Pushed pages use a parent-labelled header; short tasks use a sheet. Long route lists remain compact grouped rows, not an expanded card grid.

**The Phone Canvas Rule.** Wider screens retain the same app hierarchy and reading width; no sidebar, desktop dashboard or decorative phone frame is implied.

## Elevation & Depth

Resting record rows, cards and controls are predominantly flat. Tone, borders and spacing carry structure. Modal sheets use a dim backdrop and own their focus/dismissal. Their height is capped at 88% of the viewport and their width matches the phone canvas.

**The State-Only Lift Rule.** Elevation belongs to transient feedback or overlays. The current snackbar has an explicit soft shadow; that is not permission to add decorative shadows to resting cards. Button press feedback uses the existing downward movement and slight compression.

## Shapes

Use the established control, card and pill shapes from the frontmatter. Sheets round their top corners; detailed hold silhouettes come from the supplied SVGs. Preserve the shapes and proportions of the Bolt B mark and hold artwork. Do not redraw them as generic circles or replace an unknown hold colour with a blue hold; the fallback is neutral grey.

## Components

| Pattern | Current implementation | Contract |
| --- | --- | --- |
| Text, heading, brand, hold, button, field, feedback, result badge | [primitives.tsx](src/components/primitives.tsx) | Reuse variants and labelled pending/error states. Buttons and fields use minimum heights; frontmatter heights describe that baseline, not a clipping constraint. |
| Screen and anchors | [screen.tsx](src/components/screen.tsx) | Preserve parent navigation, scroll/fragment restoration and keyboard access. |
| Five-tab shell | [app layout](src/app/(app)/_layout.tsx) | Preserve destination order, selected state, safe-area padding and form-page visibility rules. |
| Native / web sheet | [sheet.tsx](src/components/sheet.tsx), [sheet.web.tsx](src/components/sheet.web.tsx) | Focus ownership, close/back/backdrop behaviour, scroll access and no retained overlay after navigation. |
| Route browser and route actions | [route-browser.tsx](src/components/route-browser.tsx), [route-sheet.tsx](src/components/route-sheet.tsx) | Hold, grade, filtering, current/prior visits, correction, private notes and eligibility remain explicit. |
| Success snackbar | [snackbar.tsx](src/components/snackbar.tsx) | Transient overlay with dismissal; errors remain beside the failed operation. |
| Loading and errors | [page-skeleton.tsx](src/components/page-skeleton.tsx), [error-boundary.tsx](src/components/error-boundary.tsx) | Source-shaped skeletons, branded errors and explicit retries; never invented successful data. |

Motion comes from [motion.ts](src/theme/motion.ts), [page-motion.ts](src/features/page-motion.ts) and platform-specific implementations: sheets enter/exit in 260/200ms; snackbar entrance/exit is 260/180ms with a five-second lifetime; Welcome enters in 500ms; tab/push transitions are 220/260ms. Reduced motion removes movement. These are recorded code values; full timing/gesture parity is still unaccepted.

The sidecar’s tonal ramps are generated panel aids (OKLCH lightness steps with sRGB gamut clipping), not additional approved runtime colours. Component specimens are documentation previews; native gesture, lifecycle, loading and accessibility behaviour remains in the referenced code.

The native Main style picker remains a recorded, unaccepted platform adaptation. Keep its acceptance issue visible; the existence of a native control does not approve a UI change. Web hover/focus, native press/disabled/pending behaviour and accessibility must be checked in the actual platform, not assumed from the design-panel samples in [.impeccable/design.json](.impeccable/design.json).

## Do's and Don'ts

### Do:

- **Do** preserve the exact approved source copy, interface, assets and business semantics.
- **Do** reuse shared primitives, theme roles, platform boundaries and reduced-motion handling.
- **Do** verify safe areas, keyboard access, focus, text scaling and touch targets on the affected platform.
- **Do** compare matching route/data/state captures before accepting visual parity.
- **Do** record a visual/accessibility conflict explicitly and resolve it with the product owner.

### Don't:

- **Don't** redesign the migration into a stock iOS/Material app or a wide desktop dashboard.
- **Don't** add cream/beige palettes, glass effects, decorative gradients, nested cards or generic icon-card grids.
- **Don't** replace the supplied fonts, Bolt B or hold artwork with approximations.
- **Don't** hide failed reads, ambiguous history, missing content or unverified platform behaviour.
- **Don't** treat these specifications, generated component previews or a Done card as proof of release readiness.
