# Bouldy team brainstorm

**Session guide · 24 October 2026 · Suggested duration: 2 hours**

**Purpose:** agree who Bouldy is for, the problems it should solve, what belongs in the next release, and how the team will deliver it. Make room for ideas outside the existing plan.

**Leave with:** one agreed product statement, up to three near-term outcomes, a prioritised backlog, a rough 12-month direction, and named owners for the next actions.

This is a discussion guide, not an approved scope or delivery commitment. The existing FE and BE briefs were prepared on 3 October; confirm what has changed before assigning work.

## Before starting

- Choose one facilitator, one note-taker and one person to keep time. One person can cover more than one role.
- Open the current app and the FE/BE plans. Use a shared document or board everyone can contribute to.
- Create five areas: **Decisions**, **Ideas**, **Open questions**, **Later**, and **Actions**.
- Agree that today's goal is to make decisions, not to finish designing every feature.

If you only have 60 minutes, use half the time shown for each section. Keep the final ownership discussion.

## 1. Agree on the purpose — 15 minutes

Start with two minutes of individual writing, then hear from everyone before discussing.

Ask:

- Who should get the most value from our first release: casual climbers, regular project climbers, competitive climbers, or gym operators?
- What frustrating part of their climbing routine should Bouldy improve?
- Why would they use it during their next gym visit and return afterward?
- What should we deliberately leave outside the first release?

**Starting point from the existing plan:** a mobile climbing journal that makes logging quick, preserves progress across visits and wall resets, and may grow into an optional climbing community.

Treat that as a proposal to confirm or change. Decide whether personal progress, community, competition or gym operations is the main focus for the next release. Other goals can stay on the roadmap.

**Record:** “Bouldy helps [primary user] to [main job], so they can [valuable outcome].”

## 2. Walk through the app together — 15 minutes

Have someone act as a climber using Bouldy for a real gym visit:

1. Find their gym and start a session.
2. Find or add a route and record attempts.
3. Record a send, correct a mistake and add a note.
4. Return on another day and continue a project.
5. Review their progress after the gym resets its wall.

Ask where the journey becomes confusing, slow, incomplete or untrustworthy. Capture the problem first, then possible solutions.

Separate what is available in the shared app from local work and planned work. The earlier FE handoff records local improvements to compact cards, private notes, own profile, route history, continuing projects and gym route editing; the team should confirm their current release status.

**Record:** the three most important problems in the current journey.

## 3. Collect new ideas — 20 minutes

Give everyone five quiet minutes to write ideas independently. Use one idea per note. Then go around the room, taking one idea from each person at a time. Clarify ideas before debating them.

Prompts:

- What would make you personally use Bouldy every climbing session?
- What do you currently track in your head, notes, photos or another app?
- What would help beginners? What would help regular climbers?
- What would make climbing with friends better?
- What would make a gym want to support or use Bouldy?
- What is missing from the existing plan?
- Which existing feature or idea could we simplify or remove?

For each idea, capture:

> **User/problem:** …  
> **Proposed idea:** …  
> **Why it matters / evidence:** …  
> **How we could test demand:** …

Do not reject an idea because the current backend cannot support it. Record that dependency when prioritising.

**Record:** a combined idea list, with duplicates grouped and new proposals clearly identified.

## 4. Choose what matters next — 25 minutes

Group ideas around user outcomes, such as a better journal, useful climbing context, community, competition or gym operations. Add another group if the discussion reveals a different need.

Give each person three votes for the problems they believe matter most. Voting opens the discussion; it does not automatically decide the roadmap. Discuss why the leading problems matter and who benefits.

Assess the leading ideas using these questions:

- **Value:** will this improve a common or important part of climbing?
- **Evidence:** have climbers asked for it or struggled without it?
- **Effort:** small, medium, large or unknown? FE and BE may differ.
- **Dependencies:** existing APIs, new backend work, product decision, external service or supplied content?
- **Confidence:** can we build it now, or should we first test an assumption?

Sort the ideas into:

- **Next release:** essential to the agreed experience; choose a small set the team can finish.
- **Next experiment:** promising, but needs interviews, a prototype or a technical investigation.
- **Later:** valuable after other work or after the team learns more.
- **Out of scope for now:** consciously excluded, with a short reason.

Include necessary reliability and permission work even if it attracts fewer votes than visible features. A feature depending on new backend work should have a named dependency owner, not an assumed delivery date.

**Record:** up to three near-term outcomes and the smallest set of work needed to deliver them.

## 5. Sketch the next 12 months — 20 minutes

Plan in outcomes first. The following is a starting proposal from the existing product direction, not a promise to implement every stage.

**Months 1–3: make the core journal worth returning to.**

Finish and validate the climbing-session journey. Confirm history, corrections, private notes, permissions and progress tracking work reliably. Recruit a small group of real climbers and watch them use it across repeat visits.

**Months 4–6: deepen personal value.**

Use feedback to choose the most valuable additions: profile editing, gym-specific grades, better progress summaries or route photos. Settle privacy and ownership rules before introducing sharing.

**Months 7–9: test one reason to use Bouldy together.**

Choose one community experiment, such as sharing beta, a friend challenge or gym-local rankings. Keep it small enough to learn whether people use it. Competitive features need agreed scoring and trustworthy data first.

**Months 10–12: expand what has proved useful.**

Improve the successful experiment or redirect effort to the journal if that is where users find value. Consider wider gym participation, partnerships or a business model once there is evidence of demand. Global rankings and full gym-operator tools remain options, not automatic commitments.

For each period, agree:

- What should be better for the user?
- What evidence would tell us it worked?
- What must be true before we start?
- When will we review, continue or change direction?

Pick a few useful measures: completion of a first logged session, return use on a later visit, repeat weekly logging, or the number of users reporting a specific problem solved. Agree numerical targets after checking the starting baseline. Decide what measurement work is needed.

**Record:** a tentative 12-month direction and a date to revisit it. Discuss whether the team also wants a separate calendar-year 2027 plan.

## 6. Turn decisions into work — 25 minutes

For each chosen item, write a short work brief:

> **Outcome / problem:** …  
> **Smallest useful delivery:** …  
> **Done when:** observable user behaviour or acceptance checks …  
> **FE work:** …  
> **BE work:** …  
> **Decision, content or external dependency:** …  
> **Effort and uncertainty:** …  
> **Accountable owner / collaborators:** …  
> **First step / review date:** …

Agree the shared behaviour and data needed before FE and BE build dependent parts separately. Frontend work that uses existing contracts can proceed independently. Unknown feasibility becomes a short investigation with a specific question to answer.

Choose a realistic amount of work for the next two weeks based on who is actually available. Each item gets one accountable owner, even when several people contribute. End with a quick read-back of decisions and actions.

**Record:** named owners, the first delivery or investigation for each item, and the next team check-in.

## Decisions to settle before leaving

- Who is the primary user, and what is Bouldy's main promise?
- What are the next release's essential journeys and explicit exclusions?
- Which new ideas should we build, test or defer?
- Who can add, edit and retire gym routes?
- What stays private, and what could be shared by choice?
- Are rankings or competition important now, or should they wait?
- Who owns product decisions, FE, BE, design and user testing?
- What can each person realistically contribute over the next two weeks?
- Who will turn today's decisions into the updated plan, and by when?
- When will we review progress and user feedback together?

## After the session

**By the next day:** the note-taker consolidates the decisions, unresolved questions and action list. The product owner updates the agreed scope, and FE/BE owners confirm dependencies and acceptance checks.

**Within one week:** begin the selected work, resolve the highest-risk unknowns and organise the first user feedback sessions.

**At the two-week check-in:** demonstrate what works, review what was learned and adjust the next small batch of work. Update the plan when evidence changes it.

## Reference documents

- [Team feedback and proposed priorities: 24 October](./TEAM_FEEDBACK_PRIORITIES.md)
- [Attributed tester summary: names, themes and suggested priorities](./TESTER_FEEDBACK_2026-10-24.md)
- [Visual app walkthrough: screenshots and feature flows](./visual-walkthrough/bouldy-visual-walkthrough.html)
- [Shareable visual walkthrough PDF](../output/pdf/bouldy-visual-walkthrough.pdf)
- [Frontend improvement plan](./FRONTEND_PRODUCT_IMPROVEMENTS.md)
- [Backend improvement plan](./BACKEND_PRODUCT_IMPROVEMENTS.md)
- [Local frontend handoff and previous validation](./FE_LOCAL_HANDOFF.md)
- [Product specification](../MASTER_SPEC.md)

Existing documents are inputs to the discussion. Today's agreed decisions should become the updated product plan; this guide does not override those decisions.
