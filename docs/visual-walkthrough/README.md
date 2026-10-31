# Bouldy visual walkthrough

> **Historical visuals:** these captures predate the approved v35 cream/four-tab design. They are not current UI or redesign acceptance evidence. See [the current redesign handoff](../redesign/HANDOFF.md).

Prepared 24 October 2026 for the team brainstorm.

- Open `bouldy-visual-walkthrough.html` in a browser. It is self-contained, including all screenshots, and can be shared as one file.
- The original PDF export is not present in this Expo checkout; use the preserved HTML walkthrough above. Current phone review is available through the [Notion screenshot index](https://app.notion.com/p/40876faa3b39810983cdd8e80fb4d41a), whose 195-image gallery is also historical/pre-v35.
- `walkthrough-data.json` contains the editable page descriptions, current/proposed flow steps and discussion prompts.
- `screenshots/` contains the unedited local app captures and capture log.

The app was rendered locally against an isolated sample API. Sample accounts, gyms and climbing records are illustrative. Planned pages remain visibly planned. This guide is not production verification and does not change the app or approve roadmap scope.

All current product route families are represented. Internal development preview pages are excluded; `/history` is documented as a redirect. Screenshot viewport is 390 x 844. Additional captures show lower content and open sheets explicitly.

## Verification

On 24 October 2026: all 44 embedded screenshots loaded in the portable guide; its 36 feature sections, app overview and source section were checked. Browser checks at 390px and 1440px found no horizontal overflow or page errors. The PDF has 38 rendered pages and 36 navigation bookmarks. All final PDF pages were visually inspected. The Canvas passed TypeScript checking.

The existing frontend also passed lint, TypeScript, all 10 unit tests and a webpack production build. Existing Node module-type and parent-lockfile warnings remain. These checks do not verify production API behaviour. No app source was changed for this guide, no records were written during capture, and no commit or deployment was made.
