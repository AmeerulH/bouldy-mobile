# Bouldy: attributed tester feedback

**Feedback date:** 24 October 2026. **Summary attribution supplied by the user:** @Someone. **Status:** recorded feedback, not approved implementation scope.

The user pasted this summary after the [linked Claude artifact](https://claude.ai/artifact/9WHpQr8QHX71uTr1GLLfxQ#4133c99e-784f) required sign-in. The pasted text is the source used for consolidation; the linked artifact itself has not been independently read. This record normalises the broken table formatting and retains the named attribution and substantive points.

## Overall impression

Zebo and Bryan liked the design and usability. The dominant concern in the supplied summary is confusion for newcomers. Most requests relate to onboarding, social features and visible progress.

## Reported themes

The supplied summary presents these themes in this order. It is a qualitative summary with overlapping mentions, not a measured feature vote or an effort estimate.

### R1. Onboarding and audience: Alif, Bryan, Yenni, Wei; counterpoint from Zebo

- Alif: explain terminology through a glossary after signup; add tutorial screens and personal-goal screens.
- Bryan: add tutorial screens after signup; streamline the confusing UI/journey.
- Wei: streamline the confusing UI and user journey.
- Yenni: included among those reporting onboarding confusion in the supplied summary.
- Zebo: beginners are not the current focus; decide how much to prioritise this audience.

### R2. Community: Zebo, Alif, Yenni

- Zebo: a leaderboard.
- Alif: a homepage feed to find common ground and common climbs.
- Yenni: competition news and climbing groups so beginners can find buddies.

### R3. Progress and performance: Alif, Yenni, Bryan

- Alif: compare performance on each climb with other climbers; give goals clearer structure around ideal climb time, flashing, V-grades and climb ratings.
- Yenni: goal selector, sends dashboard, progress graph and an attempt tracker per project.
- Bryan: end-of-session summary of the day's climbs.

### R4. Session flow: Alif, Wei, Aisyah, Afina; location input from Bryan

- Alif: Sessions versus Climbs is confusing; consider QR/NFC or geolocation for starting sessions.
- Aisyah: no way to cancel a session.
- Wei: an explicit Send button and a prompt about continuing a project.
- Afina: perceived extra steps compared with MadMonkeys. The supplied description is Bouldy “start session → add routes → update to flash,” versus a shorter “log routes” journey in MadMonkeys.
- Bryan: geolocation.

The MadMonkeys comparison is Afina's reported experience, not an independently verified description of that product or a requirement that every route must be added before logging. Its product insight is to examine unnecessary steps and the value received in return.

### R5. Media and diary context: Zebo, Bryan, Afina

- Zebo: photos as soon as possible.
- Bryan: voice recording or transcription, and embedded Instagram/video beta that can be browsed.
- Afina: a personal diary; manual entry currently gives insufficient route context.

## Individual points retained from the summary

### R6. Zebo

Likes the climb categorisation. Photo functionality is the priority.

### R7. Wei

Remove Add gym; admins should handle it. Everyone should have a private route list.

### R8. Yenni

Sports-watch integration. More themes, potentially a vintage option, because the experience feels too black and white.

### R9. Bryan

A button to describe removed routes; colours are useful but confusing; add descriptions. The intended action on removed routes needs clarification.

### R10. Afina

A map-style partner view listing routes. Whether “map” describes a wall/route layout or a people/partner view remains unclear.

### R11. Aisyah

Homepage promotional banners, gym finder/locator, collecting phone numbers for cross-selling, and “plans for alternatives.” The meaning of alternatives needs clarification. Collecting contact information for marketing is a separate request from phone-number authentication.

## Suggested priorities in the supplied summary

- **Described as quick wins:** session cancellation, end-of-session summary, removing Add gym, post-signup tutorial and glossary.
- **High demand:** photos, progress dashboard and private route list.
- **Bigger bets:** feed, leaderboard, climbing groups, geolocation/QR session start, themes and sports-watch integration.

These are the summary's labels. No implementation estimate or API feasibility validation has been performed for them.

## Decisions highlighted by the summary

1. **Beginner focus:** resolve Zebo's audience concern alongside the four reported onboarding-friction mentions. Separate being new to climbing from being new to Bouldy.
2. **Differentiation:** decide what value justifies Bouldy's logging flow, such as useful performance comparison or richer route context, and what steps can be removed.

## Consolidation

See [Team feedback and proposed priorities](./TEAM_FEEDBACK_PRIORITIES.md) for the combined backlog and mapping to workstreams. All earlier 34 comments remain recorded there.
