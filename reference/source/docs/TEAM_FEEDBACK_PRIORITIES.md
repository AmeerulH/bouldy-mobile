# Bouldy: team feedback and proposed priorities

**Captured and consolidated:** 24 October 2026. Includes the original 34 comments and the later attributed tester summary. **Status:** discussion notes only. No app changes or implementation are authorised by this document. The priority order below is a recommendation for the team to review, not an approved delivery commitment.

## What the feedback is telling us

Zebo and Bryan liked the design/usability. The later summary names Alif, Bryan, Yenni and Wei as reporting onboarding friction, while Zebo questions whether beginners are the target audience. The direction should make the journey clearer: know what to do, record the climb, understand improvement and connect with other climbers. Audience focus is still a decision; it must not be silently settled by the priority list.

Personal progress and community remain the proposed long-term direction. This feedback does not approve a redesign, a new feature scope or expansion beyond climbing.

## What the additional summary changes

- **New explicit needs:** cancel a session (Aisyah); a private route list for each person (Wei); richer personal-diary/route context (Afina); descriptions for removed routes (Bryan); a map-style partner/route view (Afina); homepage promotions and marketing contact collection (Aisyah).
- **Stronger urgency:** photos are Zebo's stated priority and wanted ASAP. Keep photos distinct from the larger video-upload scope so the team can assess a useful first media delivery.
- **Clearer admin request:** Wei specifically asks to remove Add gym and let admins manage it. This clarifies management, but does not settle the earlier question about hiding the whole Gyms tab.
- **Different kinds of phone use:** Aisyah's phone-number collection for cross-selling is distinct from the earlier phone-signup request.
- **Strategic tension:** clarify the primary audience and the value of Bouldy's logging flow before expanding navigation or adding steps.

The attributed source is [Tester feedback, 24 October](./TESTER_FEEDBACK_2026-10-24.md). R1-R11 below refer to its theme/individual sections; the original 1-34 comment IDs remain unchanged.

## Consolidated priority order for team review

1. **Decide the audience and core value.** Separate beginners to climbing from experienced climbers who are new to Bouldy. Agree why logging here is worthwhile and simplify the core path (T1/T2).
2. **First candidate release: a clear, complete session loop.** Tutorial/glossary and revisitable guidance (T2); clear Send/project actions (T3); cancel-session behaviour (T20); an end-of-session summary (T6); and the admin boundary for Add gym (T4).
3. **Next high-demand work: photos, progress and personal collections.** Scope a useful first photo feature (T7), personal dashboard/goals/project progress (T5), and private route lists (T21). Gym discovery (T8) and PWA (T9) remain earlier release candidates, to be scheduled after scoping. Determine dependencies before choosing build order.
4. **Then choose a community slice.** Feed and comparison (T10), leaderboards, buddies/groups (T11), competition news (T12) and useful beta (T13). Avoid treating them as one delivery.
5. **Retain the remaining platform/enhancement investigations.** Location/QR/NFC shortcuts (T16), themes (T14), watch/health integration (T18), transcription (T15), phone signup (T17), promotions (T22), marketing contact collection (T23), and expansion/alternatives (T19). Their earlier requests remain valid for discussion; this ordering is not a rejection.

The tester summary calls its first set “quick wins.” Here they are **candidate near-term outcomes**, because cancellation semantics, admin permissions and some saved onboarding state may require BE decisions/work. No effort estimate has been confirmed.

## Decisions before scope is approved

- **Audience:** is the first release aimed at regular climbers, beginners, or both? Which guidance is useful to anyone new to Bouldy?
- **Differentiation and steps:** what is the shortest useful route-log journey, and what extra value comes from starting a session? Afina's MadMonkeys comparison is a reported perception, not an independent product audit.
- **Cancellation:** abandon an empty session, undo an accidental start, discard existing logs, or finish a visit early? Decide what happens to saved history.
- **Private route lists:** a saved personal collection, private route creation, or both? How does that relate to the shared gym catalogue?
- **Gym ownership:** remove Add gym for regular users; confirm separately whether gym browsing still has a normal-user destination.
- **Removed-route action:** what should Bryan's requested button do: show the old description, add context, report a removal, or something else?
- **Map-style partner view:** confirm whether Afina means a wall/route map, a partner map or a combined route list.
- **Marketing contacts:** what is the intended user benefit, purpose and choice? Keep marketing contact collection separate from authentication; nothing is approved or collected by these notes.
- **Alternatives:** retain Aisyah's wording until its meaning is clarified; do not assume it means expansion outside climbing.

## Priority 1: make the core journey understandable

These are the first product and usability problems to resolve before adding more destinations.

### T1. One clear user journey and simpler navigation

- Consolidate confusing pages and make the next action obvious.
- Reconsider how Sessions and Climbs are presented. Users want to understand performance against their own previous attempts and, eventually, other people.
- Give each main area a clear purpose tied to the app's goal. Preserve the visual strengths the team already likes.
- **First planning output:** a simplified journey from opening Bouldy to choosing a gym, logging, reviewing progress and returning.
- **Likely involvement:** product, design and FE. BE involvement depends on the final progress/comparison requirements.
- **Attributed feedback:** Alif on Sessions/Climbs; Wei and Bryan on streamlining; Afina on the shorter perceived competing flow (R1/R4). Preserve Zebo's positive categorisation feedback (R6).
- **Source comments:** 8, 9, 15, 25.

### T2. Beginner onboarding and continuing guidance

- Provide onboarding after signup, with a way to revisit it from the profile.
- Explain Bouldy's purpose, climbing jargon, result labels and how colours are used.
- Add a short first-session introduction explaining what users can do and what to press.
- Keep next-step guidance available in the profile after onboarding.
- Explain colour as one route cue alongside other identifying details; do not rely on colour alone.
- **First planning output:** agree what belongs in signup onboarding, the first-session guide and the reusable help area.
- **Likely involvement:** product/content/design and FE; BE if goals or onboarding progress are saved across devices.
- **Attributed feedback:** Alif's glossary/tutorial/goals and Bryan's tutorial; R1 also records Yenni/Wei's friction. Zebo questions beginner targeting, so onboarding scope remains a product decision. Bryan requests descriptions alongside colour cues (R9).
- **Source comments:** 2, 3, 4, 5, 26, 28.

### T3. A more direct climbing-session experience

- Add an explicit Send action beside +1 so finishing a route is easy to record.
- At session start, offer unfinished projects and ask whether the climber wants to continue them.
- Provide a consolidated route view after choosing a gym/session, with suggested routes if that is the intended request.
- **Open question:** comment 29 says both “all the gyms” and “suggested routes.” Confirm whether this means all routes at the selected gym, nearby gyms, personalised suggestions, or a combination.
- **Likely involvement:** product/design/FE. Simple project prompts may reuse current history; authoritative recommendations or progress services may require BE work. Confirm scope before estimating.
- **Additional context:** Wei asks for Send/project continuation; Afina says manual records lack route context and suggests a map-style partner/route view. Bryan requests an action describing removed routes. Record these as concepts to clarify rather than a specified map or removal control (R4/R5/R9/R10). Session cancellation is separately captured in T20.
- **Source comments:** 11, 14, 29.

### T4. Separate climber actions from admin management

- Record the request that the Gym section should be admin-only and hidden from normal users.
- Keep custom boulder-colour management under admin control.
- **Decision needed:** does “Gym section” mean the entire Gyms tab, or the tools for creating/managing gyms and routes? Regular users still need a way to choose where they climb and browse its routes.
- **Likely involvement:** product, FE and BE. Permissions must be enforced by the backend as well as reflected in the UI.
- **Attributed clarification:** Wei specifically requests removing Add gym from normal-user use and assigning it to admins (R7). This supports restricting management, not an automatic decision to remove all gym discovery. Private route lists are a separate ownership question under T21.
- **Source comments:** 13, 24.

### T20. Cancel or abandon a session

- Aisyah reports no way to cancel a session (R4).
- Add this to the first candidate scope, subject to agreeing the behaviour for an empty session versus one containing logs.
- Define whether cancellation preserves, hides or discards records, and how accidental cancellation is recovered. Do not equate cancelling with ending a completed visit or silently deleting history.
- **Likely involvement:** product, FE and BE/API review. No delivery difficulty is asserted yet.
- **Source:** attributed summary R4 and its suggested priorities; new to this consolidated record.

### T6. End-of-session summary; ratings as a separate follow-up

- Show a summary after every completed session.
- Make the visit's date, duration, outcomes and progress easy to understand.
- Let users rate a climb afterward.
- **Decision needed:** does rating mean perceived difficulty, enjoyment, route quality or another measure? Is it private or shared? Confirm whether it applies to a route or the whole session.
- **Likely involvement:** product and FE; BE for any new rating fields or summary data not available today.
- **Priority update:** Bryan explicitly requests a summary of the day's climbs, and the supplied summary places it in the first candidate set (R3). Promote the summary; do not automatically bundle new rating fields into that delivery.
- **Source comments:** 10, 31; related to 17.

## Priority 2: make progress visible and prepare a useful first release

This is the next useful delivery area once the team agrees on the journey. Several parts can be explored alongside Priority 1.

### T5. Goals, personal dashboard and progress graphs

- Let beginners choose a climbing goal and understand how Bouldy helps them work toward it.
- Show climbing hours, sends, completed grades/levels and progress over time.
- Make session/climb date and duration easy to see. Some session data already exists; determine what needs clearer presentation versus new tracking.
- Compare a climber's current effort with their earlier attempts. Treat comparison with other users as a separate, privacy-aware feature under T10.
- **Decisions needed:** which goals to offer; what “level completed” means across gym grading systems; which measures represent useful improvement.
- **Likely involvement:** product, FE and BE. Goal persistence and any new measurements need contracts; reuse reliable existing fields where possible.
- **Attributed detail:** Yenni requests goals, sends, graphs and attempts per project. Alif names ideal climb time, flashing, V-grades, ratings and comparison per climb with others (R3); their precise definitions still need agreement.
- **Source comments:** 16, 17, 21; related to 8.

### T7. Photos and videos while logging

- Allow photos and videos to be attached during session logging.
- Decide whether an attachment belongs to a route, a route log, a session or a social post.
- Keep this distinct from Instagram embedding (T13), which may be a different route to useful beta.
- **Likely involvement:** product, FE and BE, including persistent media storage and access rules. This is a high-value candidate with a larger delivery dependency; it should not be mistaken for a small file-picker change.
- **Attributed priority:** Zebo wants photos ASAP and calls them the priority (R5/R6). Afina wants a personal diary and better route context. Scope photos separately from persistent video, and decide how private diary notes relate to shared beta.
- **Source comment:** 1.

### T8. Gym discovery and nearby selection

- Provide a climbing-gym locator and help users find their closest gym when selecting where to climb.
- **Planning point:** distinguish a useful gym directory/search from location-based sorting. Decide what happens when a user declines location access and how gym coordinates are maintained.
- **Likely involvement:** product, FE and BE, depending on available gym-location data.
- **Attributed feedback:** Aisyah requests a gym locator; Alif/Bryan mention geolocation (R4/R11). A locator and a shortcut for starting a session remain separate scopes.
- **Source comments:** 12, 32.

### T9. PWA delivery

- Record the request to convert Bouldy into a Progressive Web App.
- Define the first PWA scope: installation, launch experience and mobile behaviour. Discuss offline logging, synchronisation and notifications separately rather than assuming they all arrive together.
- **Likely involvement:** FE for the application shell; FE/BE coordination for offline data or other extended capabilities. Platform behaviour needs a later feasibility check.
- **Source comment:** 19.

### T21. Private route list / personal collection

- Wei asks for everyone to have a private route list (R7). The supplied summary puts it alongside photos and progress as high demand.
- Decide whether this means saving routes from the shared gym catalogue, creating entirely private routes, or a combination.
- Current ownership and catalogue concepts must be reconciled before choosing a model. Do not assume the current Climbs collection fully satisfies the request.
- Connect any selected direction with unfinished projects, diary context and the consolidated list in T3.
- **Likely involvement:** product, FE and BE for saved relationships or private records as required.
- **Source:** attributed summary R7; new to this consolidated record.

## Priority 3: create the first useful community experience

Choose a small social delivery that supports the core journal. Do not treat every community idea as one release.

### T10. Climber activity feed and comparison

- Provide a feed of activity from other climbers.
- Explore the requested comparison with other users alongside personal progress.
- **Decision needed:** “all users data” needs a visibility definition. Does the feed include all deliberately shared activity, followed climbers, a gym community or something else? Decide what can appear; private account information and journal notes must be treated separately.
- **Likely involvement:** product, FE and BE for shared activity, public identity, privacy and comparison rules.
- **Attributed feedback:** Alif wants a homepage feed around common climbs and comparison on each climb. Zebo wants a leaderboard (R2/R3). Keep feed, per-route comparison and authoritative rankings as distinct deliveries with agreed scoring/privacy where applicable.
- **Source comment:** 6; related to 8.

### T11. Planned sessions and climbing buddies

- Let people say when they intend to climb and find others to join them.
- **Decision needed:** sharing with friends, gym members or everyone; who may join; and how plans are changed or cancelled.
- **Likely involvement:** product, FE and BE for session plans, relationships and visibility.
- **Attributed feedback:** Yenni specifically links groups with helping beginners find climbing buddies (R2). Afina's map-style partner/route view is retained as an unresolved interface idea (R10).
- **Source comment:** 20.

### T12. Competition and community news

- Provide a news feed for upcoming competitions.
- **Decision needed:** who supplies and maintains listings, whether this is separate from the activity feed, and whether users follow gyms or regions.
- **Likely involvement:** product/content operations, FE and BE or an agreed content source.
- **Attributed feedback:** Yenni requests competition news (R2).
- **Source comment:** 18.

### T13. Instagram beta videos

- Explore embedded Instagram videos for climbing beta.
- **Research later:** supported embedding, access/availability, attribution and fallback behaviour. No feasibility conclusion is recorded here.
- Decide how a clip is attached to the correct route and whether beta is hidden until requested.
- **Likely involvement:** product, FE and BE if links/attribution are persisted; external-platform constraints also apply.
- **Attributed feedback:** Bryan requests embedded Instagram/video for browsing beta (R5).
- **Source comment:** 30.

## Priority 4: enhancements and investigations to retain

These remain on the list. They should follow clearer core flows or a specific user need that raises their priority.

### T14. Themes and configurable layouts

- Offer more theme choices and options for what the dashboard shows.
- Preserve the positive feedback on the existing UI while addressing the feeling that it is too black and white.
- **Decision needed:** selectable colours, different layouts and configurable dashboard content are separate scopes. Agree which matters most.
- **Likely involvement:** design/FE; BE if preferences must persist across devices.
- **Attributed feedback:** Yenni proposes a vintage theme as one possibility (R8), not an approved replacement visual direction.
- **Source comment:** 23.

### T15. Transcribed notes

- Offer transcription for notes after a climb or session, alongside typed notes.
- **Decision needed:** speech-to-text input versus saving audio, which note types it supports, and device/language support.
- **Likely involvement:** FE plus a later service/platform feasibility check; BE if audio or transcription processing is stored/server-managed.
- **Attributed feedback:** Bryan mentions voice recording **or** transcription (R5). Preserve both options until the team chooses; do not assume speech-to-text alone fulfils the audio-recording request. Afina's personal-diary need also applies to typed notes and route context (T7).
- **Source comment:** 27.

### T16. NFC / QR entry or check-in

- Retain the future idea of scanning an NFC tag or QR code to make identifying a gym or starting the right journey easier.
- **Decision needed:** scan a gym, a route or a check-in point? Separate identifying a tagged location from device-based location discovery (T8).
- **Likely involvement:** product, FE, BE and gym/tag operations; feasibility to investigate later.
- **Attributed feedback:** Alif suggests QR/NFC or geolocation to start sessions; Bryan also mentions geolocation (R4). Session-start friction links this to T3; the shortcut still needs feasibility work.
- **Source comment:** 7.

### T17. Phone-number signup

- Retain phone-based signup as an alternative authentication direction.
- **Research later:** verification, account recovery, existing-account linking, provider requirements and operating cost.
- **Likely involvement:** product, FE, BE and authentication-provider decisions. No authentication changes are proposed for immediate execution.
- **Distinct request:** Aisyah's proposed phone collection for cross-selling is T23, not evidence that phone authentication has been chosen.
- **Source comment:** 33.

### T18. Health-app integration

- Explore connections with health/fitness applications.
- **Decision needed:** which apps, which data, whether Bouldy reads or writes it, and what user benefit justifies the integration.
- **Likely involvement:** later platform/API investigation, privacy/product decisions, FE and BE as required. Support is not yet assessed.
- **Attributed feedback:** Yenni specifically requests a sports-watch link (R8). Record watch platforms as research targets, not confirmed integrations.
- **Source comment:** 22.

### T19. Expansion beyond climbing

- Record this as an open product-strategy question, not a feature commitment.
- Clarify whether it means other climbing disciplines or activities outside climbing entirely.
- Revisit after agreeing Bouldy's primary user and demonstrating value in its core climbing experience.
- **Likely involvement:** product/business strategy before engineering.
- **Additional unresolved wording:** Aisyah mentions “plans for alternatives” (R11). Preserve this separately within the strategy discussion until clarified; it may mean something other than new sports.
- **Source comment:** 34.

### T22. Homepage promotions

- Aisyah suggests promotional banners on Home (R11).
- Define the content, audience, editorial owner and desired user action before giving promotions priority over the core session journey.
- **Likely involvement:** product/content, FE and a content/backend source if dynamic. No promotion or external communication is authorised.
- **Source:** attributed summary R11; new to this consolidated record.

### T23. Phone-number collection for cross-selling

- Aisyah suggests collecting phone numbers for cross-selling (R11).
- Keep this separate from T17 phone-number signup. Authentication and marketing contact collection have different purposes.
- Clarify the offer/user benefit, purpose, user choice and handling before any design or data collection. No legal compliance finding is made here.
- **Likely involvement:** product/business, FE and BE if a scoped proposal is later approved.
- **Source:** attributed summary R11; new to this consolidated record.

## Suggested near-term shortlist, subject to team agreement

- Audience and differentiation decision (T1/T2), followed by a simpler logging journey.
- Post-signup tutorial/glossary, revisitable guidance and first-session help (T2).
- Explicit Send/project continuation and defined cancellation (T3/T20).
- End-of-session summary (summary portion of T6).
- Admin-managed Add gym with a defined normal-user selection journey (T4).
- Early dependency assessment for photos, progress/dashboard and private route lists (T7/T5/T21), so the high-demand items can move forward without assuming they are small FE changes.

The summary's own proposed ordering is retained in the [attributed source](./TESTER_FEEDBACK_2026-10-24.md). This consolidated shortlist is a planning recommendation. No dates, estimates or owners are assigned. FE/BE labels are preliminary routing, not a fresh API feasibility audit.

## Original comments and consolidation map

All 34 comments are retained below in their original order. Minor punctuation and spelling are normalised; ambiguity is preserved rather than silently resolved.

1. Options to add photos and videos during session logging. **T7**
2. Hard for beginners to use the application; probably add a guide. **T2**
3. Confusing for non-climbers; jargon needs explanation. **T2**
4. Onboarding after signup, revisit-able later; explain jargon and the app's goals for users. **T2**
5. Another onboarding flow before the first session to explain what users can do. **T2**
6. A feed page for all users' data from other climbers. **T10**
7. Future NFC tag scanning for easy geolocation; QR code. **T16**
8. Sessions versus Climbs is confusing; want performance compared with previous attempts and other users. **T1, T5, T10**
9. UI is good; structure needs a different direction toward a clear goal. **T1**
10. Rate the climb afterward. **T6**
11. Another Send button beside +1 to state that the user finished the route. **T3**
12. Use location to find the closest gym during gym selection. **T8**
13. Gym section should be admin-only, not exposed to normal users. **T4**
14. Starting a session should prompt users about unfinished routes and continuing projects. **T3**
15. Consolidate the UI because some pages are confusing. **T1**
16. Beginner goal selector, probably FE + BE, and progression graphs. **T5; goal introduction also T2**
17. Add date and duration of a climb/session; see growth in the climbing journey. **T5, T6**
18. News feed for future competitions. **T12**
19. Convert Bouldy into a PWA. **T9**
20. Social features: post planned sessions, climbing buddies and related activities. **T11**
21. Dashboard with climbing hours, sends and completed levels. **T5**
22. Explore links to health apps. **T18**
23. Too black and white; more theme choices and layout/content options. **T14**
24. Add a custom boulder colour; admin-only. **T4**
25. Confusing where to go and press; improve flow and user journey. **T1**
26. Guides on the next steps, living in the profile page. **T2**
27. Transcription option for notes after sessions/climbs. **T15**
28. Colour is useful but can be confusing. **T2**
29. After selecting gym and session, show a full consolidated list of “all the gyms,” like suggested routes for users. **T3; wording needs clarification**
30. Embedded Instagram beta videos. **T13**
31. A summary after every session. **T6**
32. Climbing-gym locator. **T8**
33. Signup using a phone number. **T17**
34. Expand outside climbing? **T19**

## Relationship to earlier plans

- The proposed work is now tracked in [Bouldy — Product Planning](https://app.notion.com/p/40376faa3b39812bbf6aecd14595fe63?pvs=204), with a [task board](https://app.notion.com/p/4b6c2168a8ab47289704a345a3ae239c?pvs=204). The board has proposed priorities, team/type tags and dependencies; creating cards did not approve or start implementation. See the [creation snapshot](./notion-backlog/README.md).
- This record supplements the [brainstorm guide](./TEAM_BRAINSTORM_SESSION.md), [FE brief](./FRONTEND_PRODUCT_IMPROVEMENTS.md) and [BE brief](./BACKEND_PRODUCT_IMPROVEMENTS.md).
- It records feedback and a proposed order. Existing specifications and walkthroughs continue to describe the current app until the team approves changes.
- In particular, the new admin-only Gym request and navigation concerns require product decisions before the earlier journeys are revised.

## Additional feedback review status and attribution map

- [Claude source link](https://claude.ai/artifact/9WHpQr8QHX71uTr1GLLfxQ#4133c99e-784f): still requires sign-in in the available browser. The user subsequently pasted the summary, and **that pasted summary is now incorporated**. This is not a claim that the linked artifact was accessed.
- [Attributed source record](./TESTER_FEEDBACK_2026-10-24.md) preserves the supplied names, themes, suggested priorities and unresolved points.
- **R1 onboarding/audience:** T1, T2, T5; the beginner-focus decision remains open.
- **R2 community:** T10, T11, T12; leaderboard request retained under T10.
- **R3 progress:** T5, T6, T10.
- **R4 session flow:** T1, T3, T8, T16, T20; competitor comparison is attributed, not independently verified.
- **R5 media/diary:** T3, T7, T13, T15.
- **R6 Zebo:** T1/T7; preserve positive categorisation feedback and photo urgency.
- **R7 Wei:** T4/T21; admin Add gym and private route list are separate needs.
- **R8 Yenni:** T14/T18; vintage option and sports-watch integration.
- **R9 Bryan:** T2/T3; descriptions, confusing colour cues and the unresolved removed-route button.
- **R10 Afina:** T3/T11; unresolved map-style partner/route view.
- **R11 Aisyah:** T8/T19/T22/T23; locator, ambiguous alternatives, promotions and marketing phone collection.

The earlier 34 comments and their original IDs are preserved above. Repetition across sources is supporting context, not an extra independent vote. PWA, custom admin colours, phone signup and other earlier requests remain even where the later summary does not repeat them.
