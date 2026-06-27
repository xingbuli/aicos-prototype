export function createDemoResponse(action, persona) {
  if (action === "roadmap") {
    return {
      ...persona.roadmap,
      name: `${persona.roadmap.name} - AICOS generated`,
      status: persona.roadmap.status === "On track" ? "On track" : "Draft ready for review",
      milestones: persona.roadmap.milestones.map((item, index) => ({
        ...item,
        next:
          index === 0
            ? `AICOS recommends confirming ${item.owner}'s latest update before assigning more work.`
            : item.next,
      })),
    };
  }

  if (action === "nudges") {
    return persona.followUps.map((draft) => ({
      ...draft,
      status: draft.status === "sent" ? "sent" : "waiting",
      message: `${draft.message} Please reply with a one-line status, blocker, and date you can commit to.`,
    }));
  }

  if (action === "meeting") {
    const meeting = persona.meetings[0];
    return {
      ...meeting,
      title: `${meeting.title} - prepared by AICOS`,
      questions: [
        ...meeting.questions,
        "What context should AICOS not infer from the systems it can access?",
      ],
      openLoops: [
        ...meeting.openLoops,
        "AICOS will wait for confirmation before sending follow-ups after this meeting.",
      ],
    };
  }

  return {
    headline: `${persona.name}'s week is ready for review with ${persona.metrics.atRisk} items needing attention.`,
    bullets: [
      persona.brief.bullets[0],
      "AICOS found one stale context area and recommends a draft-not-send nudge.",
      "No sensitive or compensation-related data was used in this briefing.",
    ],
  };
}
