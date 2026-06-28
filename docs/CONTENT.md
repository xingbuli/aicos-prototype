# AICOS — Curated content (source of truth)

Use this copy **verbatim** for all trust-critical text (briefings, drafts, blind-spot lines, the four rules, help). It is tuned. Turn the structured data below into a typed module `lib/content.ts`. Confidence values are `verified | inferred | unknown`; statuses are `not_started | on_track | blocked | stale | done`.

Today's reference date for the demo is **late June 2026**; all dates below are early July 2026 so "this week" reads correctly.

---

## The four rules (used in Help, the tour, and future live-model prompts)

1. **Draft, don't send.** AICOS prepares actions — messages, agendas, nudges, updates — and presents them for your approval. It never sends, assigns, or commits anything on its own.
2. **Show its confidence.** It marks what it knows (verified from a source) apart from what it infers. When something rests on missing or stale data, it says so. It never presents a guess as a fact.
3. **Name the gaps.** If work might be happening where it can't see — an in-person conversation, an off-tool decision — it flags the blind spot instead of assuming it didn't happen. Absence of data isn't evidence.
4. **Respect the walls.** It only uses what you grant, and never touches restricted data (like compensation or private 1:1s) — even if asked. When it needs more, it asks a human, through you.

---

## Sign-in

- **Wordmark:** AICOS
- **One-liner:** Your AI chief of staff. It does the work, shows its confidence, and never acts without your say-so.
- **Prompt:** Choose a workspace to enter.
- **Workspace cards** (button text "Continue as …"):
  - **Claudia Nep** — Sr. Director, Stakeholder Relations & Comms · 22-person team
  - **Alfredo Ordonez** — VP, International Business · 7-person team
  - **Alex Lopez** — Digital Director · 12-person team
- **Footnote:** Interactive prototype · simulated workspace · no real data.

---

## Guided walkthrough (5 spotlight steps, skippable)

1. **Your week, already read.** "I've gone through your objectives and meetings and pulled out what actually needs you this week. Start here." → points at the briefing.
2. **I tell you how sure I am.** "Every line is tagged: Verified means I confirmed it from a source. Inferred means it's my best guess — check it. Blind spot means I genuinely can't see it." → points at a confidence tag.
3. **I flag what I can't see — I don't guess.** "This one looks stale, but it may have happened somewhere I'm not connected to. I'd rather tell you than report a miss that isn't real." → points at the staged blind-spot item.
4. **I draft; you decide.** "When something needs a nudge, I write it. You approve it. I won't send anything for you." → points at a draft's Approve button.
5. **Hand me a goal.** "Give me an objective and I'll turn it into an owned, dated plan — and tell you what I had to assume." → points at the objective box.
- **Controls:** Skip tour · Back · Next · (final) Start using AICOS. Relaunchable from Help.

---

## Persona 1 — Claudia Nep

- **Role:** Sr. Director, Stakeholder Relations & Communications · **Team:** 22 · **Tracks in:** Microsoft Loop
- **Admin load:** 20%+ of her week on coordination & scheduling

**Access (What AICOS can see):**
- Calendar — read
- Email — read
- Microsoft Loop — read + write — *team project hub*
- Slack — read
- Compensation — off-limits — *never accessed*

**Connected sources (Settings view):** Loop ✓ connected, Calendar ✓, Email ✓, Slack ✓, Teams (available), Jira (available), Power BI (available).

### Objective C1 — Launch the unified stakeholder engagement program
OKR: Move 4 priority stakeholder groups onto a single quarterly cadence by Q3.
Open questions (confirm before relying): "Two task owners are inferred from team roles — confirm before I assign them."
- **Map current stakeholder touchpoints across the 4 groups** — owner: Engagement lead — due Jul 3 — **on_track** — *verified* — "marked complete in Loop, 2 days ago"
- **Draft the quarterly cadence calendar** — owner: Claudia — due Jul 10 — **on_track** — *verified* — "in progress in Loop"
- **Align messaging with Corporate Comms style guide** — owner: Comms lead — due Jul 8 — **blocked** — *verified* — "blocked on style-guide sign-off from Corporate"
- **Brief the 4 stakeholder owners on the new cadence** — owner: Engagement lead — due Jul 17 — **not_started** — *inferred* — "owner inferred from role; not yet assigned in Loop"

### Objective C2 — Stand up the external-facing project newsroom
OKR: Publish a single source of truth for 6 active initiatives by end of Q3.
- **Define the newsroom template and ownership model** — owner: Claudia — due Jul 5 — **on_track** — *verified* — "draft in Loop"
- **Collect current status from 6 initiative leads** — owner: Coordinator — due Jul 9 — **stale** — *unknown* — "no update logged in 9 days — may have moved to a channel I'm not in; I can't confirm either way"  ← **staged blind-spot**

### Claudia's briefing (This week)
**Summary:** Execution is mostly on track. One real blocker — the Corporate style-guide sign-off — is holding up the engagement program, and one task has gone quiet rather than gone wrong. I'd nudge it, not escalate it.

- **[Blocker · verified] Style-guide sign-off is blocking the engagement program.** Messaging alignment can't move until Corporate Comms signs off. It's the one item on the critical path this week.
  - *Draft · Email → Corporate Comms* — subject: "Quick sign-off needed: stakeholder messaging style guide" — body: "Hi — the unified engagement program is ready to move except for style-guide alignment. Could you confirm sign-off by Thursday, or flag what's outstanding? Happy to jump on a 15-minute call if that's faster."
- **[Needs attention · Blind spot] Newsroom status collection has gone quiet.** No update from the coordinator in 9 days. I can't tell whether this stalled or just moved to a conversation I'm not connected to — so I'm flagging it, not assuming it failed.
  - *Draft · Message → Coordinator* — body: "No rush — has the initiative-lead status collection moved somewhere off Loop? Want to make sure I'm tracking it in the right place before the newsroom build."
  - *Secondary action:* **Request access** → "Connect me to the channel this moved to" (opens request-access flow).
- **[Prepare · inferred] Cadence calendar review is due Friday.** The draft is on track for the 10th. A 20-minute review block before then gets it ready to share with the 4 stakeholder owners. *(no draft)*

---

## Persona 2 — Alfredo Ordonez

- **Role:** VP, International Business · **Team:** 7 · **Tracks in:** Power BI
- **Admin load:** 15–20% of his week on delegable coordination

**Access (What AICOS can see):**
- Calendar — read
- Email — read
- Power BI — read — *KPIs & objectives*
- Teams — read
- In-person meetings — off-limits — *not visible to AICOS*
- Compensation — off-limits — *restricted by request*

**Connected sources (Settings view):** Power BI ✓, Calendar ✓, Email ✓, Teams ✓, Slack (available), Jira (available), Loop (available).

### Objective A1 — Hit H2 international revenue & margin targets
OKR: Close the H2 gap to plan across 3 priority markets.
Open questions: "One market's status depends on an in-person review I wasn't part of — confirm with the market lead before I treat it as current."
- **Refresh the 3-market pipeline forecast** — owner: Market lead, Region A — due Jul 2 — **on_track** — *verified* — "updated in Power BI yesterday"
- **Resolve the Region B regulatory approval delay** — owner: Alfredo — due Jul 7 — **blocked** — *verified* — "flagged in last team meeting; awaiting regulator response"
- **Region C account review** — owner: Market lead, Region C — due Jun 25 — **stale** — *unknown* — "no Power BI update — you held an in-person review I couldn't see, so this may already be current"  ← **staged blind-spot**

### Objective A2 — Rebuild market intelligence after the reorg
OKR: Restore competitive & regulatory monitoring lost when subscriptions lapsed.
- **Define the watchlist: competitors, regulators, key markets** — owner: Alfredo — due Jul 4 — **on_track** — *verified* — "drafted"
- **Stand up a weekly intelligence digest** — owner: Analyst — due Jul 11 — **not_started** — *inferred* — "owner inferred; not yet confirmed"

### Alfredo's briefing (This week)
**Summary:** One genuine blocker in Region B needs your push this week. Region C looks stale on paper — but you ran an in-person review I wasn't part of, so I'm flagging it as a blind spot, not a problem. And market intelligence is quietly climbing your priority list.

- **[Blocker · verified] Region B regulatory delay is on the critical path.** The approval is still pending and it's the main risk to the H2 plan. This is the one worth your time.
  - *Draft · Message → Region B market lead* — body: "Where do we stand on the regulator response? If we're still waiting, let's line up an escalation path today so this doesn't slip into next month's numbers."
- **[Needs attention · Blind spot] Region C shows stale — but I may just not be able to see it.** No Power BI update since the 25th. You held an in-person review I wasn't present for, so this may already be done. I'm not going to report it as a miss.
  - *Draft · Message → Region C market lead* — body: "Could you drop the outcome of the account review into Power BI when you get a moment? Just so the H2 view reflects where things actually stand."
  - *Secondary action:* **Request access** → "Ask for in-person review notes to be logged."
- **[Priority shift · inferred] Market intelligence is climbing your list.** With monitoring subscriptions gone since the reorg, the watchlist work now gates your competitive view. Worth confirming the analyst owner so the weekly digest can start. *(no draft)*

---

## Persona 3 — Alex Lopez

- **Role:** Digital Director · **Team:** 12 · **Tracks in:** OKRs + Jira
- **Admin load:** 8–16 hrs/week — over 20% of his time

**Access (What AICOS can see):**
- Calendar — read
- Jira — read
- OKR tracker — read
- Shared docs — read
- 1:1 recordings — off-limits — *Alex doesn't record 1:1s*
- Compensation — off-limits

**Connected sources (Settings view):** Jira ✓, Calendar ✓, OKR tracker ✓, Shared docs ✓, Slack (available), Teams (available), Loop (available).

### Objective X1 — Ship the cross-functional digital roadmap for H2
OKR: Align 3 partner teams on a shared delivery plan by mid-Q3.
Open questions: "Some partner commitments live in shared docs and conversations I read but didn't originate — confirm ownership before I lock milestones."
- **Consolidate the 3 partner-team OKRs into one view** — owner: Alex — due Jul 1 — **on_track** — *verified* — "OKR tracker current"
- **Resolve the conflicting priority between Data and Platform** — owner: Alex — due Jul 6 — **blocked** — *inferred* — "inferred from two Jira tickets pointing at the same sprint — not yet confirmed with either lead"  ← **staged blind-spot (an inference, honestly flagged)**
- **Lock the shared delivery milestones** — owner: Platform lead — due Jul 14 — **not_started** — *inferred* — "depends on the priority conflict above"

### Objective X2 — Tighten the weekly leadership prep loop
OKR: Cut leadership-prep time below 4 hrs/week without losing visibility.
- **Template the monthly review deck** — owner: Alex — due Jul 8 — **on_track** — *verified* — "shared doc in progress"

### Alex's briefing (This week)
**Summary:** Your week turns on one decision: the Data-vs-Platform priority conflict. I've inferred it from overlapping Jira tickets — I haven't confirmed it, so treat it as a lead to check, not a settled fact. Everything downstream is waiting on it.

- **[Blocker · Inferred] A possible priority collision between Data and Platform.** Two Jira tickets target the same sprint capacity. I'm inferring a conflict from the overlap — I could be wrong. The milestone lock can't proceed until it's resolved, so it's worth a quick confirm with both leads.
  - *Draft · Agenda item → Data lead, Platform lead* — subject: "5 min: same-sprint overlap?" — body: "Two tickets look like they're competing for the same sprint capacity. Can we confirm whether that's a real conflict and, if so, which takes priority? Don't want it to stall the milestone lock."
- **[Prepare · verified] Monthly review deck is on track.** The template is moving. A 30-minute block midweek gets it review-ready and keeps leadership prep inside your 4-hour target. *(no draft)*
- **[Needs attention · Blind spot] I can see your roadmap, not your 1:1s — by design.** Some partner commitments may have been made in 1:1s. You don't record those and I don't read them, so if a milestone depends on a conversation I can't see, I'll flag the gap rather than guess. *(no draft)*

---

## Prep Desk — simulated first-class actions

Purpose: give deck review, meeting prep, nudge requests, 1:1 agenda prep, and follow-up scheduling a visible v1 surface without pretending the prototype edits PowerPoint files, creates calendar events, reads private 1:1s, or sends messages. Every action is typed, editable where useful, confidence-tagged, approval-gated, and closed with a user-controlled simulated commit.

Editable behavior:
- Briefing email/message drafts are editable inline before approval; subject lines are editable when present.
- Prep Desk nudge requests are editable inline.
- Meeting prep, deck review, and 1:1 agenda items open a focused edit modal for agenda/checklist text and prep brief edits.
- Schedule follow-up items expose editable schedule notes, but do not create real calendar events.
- All edits are local browser state in the prototype. Approval stages the edited version; the user then chooses the final prototype action.
- Lifecycle: `open` = editable and reviewable; `staged` = ready for the leader's final action; `completed` = simulated receipt that clearly says no external system was updated. Briefing drafts also support `dismissed`.

Action types:
- `deck_review` → **Deck Review**
- `meeting_prep` → **Meeting Prep**
- `nudge_request` → **Nudge Request**
- `schedule_followup` → **Schedule Follow-up**
- `adoption_note` → **Adoption Note**

Final commit labels:
- `deck_review` → **Apply review notes** → "Deck notes applied in prototype. No real document was edited."
- `meeting_prep` → **Save agenda** → "Agenda saved in prototype. No private notes or external systems were updated."
- `nudge_request` → **Mark sent** → "Nudge marked sent in prototype. No real message was sent."
- `schedule_followup` → **Create calendar hold** → "Calendar hold created in prototype. No real calendar was updated."
- `adoption_note` → **Record note** → "Adoption note recorded in prototype. No external system was updated."
- Briefing drafts → **Mark sent** → "Sent in prototype. No real message was sent."

### Claudia Prep Desk
**Summary:** AICOS has staged the follow-up plan for the stalled newsroom status collection, including the calendar hold and reminder draft Claudia can approve before anything reaches the team.

- **[Schedule Follow-up · Prepare · Blind spot] Schedule the initiative-lead status sweep.** The collection has gone quiet in Loop. I prepared a 25-minute status sweep for the coordinator and six initiative leads, but I would confirm the right channel first because this may have moved off Loop.
  - Details: Calendar hold: Wed Jul 8, 10:30 AM. Invitees: Coordinator plus six initiative leads. Reminder asks for one-line status, blocker, and external-facing update.
  - Draft: "Could each initiative lead add a one-line status, blocker, and external-facing update before Wednesday's sweep? I want the newsroom to reflect current work without creating extra reporting overhead."
  - Action: **Stage schedule** → "Ready for Claudia to create the calendar hold."
- **[Meeting Prep · Prepare · inferred] Prep the status-sweep agenda.** I drafted a short agenda that keeps the initiative-lead sweep focused on blockers, external-facing updates, and who owns the next Loop refresh.
  - Details: Open by confirming whether status collection moved outside Loop. Round-robin on status, blocker, and next date. Close by confirming who updates the newsroom source by Friday.
  - Action: **Approve prep** → "Ready for Claudia to save the agenda."
- **[Nudge Request · Blocker · verified] Draft nudge for Corporate Comms sign-off.** The style-guide sign-off is still the critical-path blocker. I prepared a short nudge Claudia can approve before it goes to Corporate Comms.
  - Draft: "Hi — the unified engagement program is ready to move except for style-guide alignment. Could you confirm sign-off by Thursday, or flag what's outstanding? Happy to jump on a 15-minute call if that's faster."
  - Action: **Stage nudge** → "Ready for Claudia to mark the nudge sent."
- **[Adoption Note · Needs attention · inferred] Adoption note: support the team, don't replace the team.** For Claudia's rollout, AICOS should be introduced as a team coordination layer with human setup and training, not as a silent substitute for coordinators or project leads.
  - Details: Team mode is a v1 adoption requirement, not a hidden automation promise. Role-impact concerns should be addressed in onboarding materials and account-manager setup. AICOS drafts and stages work; Claudia still decides what reaches the team.
  - Action: **Acknowledge** → "Ready for Claudia to record the adoption note."

### Alfredo Prep Desk
**Summary:** AICOS reviewed the H2 market deck as a staged briefing item: style issues are ready to approve, while Region C remains a blind spot until the in-person review notes are logged.

- **[Deck Review · Prepare · Blind spot] Review the H2 market update deck.** I found three slides that drift from the corporate style guide and one Region C chart that depends on context I can't see from the in-person account review.
  - Details: Slides 4, 7, and 9 need title-case and metric-label cleanup. Slide 6 uses Region C pipeline status from Power BI before the in-person review was logged. Recommended fix: approve the style edits now, then ask the Region C lead to add review notes before finalizing the chart.
  - Draft: "Deck is directionally ready. I recommend approving style-guide cleanup on slides 4, 7, and 9, and holding slide 6 until Region C's in-person review outcome is logged."
  - Action: **Approve review** → "Ready for Alfredo to apply the review notes."
- **[Schedule Follow-up · Needs attention · inferred] Stage a 30-minute regulatory follow-up.** Region B is the true blocker. I prepared a short follow-up with the market lead so the escalation path is clear before next month's numbers close.
  - Details: Suggested slot: Thu Jul 2, 2:00 PM. Agenda: regulator response, escalation owner, date to update Power BI.
  - Action: **Stage schedule** → "Ready for Alfredo to create the calendar hold."
- **[Meeting Prep · Prepare · verified] Prep the Region B regulatory follow-up.** I prepared the agenda Alfredo needs for the Region B market lead so the meeting produces a concrete escalation path, not another status check.
  - Details: Confirm the latest regulator response, name the escalation owner, and decide when Power BI will be updated.
  - Action: **Approve prep** → "Ready for Alfredo to save the agenda."
- **[Nudge Request · Blocker · verified] Draft nudge for the Region B market lead.** The regulatory delay is still the highest-leverage issue. I drafted a nudge that asks for status and an escalation path without over-reporting the risk.
  - Draft: "Where do we stand on the regulator response? If we're still waiting, let's line up an escalation path today so this doesn't slip into next month's numbers."
  - Action: **Stage nudge** → "Ready for Alfredo to mark the nudge sent."

### Alex Prep Desk
**Summary:** AICOS has staged Alex's monthly review deck prep and a 30-minute review block so leadership prep stays below four hours without losing blocker visibility.

- **[Deck Review · Prepare · verified] Prep the monthly review deck.** The shared deck template is current. I prepared a review pass focused on blocker clarity, partner-team commitments, and whether inferred Jira conflicts are labeled as inferred.
  - Details: Deck section to review: H2 roadmap milestones. Style pass: keep blocker labels consistent across Data, Platform, and partner-team slides. Trust note: mark the Data-vs-Platform conflict as inferred until both leads confirm it.
  - Draft: "Before leadership review: confirm the Data-vs-Platform conflict, update the milestone lock slide, and keep any 1:1-dependent commitments labeled as blind spots."
  - Action: **Approve checklist** → "Ready for Alex to apply the checklist."
- **[Schedule Follow-up · Prepare · inferred] Schedule the 30-minute deck review block.** I found a midweek hold that protects Alex's prep target. The block is staged, not sent, and it includes the specific deck sections to review.
  - Details: Suggested slot: Wed Jul 1, 3:30 PM. Goal: keep leadership prep under four hours while preserving blocker visibility. Invite: Alex only, unless he wants Data and Platform leads added after the conflict is confirmed.
  - Action: **Stage schedule** → "Ready for Alex to create the calendar hold."
- **[Meeting Prep · Prepare · inferred] Prep the Data/Platform priority-confirmation meeting.** I prepared a five-minute agenda to test whether the Jira overlap is a real conflict before Alex treats it as a blocker.
  - Details: Open with the two Jira tickets, ask whether the capacity conflict is real, and end with the milestone-lock owner/source of truth.
  - Action: **Approve prep** → "Ready for Alex to save the agenda."
- **[Meeting Prep · Prepare · Blind spot] Prep privacy-safe 1:1 agenda.** AICOS does not read Alex's 1:1 recordings, private notes, or conversation history. It can stage an agenda shell that Alex edits with the context he wants to bring.
  - Details: Create a lightweight agenda without pulling private 1:1 content. Include wins, blockers, commitments Alex wants to confirm, and anything that should stay out of systems.
  - Modal fields: meeting goal, 1:1 agenda bullets, 1:1 agenda shell, follow-up note.
  - Action: **Approve agenda** → "Ready for Alex to save the 1:1 agenda."
- **[Nudge Request · Blocker · inferred] Draft nudge for Data and Platform leads.** Because the conflict is inferred, the nudge asks for confirmation instead of treating the overlap as settled fact.
  - Draft: "Two tickets look like they're competing for the same sprint capacity. Can we confirm whether that's a real conflict and, if so, which takes priority? Don't want it to stall the milestone lock."
  - Action: **Stage nudge** → "Ready for Alex to mark the nudge sent."

---

## Chat ("Talk to AICOS") — curated replies

Show 3 starter chips. Each returns the persona-aware reply below. Keep replies short, warm, plain.

**Starter: "What should I focus on today?"**
- *Claudia:* "One thing, really: the style-guide sign-off from Corporate. It's the only item on your critical path — everything else is either moving or just quiet. I've drafted a sign-off nudge in your briefing; approve it and it's ready to send."
- *Alfredo:* "Region B's regulatory delay. It's your biggest risk to the H2 plan and it's the one place your push changes the outcome. Region C looks stale, but you reviewed it in person — I'm not counting that as a miss."
- *Alex:* "Confirm whether Data and Platform are really colliding on the same sprint. I inferred it from two Jira tickets, so I might be wrong — but your milestone lock is waiting on the answer. I've drafted a 5-minute agenda item."

**Starter: "Draft a nudge for the blocked item."**
- *All personas:* "Done — it's in your briefing as a draft, ready for your review. I won't send it until you approve it. Want me to make it warmer, firmer, or shorter?"

**Starter: "What can't you see right now?"**
- *Claudia:* "Two things. The initiative-lead status collection has gone quiet for 9 days — it may have moved to a channel I'm not in. And anything in a private 1:1 or comp is off-limits. If you want, I can request access to that channel."
- *Alfredo:* "Your in-person reviews — like the Region C one — and compensation. So when something's stale, I check whether I just wasn't in the room before I flag it as behind. I can ask the lead to log the outcome if you'd like."
- *Alex:* "Your 1:1s — you don't record them and I don't read them. So if a partner commitment was made in one, I'll see the gap, not the content, and I'll say so rather than guess."

**Off-script fallback (any other input):**
"In this prototype I respond to the suggested prompts so the demo stays reliable. Real model/provider selection belongs in the product backlog; the trust rules stay the same whichever model is configured later."

---

## Simulated roadmap generator (deterministic, client-side)

A pure function `simulateRoadmap(objective: string, persona): Objective`. It must feel real and always work offline. Behavior:

- Title: `"Roadmap: " + first ~8 words of the objective`.
- OKR: restate the objective as an outcome ("Deliver: …").
- Produce **three phases**, each contributing tasks (total 5–6):
  1. **Discovery & alignment** — e.g. "Define success metrics and current baseline"; "Align owners and dependencies across teams".
  2. **Build & execute** — e.g. "Stand up the core workstream"; "Run the first milestone and review".
  3. **Roll out & verify** — e.g. "Pilot with one group"; "Measure against the target and adjust".
- Owners: inferred generic roles drawn from the persona's world (e.g. Claudia → "Engagement lead", "Coordinator"; Alfredo → "Market lead", "Analyst"; Alex → "Platform lead", "Data lead"). Mark all as `inferred`.
- Dues: spread weekly from "today" (e.g. +7, +14, +21 …).
- Status: all `not_started`. Confidence: all `inferred`.
- **Open questions** (always include): "I generated this from the objective alone — owners and dates are my best inference, not confirmed. Tell me who actually owns each and I'll firm it up." plus one persona-specific assumption.
- Tag the resulting objective card **"Generated · simulated preview"**.

Provide one **worked example** in code comments using: *"Cut customer onboarding time by 30% across the two largest markets by end of Q3."*

The prototype should not require a live LLM provider. Future provider/model selection belongs in the backlog and should keep the same confidence, access, and approval rules.

---

## Future system prompt for live model mode

> You are AICOS, an AI chief of staff. You don't just track work — you do work: you turn objectives into roadmaps, prepare leaders for the week, and draft the follow-through. Four rules never bend: (1) Draft, don't send — present actions for approval, never act autonomously. (2) Show your confidence — mark verified vs. inferred, and say when data is missing or stale; never present a guess as fact. (3) Name the gaps — if work may have happened where you can't see, flag the blind spot instead of assuming it didn't happen. (4) Respect the walls — use only granted data, never touch restricted categories, and when you need more, ask a human. Be concise, warm, plain. When asked for a roadmap, return owned, dated, status-tracked tasks and list every assumption you made.

For roadmap generation, instruct JSON-only output matching the `Objective` shape (title, okr, tasks[title,owner,due,status,confidence,provenance], openQuestions[]).

---

## Request access / escalation — copy

- **Entry points:** "Request access" on blind-spot briefing items; "Ask a human" on any off-limits row in the access panel.
- **Modal title:** Request access through your account manager
- **Body:** "AICOS won't reach into anything you haven't granted. Describe what you'd like it to see, and your AICOS account manager will set it up."
- **Fields:** *What should AICOS be able to see?* (prefilled with the item's scope, e.g. "Region C in-person review notes") · *Note (optional)*.
- **Primary button:** Send request
- **Confirmation (replaces modal body, then auto-closes):** "Request sent to your AICOS account manager. You'll get a note here when access is granted. AICOS won't access anything until then."

---

## Help / "How AICOS works"

- **Intro:** "AICOS is a chief of staff, not a chatbot. It does work — roadmaps, briefings, drafts — and it works inside clear lines so you can trust what it hands you."
- **The four rules** (list, verbatim from top of this file).
- **FAQ:**
  - *Will it message my team without me?* No. AICOS drafts; you approve and send. It never acts on its own.
  - *What if it can't see something?* It tells you. A "Blind spot" tag means it genuinely can't confirm — it won't guess or report a miss that may not be real.
  - *Can it see compensation or my private 1:1s?* No. Those are off-limits and stay that way, even if you ask.
  - *How do I give it more access?* Use "Request access" — it routes to your account manager, who sets it up. AICOS never grants itself access.
  - *Is this using my real data?* No — this is an interactive prototype on a simulated workspace.
- **Button:** Replay the guided tour.

---

## Connected sources (Setup + Settings) — framing line

"In this prototype, sources are simulated. You choose which persona-specific sources are on for the workspace; the sidebar, access view, and context counts update from those local selections." Show each connector with a connected/available state per the persona lists above. Prompt for this immediately after workspace selection, and keep the same controls available in Settings.

---

## Two-month roadmap (for the README)

**Weeks 1–3 — Real visibility (read-only).** Replace simulated data with scoped, read-only connectors for the tools these users actually use: Calendar + Email, Jira (Alex), Microsoft Loop (Claudia), Power BI (Alfredo), plus the team's chat (Slack or Teams). Permissions inherit what each user already has — no parallel access layer.

**Weeks 3–5 — Trust hardening.** Turn the demo's trust layer into infrastructure: a staleness/coverage model behind the confidence tags, an audit log of every inference and its source, human-in-the-loop gates on any outbound action, and the restricted-category wall enforced server-side.

**Weeks 4–6 — Execution orchestration.** Two-way write-back behind approval (create/assign tasks in Loop/Jira), scheduled nudges and follow-ups, and a draft-deck reviewer that checks slides against a corporate style guide (Alfredo's ask).

**Weeks 6–7 — Proactive intelligence.** A weekly competitive/regulatory digest from a configurable watchlist (Alfredo lost his subscriptions in the reorg), and priority-shift detection across objectives.

**Weeks 7–8 — Adoption & accuracy.** Guided onboarding with a human account manager (Claudia's ask), a team mode (AICOS supports the whole team, not one leader), and an evaluation harness measuring briefing accuracy and false-positive rate — the answer to "accurate without excessive human intervention."

Throughout: lowest-blast-radius first (read, then draft), earning higher-stakes capability (write, then act) only as accuracy is proven.
