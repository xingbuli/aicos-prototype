const commonWeeks = ["May 12", "May 19", "May 26", "Jun 2", "Jun 9", "Jun 16", "Jun 23", "Jun 30"];

export const personas = [
  {
    id: "alex",
    name: "Alex Lopez",
    role: "Digital Director",
    teamSize: "7",
    metrics: { onTrack: 7, atRisk: 3, meetings: 24, actions: 42 },
    brief: {
      headline: "Product launch readiness is improving, but vendor delays could affect the 6/30 target.",
      bullets: [
        "Two staff-meeting actions moved from blocked to in progress after owner updates.",
        "Jira work is aligned with the monthly review deck, except the vendor SOW still needs confirmation.",
        "AICOS recommends a focused 1:1 with Alex Martinez before the launch readiness review.",
      ],
    },
    roadmap: {
      name: "Launch New Customer Portal",
      objective: "Increase customer self-service adoption to 60% by Q3",
      status: "On track",
      weeks: commonWeeks,
      milestones: [
        {
          title: "Discovery & requirements",
          owner: "Alex Martinez",
          due: "May 20",
          next: "Confirm final scope against stakeholder review notes.",
          start: 4,
          width: 18,
          tone: "done",
        },
        {
          title: "Design & prototype",
          owner: "Taylor Singh",
          due: "Jun 3",
          next: "Review pricing page copy with commercial stakeholders.",
          start: 17,
          width: 22,
          tone: "done",
        },
        {
          title: "Build & integrate",
          owner: "Jamie Williams",
          due: "Jun 21",
          next: "Unblock vendor API credentials and security review.",
          start: 30,
          width: 38,
          tone: "active",
        },
        {
          title: "Pilot & validate",
          owner: "Emily Rogers",
          due: "Jun 28",
          next: "Define pilot success criteria for support deflection.",
          start: 70,
          width: 18,
          tone: "active",
        },
        {
          title: "Launch & adopt",
          owner: "Daniel Kim",
          due: "Jul 14",
          next: "Draft enablement content for frontline teams.",
          start: 83,
          width: 14,
          tone: "planned",
        },
      ],
    },
    followUps: [
      {
        id: "alex-1",
        owner: "Alex Martinez",
        initials: "AM",
        reason: "Vendor SOW is blocking launch readiness.",
        message:
          "Draft: Can you confirm whether the Acme vendor SOW is final today? AICOS sees this as the main dependency for the 6/30 portal target.",
        status: "stale",
      },
      {
        id: "alex-2",
        owner: "Jamie Williams",
        initials: "JW",
        reason: "No update on engineering bandwidth since last staff meeting.",
        message:
          "Draft: Could you send a short bandwidth update before tomorrow's readiness review? The build plan still shows June as constrained.",
        status: "waiting",
      },
      {
        id: "alex-3",
        owner: "Emily Rogers",
        initials: "ER",
        reason: "Pilot success criteria need confirmation.",
        message:
          "Draft: Please confirm the adoption metric and pilot group for the self-service portal so we can lock the review deck.",
        status: "waiting",
      },
    ],
    meetings: [
      {
        title: "1:1 with Alex Martinez",
        owner: "Alex Martinez",
        time: "Today, 10:00 - 10:30 AM",
        questions: [
          "What changed in vendor onboarding since the last staff meeting?",
          "Which launch dependency needs executive help this week?",
          "Can we close pricing scope before the monthly review deck is finalized?",
        ],
        openLoops: [
          "Vendor SOW lacks a confirmed owner update.",
          "Pricing content still differs between Jira and the PowerPoint review draft.",
        ],
      },
      {
        title: "Digital staff meeting",
        owner: "Digital leadership team",
        time: "Tomorrow, 2:00 - 3:00 PM",
        questions: [
          "Which objective changed priority this week?",
          "What needs to be escalated before Friday?",
          "Which open actions should be removed because they are stale?",
        ],
        openLoops: ["Two action items have not been updated in seven days."],
      },
    ],
    risks: [
      {
        severity: "High",
        title: "Vendor onboarding delay may impact launch",
        detail: "Acme payments API integration has not cleared legal review.",
        owner: "Alex Martinez",
        uncertain: true,
      },
      {
        severity: "High",
        title: "Engineering bandwidth limited in June",
        detail: "Mobile app work competes with customer portal integration.",
        owner: "Jamie Williams",
        uncertain: true,
      },
      {
        severity: "Medium",
        title: "Adoption target is ambitious",
        detail: "Requires communications and support-team enablement.",
        owner: "Emily Rogers",
        uncertain: false,
      },
    ],
    context: {
      confidence: 87,
      allowed: [
        "Goals, OKRs, and monthly review materials",
        "Jira status and open action items",
        "Calendar attendees and upcoming meetings",
        "Shared PowerPoint and working documents",
      ],
      restricted: [
        "Compensation and HR-sensitive documents",
        "Private 1:1 recordings",
        "Unshared personal notes",
      ],
      gaps: [
        {
          title: "Vendor legal status",
          detail: "AICOS sees the dependency but not the latest legal decision.",
        },
        {
          title: "Stakeholder priority shift",
          detail: "Last product update suggests scope changed, but no owner confirmed it.",
        },
      ],
    },
  },
  {
    id: "claudia",
    name: "Claudia Nep",
    role: "Sr. Director, Stakeholder Relations",
    teamSize: "22",
    metrics: { onTrack: 11, atRisk: 5, meetings: 31, actions: 58 },
    brief: {
      headline: "The communications roadmap is strong, but external-facing updates need cleaner ownership.",
      bullets: [
        "AICOS converted the stakeholder OKR into workstreams for narrative, approvals, and launch readiness.",
        "Three Loop actions are overdue because owners were not assigned after the last review.",
        "The next best move is to schedule a short follow-up with project leads and approve drafted nudges.",
      ],
    },
    roadmap: {
      name: "Stakeholder Engagement Roadmap",
      objective: "Turn the Q3 stakeholder OKR into owner-led communications, milestones, and external updates",
      status: "Needs owner confirmation",
      weeks: commonWeeks,
      milestones: [
        {
          title: "Translate OKR into workstreams",
          owner: "Maya Chen",
          due: "May 21",
          next: "Validate workstreams against Loop project hub.",
          start: 3,
          width: 20,
          tone: "done",
        },
        {
          title: "Assign owners and due dates",
          owner: "Jordan Price",
          due: "Jun 4",
          next: "Fill missing owners for external-facing materials.",
          start: 18,
          width: 22,
          tone: "active",
        },
        {
          title: "Schedule follow-ups",
          owner: "Priya Shah",
          due: "Jun 14",
          next: "Draft meeting holds for workstream leads.",
          start: 38,
          width: 24,
          tone: "active",
        },
        {
          title: "Update briefing materials",
          owner: "Luis Gomez",
          due: "Jun 24",
          next: "Reconcile internal and external versions.",
          start: 58,
          width: 24,
          tone: "planned",
        },
        {
          title: "Executive readiness review",
          owner: "Claudia Nep",
          due: "Jun 30",
          next: "Approve final narrative and escalation plan.",
          start: 81,
          width: 16,
          tone: "planned",
        },
      ],
    },
    followUps: [
      {
        id: "claudia-1",
        owner: "Jordan Price",
        initials: "JP",
        reason: "Loop has workstreams without owners.",
        message:
          "Draft: Can you confirm owners for the external update, approvals, and launch readiness workstreams? AICOS sees these as the biggest execution gaps.",
        status: "stale",
      },
      {
        id: "claudia-2",
        owner: "Priya Shah",
        initials: "PS",
        reason: "Follow-up meetings have not been scheduled.",
        message:
          "Draft: Please place 25-minute holds with the workstream leads this week so the roadmap keeps moving.",
        status: "waiting",
      },
      {
        id: "claudia-3",
        owner: "Luis Gomez",
        initials: "LG",
        reason: "Internal and external materials are drifting.",
        message:
          "Draft: Can you compare the internal brief and external update draft and flag any narrative mismatches by Thursday?",
        status: "waiting",
      },
    ],
    meetings: [
      {
        title: "1:1 with Jordan Price",
        owner: "Jordan Price",
        time: "Today, 1:00 - 1:30 PM",
        questions: [
          "Which workstream still lacks an accountable owner?",
          "What should AICOS nudge the project leads about this week?",
          "Which stakeholder update is most likely to stall without a follow-up meeting?",
        ],
        openLoops: [
          "Owner assignments are incomplete in the Loop hub.",
          "External-facing materials have not been synced with the internal narrative.",
        ],
      },
      {
        title: "Stakeholder comms team",
        owner: "22-person leadership group",
        time: "Tomorrow, 9:00 - 9:45 AM",
        questions: [
          "Which deliverables need executive review?",
          "Which teams need reminders before the next milestone?",
          "Where should AICOS maintain the source of truth?",
        ],
        openLoops: ["Three Loop tasks have reminders but no assigned owner."],
      },
    ],
    risks: [
      {
        severity: "High",
        title: "Roadmap ownership is incomplete",
        detail: "Three workstreams have tasks but no accountable lead in Loop.",
        owner: "Jordan Price",
        uncertain: true,
      },
      {
        severity: "Medium",
        title: "External update could drift from internal narrative",
        detail: "Two versions of the story are being edited in parallel.",
        owner: "Luis Gomez",
        uncertain: false,
      },
      {
        severity: "Medium",
        title: "Follow-up meetings are not scheduled",
        detail: "Project momentum depends on cross-team check-ins this week.",
        owner: "Priya Shah",
        uncertain: true,
      },
    ],
    context: {
      confidence: 82,
      allowed: [
        "Microsoft Loop project hub",
        "Team calendars and meeting action items",
        "Shared presentations and briefing drafts",
        "Work-related email and chat metadata",
      ],
      restricted: [
        "Compensation data",
        "Private HR conversations",
        "Personal chat threads outside company systems",
      ],
      gaps: [
        {
          title: "Missing project owners",
          detail: "AICOS can see the tasks but needs a human to confirm accountable leads.",
        },
        {
          title: "External stakeholder dependencies",
          detail: "Several dependencies sit outside the shared Loop hub.",
        },
      ],
    },
  },
  {
    id: "alfredo",
    name: "Alfredo Ordonez",
    role: "VP, International Business",
    teamSize: "7",
    metrics: { onTrack: 6, atRisk: 4, meetings: 18, actions: 33 },
    brief: {
      headline: "Strategic priorities are clear, but KPI adoption and market intelligence coverage are inconsistent.",
      bullets: [
        "Power BI adoption remains limited, so AICOS is using calendar, email, and meeting context to reduce blind spots.",
        "The budget review is ready for discussion, but two regional updates are stale.",
        "AICOS recommends draft nudges for KPI owners and a briefing pass on regulatory developments.",
      ],
    },
    roadmap: {
      name: "International Growth Operating Plan",
      objective: "Track strategic priorities, budgets, KPIs, and market developments across regions",
      status: "At risk",
      weeks: commonWeeks,
      milestones: [
        {
          title: "Confirm regional KPIs",
          owner: "Sofia Rivera",
          due: "May 24",
          next: "Resolve missing Power BI updates.",
          start: 5,
          width: 18,
          tone: "active",
        },
        {
          title: "Budget review",
          owner: "Marco Silva",
          due: "Jun 3",
          next: "Prepare variance notes and executive questions.",
          start: 20,
          width: 20,
          tone: "done",
        },
        {
          title: "Regulatory scan",
          owner: "Nadia Torres",
          due: "Jun 13",
          next: "Summarize new market rules and competitor moves.",
          start: 36,
          width: 23,
          tone: "active",
        },
        {
          title: "Deck quality pass",
          owner: "Ethan Brooks",
          due: "Jun 20",
          next: "Normalize presentation style and data labels.",
          start: 55,
          width: 22,
          tone: "planned",
        },
        {
          title: "Strategic agenda lock",
          owner: "Alfredo Ordonez",
          due: "Jun 28",
          next: "Approve the agenda and escalation list.",
          start: 78,
          width: 17,
          tone: "planned",
        },
      ],
    },
    followUps: [
      {
        id: "alfredo-1",
        owner: "Sofia Rivera",
        initials: "SR",
        reason: "Regional KPI update is stale.",
        message:
          "Draft: Can you update the regional KPI view or send a short status by Friday? AICOS does not want to infer performance from outdated Power BI data.",
        status: "stale",
      },
      {
        id: "alfredo-2",
        owner: "Nadia Torres",
        initials: "NT",
        reason: "Regulatory scan has no recent source note.",
        message:
          "Draft: Please confirm whether there are new regulatory or competitor developments to include in the international briefing.",
        status: "waiting",
      },
      {
        id: "alfredo-3",
        owner: "Ethan Brooks",
        initials: "EB",
        reason: "Presentation quality pass is due before the review.",
        message:
          "Draft: Can you run the deck against the corporate style checklist and flag slides that need executive cleanup?",
        status: "waiting",
      },
    ],
    meetings: [
      {
        title: "1:1 with Sofia Rivera",
        owner: "Sofia Rivera",
        time: "Today, 11:00 - 11:30 AM",
        questions: [
          "What is preventing the regional KPI update from being current?",
          "Which strategic priority needs help from Alfredo this week?",
          "Is there context missing outside email, calendar, or Power BI?",
        ],
        openLoops: [
          "AICOS has no recent KPI update from Sofia.",
          "An in-person regional discussion may not be reflected in system context.",
        ],
      },
      {
        title: "International leadership sync",
        owner: "7 direct reports",
        time: "Thursday, 8:30 - 9:10 AM",
        questions: [
          "Which budget items need escalation?",
          "Which market developments changed the strategic agenda?",
          "Where should AICOS avoid drawing conclusions because context is incomplete?",
        ],
        openLoops: ["Regulatory scan source coverage is unknown."],
      },
    ],
    risks: [
      {
        severity: "High",
        title: "KPI reporting could misrepresent activity",
        detail: "Power BI adoption is limited, and some work occurs outside tracked systems.",
        owner: "Sofia Rivera",
        uncertain: true,
      },
      {
        severity: "Medium",
        title: "Regulatory intelligence source gap",
        detail: "Previous subscriptions are no longer available after reorganization.",
        owner: "Nadia Torres",
        uncertain: true,
      },
      {
        severity: "Medium",
        title: "Deck quality varies by region",
        detail: "Presentation materials need a unified corporate style pass.",
        owner: "Ethan Brooks",
        uncertain: false,
      },
    ],
    context: {
      confidence: 76,
      allowed: [
        "Email and calendar metadata",
        "Budget review decks and shared presentation files",
        "Power BI activity where teams adopted it",
        "Meeting action items approved for tracking",
      ],
      restricted: [
        "Compensation and performance-review data",
        "Confidential M&A or legal files",
        "Unlogged in-person meetings unless manually added",
      ],
      gaps: [
        {
          title: "In-person meeting blind spots",
          detail: "AICOS may not know about discussions that happened outside connected systems.",
        },
        {
          title: "Market intelligence coverage",
          detail: "Regulatory and competitor updates need source confirmation.",
        },
      ],
    },
  },
];
