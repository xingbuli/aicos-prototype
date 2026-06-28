export const FOUR_RULES = [
  {
    title: "Draft, don't send.",
    body:
      "AICOS prepares actions — messages, agendas, nudges, updates — and presents them for your approval. It never sends, assigns, or commits anything on its own.",
  },
  {
    title: "Show its confidence.",
    body:
      "It marks what it knows (verified from a source) apart from what it infers. When something rests on missing or stale data, it says so. It never presents a guess as a fact.",
  },
  {
    title: "Name the gaps.",
    body:
      "If work might be happening where it can't see — an in-person conversation, an off-tool decision — it flags the blind spot instead of assuming it didn't happen. Absence of data isn't evidence.",
  },
  {
    title: "Respect the boundaries.",
    body:
      "It only uses what you grant, and never touches restricted data (like compensation or private 1:1s) — even if asked. When it needs more, it asks a human, through you.",
  },
];

export const TOUR_STEPS = [
  {
    target: "briefing",
    title: "Your week, already read.",
    body:
      "I've gone through your objectives and meetings and pulled out what actually needs you this week. Start here.",
  },
  {
    target: "confidence",
    title: "I tell you how sure I am.",
    body:
      "Every line is tagged: Verified means I confirmed it from a source. Inferred means it's my best guess — check it. Blind spot means I genuinely can't see it.",
  },
  {
    target: "blindspot",
    title: "I flag what I can't see — I don't guess.",
    body:
      "This one looks stale, but it may have happened somewhere I'm not connected to. I'd rather tell you than report a miss that isn't real.",
  },
  {
    target: "draft",
    title: "I draft; you decide.",
    body:
      "When something needs a nudge, I write it. You approve it. I won't send anything for you.",
  },
  {
    target: "objective",
    title: "Hand me a goal.",
    body:
      "Give me an objective and I'll turn it into an owned, dated plan — and tell you what I had to assume.",
  },
];

export const CHAT_STARTERS = [
  "What should I focus on today?",
  "Draft a nudge for the blocked item.",
  "What can't you see right now?",
];

export const CHAT_FALLBACK =
  "In this prototype I respond to the suggested prompts so the demo stays reliable. Want me to answer anything you type? Add your own AI model in Settings → Bring your own AI, and I'll run live — same four rules.";

export const personas = [
  {
    id: "claudia",
    name: "Claudia Nep",
    role: "Sr. Director, Stakeholder Relations & Communications",
    cardRole: "Sr. Director, Stakeholder Relations & Comms",
    team: 22,
    tracksIn: "Microsoft Loop",
    adminLoad: "20%+ of her week on coordination & scheduling",
    objectivePrompt: "Launch a quarterly stakeholder cadence for the four highest-priority groups.",
    generatorOwners: ["Engagement lead", "Coordinator", "Comms lead", "Claudia"],
    generatorAssumption:
      "I assumed Microsoft Loop remains the source of truth and that the Engagement lead owns cross-stakeholder coordination.",
    access: [
      { source: "Calendar", level: "read", state: "connected" },
      { source: "Email", level: "read", state: "connected" },
      { source: "Microsoft Loop", level: "read + write", state: "connected", note: "team project hub" },
      { source: "Slack", level: "read", state: "connected" },
      { source: "Compensation", level: "off-limits", state: "off", note: "never accessed" },
    ],
    connectors: [
      { source: "Loop", state: "connected" },
      { source: "Calendar", state: "connected" },
      { source: "Email", state: "connected" },
      { source: "Slack", state: "connected" },
      { source: "Teams", state: "available" },
      { source: "Jira", state: "available" },
      { source: "Power BI", state: "available" },
    ],
    objectives: [
      {
        id: "c1",
        title: "Launch the unified stakeholder engagement program",
        okr: "Move 4 priority stakeholder groups onto a single quarterly cadence by Q3.",
        openQuestions: [
          "Two task owners are inferred from team roles — confirm before I assign them.",
        ],
        tasks: [
          {
            title: "Map current stakeholder touchpoints across the 4 groups",
            owner: "Engagement lead",
            due: "Jul 3",
            status: "on_track",
            confidence: "verified",
            provenance: "marked complete in Loop, 2 days ago",
          },
          {
            title: "Draft the quarterly cadence calendar",
            owner: "Claudia",
            due: "Jul 10",
            status: "on_track",
            confidence: "verified",
            provenance: "in progress in Loop",
          },
          {
            title: "Align messaging with Corporate Comms style guide",
            owner: "Comms lead",
            due: "Jul 8",
            status: "blocked",
            confidence: "verified",
            provenance: "blocked on style-guide sign-off from Corporate",
          },
          {
            title: "Brief the 4 stakeholder owners on the new cadence",
            owner: "Engagement lead",
            due: "Jul 17",
            status: "not_started",
            confidence: "inferred",
            provenance: "owner inferred from role; not yet assigned in Loop",
          },
        ],
      },
      {
        id: "c2",
        title: "Stand up the external-facing project newsroom",
        okr: "Publish a single source of truth for 6 active initiatives by end of Q3.",
        openQuestions: [],
        tasks: [
          {
            title: "Define the newsroom template and ownership model",
            owner: "Claudia",
            due: "Jul 5",
            status: "on_track",
            confidence: "verified",
            provenance: "draft in Loop",
          },
          {
            title: "Collect current status from 6 initiative leads",
            owner: "Coordinator",
            due: "Jul 9",
            status: "stale",
            confidence: "unknown",
            provenance:
              "no update logged in 9 days — may have moved to a channel I'm not in; I can't confirm either way",
          },
        ],
      },
    ],
    briefing: {
      summary:
        "Execution is mostly on track. One real blocker — the Corporate style-guide sign-off — is holding up the engagement program, and one task has gone quiet rather than gone wrong. I'd nudge it, not escalate it.",
      items: [
        {
          id: "claudia-style",
          kind: "blocker",
          confidence: "verified",
          title: "Style-guide sign-off is blocking the engagement program.",
          body:
            "Messaging alignment can't move until Corporate Comms signs off. It's the one item on the critical path this week.",
          draft: {
            type: "Email",
            to: "Corporate Comms",
            subject: "Quick sign-off needed: stakeholder messaging style guide",
            body:
              "Hi — the unified engagement program is ready to move except for style-guide alignment. Could you confirm sign-off by Thursday, or flag what's outstanding? Happy to jump on a 15-minute call if that's faster.",
          },
        },
        {
          id: "claudia-newsroom",
          kind: "attention",
          confidence: "unknown",
          title: "Newsroom status collection has gone quiet.",
          body:
            "No update from the coordinator in 9 days. I can't tell whether this stalled or just moved to a conversation I'm not connected to — so I'm flagging it, not assuming it failed.",
          draft: {
            type: "Message",
            to: "Coordinator",
            body:
              "No rush — has the initiative-lead status collection moved somewhere off Loop? Want to make sure I'm tracking it in the right place before the newsroom build.",
          },
          secondaryAction: {
            label: "Request access",
            scope: "Connect me to the channel this moved to",
          },
        },
        {
          id: "claudia-cadence",
          kind: "prep",
          confidence: "inferred",
          title: "Cadence calendar review is due Friday.",
          body:
            "The draft is on track for the 10th. A 20-minute review block before then gets it ready to share with the 4 stakeholder owners.",
        },
      ],
    },
    prepDesk: {
      summary:
        "AICOS has staged the follow-up plan for the stalled newsroom status collection, including the calendar hold and reminder draft Claudia can approve before anything reaches the team.",
      items: [
        {
          id: "claudia-status-followup",
          actionType: "schedule_followup",
          kind: "prep",
          confidence: "unknown",
          title: "Schedule the initiative-lead status sweep.",
          body:
            "The collection has gone quiet in Loop. I prepared a 25-minute status sweep for the coordinator and six initiative leads, but I would confirm the right channel first because this may have moved off Loop.",
          details: [
            "Calendar hold: Wed Jul 8, 10:30 AM.",
            "Invitees: Coordinator plus six initiative leads.",
            "Reminder asks for one-line status, blocker, and external-facing update.",
          ],
          draft: {
            label: "Reminder draft",
            body:
              "Could each initiative lead add a one-line status, blocker, and external-facing update before Wednesday's sweep? I want the newsroom to reflect current work without creating extra reporting overhead.",
          },
          actionLabel: "Stage schedule",
          resolvedLabel: "Schedule staged. AICOS will wait for Claudia to send the invite and reminder.",
          secondaryAction: {
            label: "Request access",
            scope: "Channel where initiative-lead status collection moved",
          },
        },
        {
          id: "claudia-status-meeting-prep",
          actionType: "meeting_prep",
          kind: "prep",
          confidence: "inferred",
          title: "Prep the status-sweep agenda.",
          body:
            "I drafted a short agenda that keeps the initiative-lead sweep focused on blockers, external-facing updates, and who owns the next Loop refresh.",
          details: [
            "Opening question: has status collection moved outside Loop?",
            "Round-robin: one-line status, blocker, and next date from each initiative lead.",
            "Close: confirm who updates the newsroom source of truth by Friday.",
          ],
          draft: {
            label: "Meeting prep brief",
            body:
              "Use the sweep to confirm whether the work moved off Loop, collect each initiative lead's status/blocker/update, and assign one owner to refresh the newsroom source by Friday.",
          },
          actionLabel: "Approve prep",
          resolvedLabel: "Meeting prep approved. AICOS will keep the agenda staged for Claudia.",
        },
        {
          id: "claudia-style-nudge",
          actionType: "nudge_request",
          kind: "blocker",
          confidence: "verified",
          title: "Draft nudge for Corporate Comms sign-off.",
          body:
            "The style-guide sign-off is still the critical-path blocker. I prepared a short nudge Claudia can approve before it goes to Corporate Comms.",
          details: [
            "Recipient: Corporate Comms.",
            "Ask: confirm sign-off by Thursday or identify what is outstanding.",
            "Tone: direct, low-friction, and framed around moving the engagement program forward.",
          ],
          draft: {
            label: "Nudge draft",
            body:
              "Hi — the unified engagement program is ready to move except for style-guide alignment. Could you confirm sign-off by Thursday, or flag what's outstanding? Happy to jump on a 15-minute call if that's faster.",
          },
          actionLabel: "Stage nudge",
          resolvedLabel: "Nudge staged. AICOS will wait for Claudia before anything is sent.",
        },
        {
          id: "claudia-team-adoption",
          actionType: "adoption_note",
          kind: "attention",
          confidence: "inferred",
          title: "Adoption note: support the team, don't replace the team.",
          body:
            "For Claudia's rollout, AICOS should be introduced as a team coordination layer with human setup and training, not as a silent substitute for coordinators or project leads.",
          details: [
            "Team mode is a v1 adoption requirement, not a hidden automation promise.",
            "Role-impact concerns should be addressed in onboarding materials and account-manager setup.",
            "AICOS drafts and stages work; Claudia still decides what reaches the team.",
          ],
          actionLabel: "Acknowledge",
          resolvedLabel: "Adoption concern acknowledged for onboarding and team-mode rollout.",
        },
      ],
    },
    chatReplies: {
      "What should I focus on today?":
        "One thing, really: the style-guide sign-off from Corporate. It's the only item on your critical path — everything else is either moving or just quiet. I've drafted a sign-off nudge in your briefing; approve it and it's ready to send.",
      "Draft a nudge for the blocked item.":
        "Done — it's in your briefing as a draft, ready for your review. I won't send it until you approve it. Want me to make it warmer, firmer, or shorter?",
      "What can't you see right now?":
        "Two things. The initiative-lead status collection has gone quiet for 9 days — it may have moved to a channel I'm not in. And anything in a private 1:1 or comp is off-limits. If you want, I can request access to that channel.",
    },
  },
  {
    id: "alfredo",
    name: "Alfredo Ordonez",
    role: "VP, International Business",
    cardRole: "VP, International Business",
    team: 7,
    tracksIn: "Power BI",
    adminLoad: "15–20% of his week on delegable coordination",
    objectivePrompt: "Restore weekly competitive and regulatory intelligence across the three priority markets.",
    generatorOwners: ["Market lead", "Analyst", "Alfredo", "Region lead"],
    generatorAssumption:
      "I assumed Power BI is the executive KPI source, but in-person market reviews still need manual logging.",
    access: [
      { source: "Calendar", level: "read", state: "connected" },
      { source: "Email", level: "read", state: "connected" },
      { source: "Power BI", level: "read", state: "connected", note: "KPIs & objectives" },
      { source: "Teams", level: "read", state: "connected" },
      { source: "In-person meetings", level: "off-limits", state: "off", note: "not visible to AICOS" },
      { source: "Compensation", level: "off-limits", state: "off", note: "restricted by request" },
    ],
    connectors: [
      { source: "Power BI", state: "connected" },
      { source: "Calendar", state: "connected" },
      { source: "Email", state: "connected" },
      { source: "Teams", state: "connected" },
      { source: "Slack", state: "available" },
      { source: "Jira", state: "available" },
      { source: "Loop", state: "available" },
    ],
    objectives: [
      {
        id: "a1",
        title: "Hit H2 international revenue & margin targets",
        okr: "Close the H2 gap to plan across 3 priority markets.",
        openQuestions: [
          "One market's status depends on an in-person review I wasn't part of — confirm with the market lead before I treat it as current.",
        ],
        tasks: [
          {
            title: "Refresh the 3-market pipeline forecast",
            owner: "Market lead, Region A",
            due: "Jul 2",
            status: "on_track",
            confidence: "verified",
            provenance: "updated in Power BI yesterday",
          },
          {
            title: "Resolve the Region B regulatory approval delay",
            owner: "Alfredo",
            due: "Jul 7",
            status: "blocked",
            confidence: "verified",
            provenance: "flagged in last team meeting; awaiting regulator response",
          },
          {
            title: "Region C account review",
            owner: "Market lead, Region C",
            due: "Jun 25",
            status: "stale",
            confidence: "unknown",
            provenance:
              "no Power BI update — you held an in-person review I couldn't see, so this may already be current",
          },
        ],
      },
      {
        id: "a2",
        title: "Rebuild market intelligence after the reorg",
        okr: "Restore competitive & regulatory monitoring lost when subscriptions lapsed.",
        openQuestions: [],
        tasks: [
          {
            title: "Define the watchlist: competitors, regulators, key markets",
            owner: "Alfredo",
            due: "Jul 4",
            status: "on_track",
            confidence: "verified",
            provenance: "drafted",
          },
          {
            title: "Stand up a weekly intelligence digest",
            owner: "Analyst",
            due: "Jul 11",
            status: "not_started",
            confidence: "inferred",
            provenance: "owner inferred; not yet confirmed",
          },
        ],
      },
    ],
    briefing: {
      summary:
        "One genuine blocker in Region B needs your push this week. Region C looks stale on paper — but you ran an in-person review I wasn't part of, so I'm flagging it as a blind spot, not a problem. And market intelligence is quietly climbing your priority list.",
      items: [
        {
          id: "alfredo-region-b",
          kind: "blocker",
          confidence: "verified",
          title: "Region B regulatory delay is on the critical path.",
          body:
            "The approval is still pending and it's the main risk to the H2 plan. This is the one worth your time.",
          draft: {
            type: "Message",
            to: "Region B market lead",
            body:
              "Where do we stand on the regulator response? If we're still waiting, let's line up an escalation path today so this doesn't slip into next month's numbers.",
          },
        },
        {
          id: "alfredo-region-c",
          kind: "attention",
          confidence: "unknown",
          title: "Region C shows stale — but I may just not be able to see it.",
          body:
            "No Power BI update since the 25th. You held an in-person review I wasn't present for, so this may already be done. I'm not going to report it as a miss.",
          draft: {
            type: "Message",
            to: "Region C market lead",
            body:
              "Could you drop the outcome of the account review into Power BI when you get a moment? Just so the H2 view reflects where things actually stand.",
          },
          secondaryAction: {
            label: "Request access",
            scope: "Ask for in-person review notes to be logged.",
          },
        },
        {
          id: "alfredo-intel",
          kind: "shift",
          confidence: "inferred",
          title: "Market intelligence is climbing your list.",
          body:
            "With monitoring subscriptions gone since the reorg, the watchlist work now gates your competitive view. Worth confirming the analyst owner so the weekly digest can start.",
        },
      ],
    },
    prepDesk: {
      summary:
        "AICOS reviewed the H2 market deck as a staged briefing item: style issues are ready to approve, while Region C remains a blind spot until the in-person review notes are logged.",
      items: [
        {
          id: "alfredo-h2-deck",
          actionType: "deck_review",
          kind: "prep",
          confidence: "unknown",
          title: "Review the H2 market update deck.",
          body:
            "I found three slides that drift from the corporate style guide and one Region C chart that depends on context I can't see from the in-person account review.",
          details: [
            "Slides 4, 7, and 9 need title-case and metric-label cleanup.",
            "Slide 6 uses Region C pipeline status from Power BI before the in-person review was logged.",
            "Recommended fix: approve the style edits now, then ask the Region C lead to add review notes before finalizing the chart.",
          ],
          draft: {
            label: "Deck review brief",
            body:
              "Deck is directionally ready. I recommend approving style-guide cleanup on slides 4, 7, and 9, and holding slide 6 until Region C's in-person review outcome is logged.",
          },
          actionLabel: "Approve review",
          resolvedLabel: "Review approved. AICOS will wait for Alfredo before applying or sending anything.",
          secondaryAction: {
            label: "Request notes",
            scope: "Region C in-person review notes for H2 deck",
          },
        },
        {
          id: "alfredo-followup",
          actionType: "schedule_followup",
          kind: "attention",
          confidence: "inferred",
          title: "Stage a 30-minute regulatory follow-up.",
          body:
            "Region B is the true blocker. I prepared a short follow-up with the market lead so the escalation path is clear before next month's numbers close.",
          details: [
            "Suggested slot: Thu Jul 2, 2:00 PM.",
            "Agenda: regulator response, escalation owner, date to update Power BI.",
          ],
          actionLabel: "Stage schedule",
          resolvedLabel: "Schedule staged. AICOS will wait for Alfredo to send the invite.",
        },
        {
          id: "alfredo-regulatory-meeting-prep",
          actionType: "meeting_prep",
          kind: "prep",
          confidence: "verified",
          title: "Prep the Region B regulatory follow-up.",
          body:
            "I prepared the agenda Alfredo needs for the Region B market lead so the meeting produces a concrete escalation path, not another status check.",
          details: [
            "Confirm the latest regulator response and expected decision date.",
            "Name the escalation owner if no response lands this week.",
            "Decide when Power BI will be updated so the H2 view is current.",
          ],
          draft: {
            label: "Meeting prep brief",
            body:
              "Use this follow-up to leave with three decisions: regulator-response status, escalation owner, and the date the market lead will refresh Power BI.",
          },
          actionLabel: "Approve prep",
          resolvedLabel: "Meeting prep approved. AICOS will keep the agenda staged for Alfredo.",
        },
        {
          id: "alfredo-region-b-nudge",
          actionType: "nudge_request",
          kind: "blocker",
          confidence: "verified",
          title: "Draft nudge for the Region B market lead.",
          body:
            "The regulatory delay is still the highest-leverage issue. I drafted a nudge that asks for status and an escalation path without over-reporting the risk.",
          details: [
            "Recipient: Region B market lead.",
            "Ask: regulator response status and escalation path today.",
            "Guardrail: references only verified blocker status from the team meeting.",
          ],
          draft: {
            label: "Nudge draft",
            body:
              "Where do we stand on the regulator response? If we're still waiting, let's line up an escalation path today so this doesn't slip into next month's numbers.",
          },
          actionLabel: "Stage nudge",
          resolvedLabel: "Nudge staged. AICOS will wait for Alfredo before anything is sent.",
        },
      ],
    },
    chatReplies: {
      "What should I focus on today?":
        "Region B's regulatory delay. It's your biggest risk to the H2 plan and it's the one place your push changes the outcome. Region C looks stale, but you reviewed it in person — I'm not counting that as a miss.",
      "Draft a nudge for the blocked item.":
        "Done — it's in your briefing as a draft, ready for your review. I won't send it until you approve it. Want me to make it warmer, firmer, or shorter?",
      "What can't you see right now?":
        "Your in-person reviews — like the Region C one — and compensation. So when something's stale, I check whether I just wasn't in the room before I flag it as behind. I can ask the lead to log the outcome if you'd like.",
    },
  },
  {
    id: "alex",
    name: "Alex Lopez",
    role: "Digital Director",
    cardRole: "Digital Director",
    team: 12,
    tracksIn: "OKRs + Jira",
    adminLoad: "8–16 hrs/week — over 20% of his time",
    objectivePrompt: "Cut leadership-prep time below four hours without losing blocker visibility.",
    generatorOwners: ["Platform lead", "Data lead", "Alex", "Program lead"],
    generatorAssumption:
      "I assumed Jira holds execution status while partner commitments may also live in shared docs.",
    access: [
      { source: "Calendar", level: "read", state: "connected" },
      { source: "Jira", level: "read", state: "connected" },
      { source: "OKR tracker", level: "read", state: "connected" },
      { source: "Shared docs", level: "read", state: "connected" },
      { source: "1:1 recordings", level: "off-limits", state: "off", note: "Alex doesn't record 1:1s" },
      { source: "Compensation", level: "off-limits", state: "off" },
    ],
    connectors: [
      { source: "Jira", state: "connected" },
      { source: "Calendar", state: "connected" },
      { source: "OKR tracker", state: "connected" },
      { source: "Shared docs", state: "connected" },
      { source: "Slack", state: "available" },
      { source: "Teams", state: "available" },
      { source: "Loop", state: "available" },
    ],
    objectives: [
      {
        id: "x1",
        title: "Ship the cross-functional digital roadmap for H2",
        okr: "Align 3 partner teams on a shared delivery plan by mid-Q3.",
        openQuestions: [
          "Some partner commitments live in shared docs and conversations I read but didn't originate — confirm ownership before I lock milestones.",
        ],
        tasks: [
          {
            title: "Consolidate the 3 partner-team OKRs into one view",
            owner: "Alex",
            due: "Jul 1",
            status: "on_track",
            confidence: "verified",
            provenance: "OKR tracker current",
          },
          {
            title: "Resolve the conflicting priority between Data and Platform",
            owner: "Alex",
            due: "Jul 6",
            status: "blocked",
            confidence: "inferred",
            provenance:
              "inferred from two Jira tickets pointing at the same sprint — not yet confirmed with either lead",
          },
          {
            title: "Lock the shared delivery milestones",
            owner: "Platform lead",
            due: "Jul 14",
            status: "not_started",
            confidence: "inferred",
            provenance: "depends on the priority conflict above",
          },
        ],
      },
      {
        id: "x2",
        title: "Tighten the weekly leadership prep loop",
        okr: "Cut leadership-prep time below 4 hrs/week without losing visibility.",
        openQuestions: [],
        tasks: [
          {
            title: "Template the monthly review deck",
            owner: "Alex",
            due: "Jul 8",
            status: "on_track",
            confidence: "verified",
            provenance: "shared doc in progress",
          },
        ],
      },
    ],
    briefing: {
      summary:
        "Your week turns on one decision: the Data-vs-Platform priority conflict. I've inferred it from overlapping Jira tickets — I haven't confirmed it, so treat it as a lead to check, not a settled fact. Everything downstream is waiting on it.",
      items: [
        {
          id: "alex-priority",
          kind: "blocker",
          confidence: "inferred",
          title: "A possible priority collision between Data and Platform.",
          body:
            "Two Jira tickets target the same sprint capacity. I'm inferring a conflict from the overlap — I could be wrong. The milestone lock can't proceed until it's resolved, so it's worth a quick confirm with both leads.",
          draft: {
            type: "Agenda item",
            to: "Data lead, Platform lead",
            subject: "5 min: same-sprint overlap?",
            body:
              "Two tickets look like they're competing for the same sprint capacity. Can we confirm whether that's a real conflict and, if so, which takes priority? Don't want it to stall the milestone lock.",
          },
        },
        {
          id: "alex-deck",
          kind: "prep",
          confidence: "verified",
          title: "Monthly review deck is on track.",
          body:
            "The template is moving. A 30-minute block midweek gets it review-ready and keeps leadership prep inside your 4-hour target.",
        },
        {
          id: "alex-one-on-ones",
          kind: "attention",
          confidence: "unknown",
          title: "I can see your roadmap, not your 1:1s — by design.",
          body:
            "Some partner commitments may have been made in 1:1s. You don't record those and I don't read them, so if a milestone depends on a conversation I can't see, I'll flag the gap rather than guess.",
        },
      ],
    },
    prepDesk: {
      summary:
        "AICOS has staged Alex's monthly review deck prep and a 30-minute review block so leadership prep stays below four hours without losing blocker visibility.",
      items: [
        {
          id: "alex-monthly-deck",
          actionType: "deck_review",
          kind: "prep",
          confidence: "verified",
          title: "Prep the monthly review deck.",
          body:
            "The shared deck template is current. I prepared a review pass focused on blocker clarity, partner-team commitments, and whether inferred Jira conflicts are labeled as inferred.",
          details: [
            "Deck section to review: H2 roadmap milestones.",
            "Style pass: keep blocker labels consistent across Data, Platform, and partner-team slides.",
            "Trust note: mark the Data-vs-Platform conflict as inferred until both leads confirm it.",
          ],
          draft: {
            label: "Review checklist",
            body:
              "Before leadership review: confirm the Data-vs-Platform conflict, update the milestone lock slide, and keep any 1:1-dependent commitments labeled as blind spots.",
          },
          actionLabel: "Approve checklist",
          resolvedLabel: "Checklist approved. AICOS will keep the deck review staged until Alex applies it.",
        },
        {
          id: "alex-review-block",
          actionType: "schedule_followup",
          kind: "prep",
          confidence: "inferred",
          title: "Schedule the 30-minute deck review block.",
          body:
            "I found a midweek hold that protects Alex's prep target. The block is staged, not sent, and it includes the specific deck sections to review.",
          details: [
            "Suggested slot: Wed Jul 1, 3:30 PM.",
            "Goal: keep leadership prep under four hours while preserving blocker visibility.",
            "Invite: Alex only, unless he wants Data and Platform leads added after the conflict is confirmed.",
          ],
          actionLabel: "Stage schedule",
          resolvedLabel: "Schedule staged. AICOS will wait for Alex before creating the calendar hold.",
        },
        {
          id: "alex-priority-meeting-prep",
          actionType: "meeting_prep",
          kind: "prep",
          confidence: "inferred",
          title: "Prep the Data/Platform priority-confirmation meeting.",
          body:
            "I prepared a five-minute agenda to test whether the Jira overlap is a real conflict before Alex treats it as a blocker.",
          details: [
            "Open with the exact two Jira tickets that appear to collide.",
            "Ask each lead whether the capacity conflict is real or just a tracking artifact.",
            "End with the milestone-lock owner and the source AICOS should treat as current.",
          ],
          draft: {
            label: "Meeting prep brief",
            body:
              "Confirm whether the Data/Platform sprint overlap is real, decide which work takes priority if it is, and identify the source AICOS should use before locking milestones.",
          },
          actionLabel: "Approve prep",
          resolvedLabel: "Meeting prep approved. AICOS will keep the agenda staged for Alex.",
        },
        {
          id: "alex-privacy-one-on-one",
          actionType: "meeting_prep",
          kind: "prep",
          confidence: "unknown",
          title: "Prep privacy-safe 1:1 agenda.",
          body:
            "AICOS does not read Alex's 1:1 recordings, private notes, or conversation history. It can stage an agenda shell that Alex edits with the context he wants to bring.",
          details: [
            "Goal: create a lightweight agenda without pulling private 1:1 content.",
            "Agenda shell: wins, blockers, commitments Alex wants to confirm, and anything that should stay out of systems.",
            "Follow-up note: only log outcomes Alex explicitly chooses to share.",
          ],
          draft: {
            label: "1:1 agenda shell",
            body:
              "Agenda: 1) What changed since our last check-in? 2) Any blocker I can remove? 3) What should stay private or off-system? 4) What follow-up, if any, should I log after this conversation?",
          },
          editFields: {
            goal: "Hold a useful 1:1 without asking AICOS to infer private context.",
            followUpNote:
              "After the conversation, Alex chooses whether any action item should be logged. AICOS does not infer outcomes from private 1:1s.",
          },
          actionLabel: "Approve agenda",
          resolvedLabel: "1:1 agenda approved. AICOS will keep the edited shell staged for Alex.",
        },
        {
          id: "alex-priority-nudge",
          actionType: "nudge_request",
          kind: "blocker",
          confidence: "inferred",
          title: "Draft nudge for Data and Platform leads.",
          body:
            "Because the conflict is inferred, the nudge asks for confirmation instead of treating the overlap as settled fact.",
          details: [
            "Recipients: Data lead and Platform lead.",
            "Ask: confirm whether the same-sprint overlap is a real priority conflict.",
            "Guardrail: labels the issue as inferred from Jira, not verified.",
          ],
          draft: {
            label: "Nudge draft",
            body:
              "Two tickets look like they're competing for the same sprint capacity. Can we confirm whether that's a real conflict and, if so, which takes priority? Don't want it to stall the milestone lock.",
          },
          actionLabel: "Stage nudge",
          resolvedLabel: "Nudge staged. AICOS will wait for Alex before anything is sent.",
        },
      ],
    },
    chatReplies: {
      "What should I focus on today?":
        "Confirm whether Data and Platform are really colliding on the same sprint. I inferred it from two Jira tickets, so I might be wrong — but your milestone lock is waiting on the answer. I've drafted a 5-minute agenda item.",
      "Draft a nudge for the blocked item.":
        "Done — it's in your briefing as a draft, ready for your review. I won't send it until you approve it. Want me to make it warmer, firmer, or shorter?",
      "What can't you see right now?":
        "Your 1:1s — you don't record them and I don't read them. So if a partner commitment was made in one, I'll see the gap, not the content, and I'll say so rather than guess.",
    },
  },
];

export const HELP_FAQ = [
  {
    question: "Will it message my team without me?",
    answer: "No. AICOS drafts; you approve and send. It never acts on its own.",
  },
  {
    question: "What if it can't see something?",
    answer:
      'It tells you. A "Blind spot" tag means it genuinely can\'t confirm — it won\'t guess or report a miss that may not be real.',
  },
  {
    question: "Can it see compensation or my private 1:1s?",
    answer: "No. Those are off-limits and stay that way, even if you ask.",
  },
  {
    question: "How do I give it more access?",
    answer:
      "Use \"Request access\" — it routes to the AICOS team, who can coordinate the setup. AICOS never grants itself access.",
  },
  {
    question: "Is this using my real data?",
    answer: "No — this is an interactive prototype on a simulated workspace.",
  },
];

export const CONNECTED_SOURCES_COPY =
  "In this prototype, sources are simulated. The real AICOS would connect to the tools your team already uses — so these would reflect your actual stack (Slack or Teams, Jira or Loop, and so on).";

export const BYO_SYSTEM_PROMPT =
  "You are AICOS, an AI chief of staff. You don't just track work — you do work: you turn objectives into roadmaps, prepare leaders for the week, and draft the follow-through. Four rules never bend: (1) Draft, don't send — present actions for approval, never act autonomously. (2) Show your confidence — mark verified vs. inferred, and say when data is missing or stale; never present a guess as fact. (3) Name the gaps — if work may have happened where you can't see, flag the blind spot instead of assuming it didn't happen. (4) Respect the boundaries — use only granted data, never touch restricted categories, and when you need more, ask a human. Be concise, warm, plain. When asked for a roadmap, return owned, dated, status-tracked tasks and list every assumption you made.";
