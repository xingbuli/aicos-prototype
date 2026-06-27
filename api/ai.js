const SYSTEM_PROMPT =
  "You are AICOS, an AI chief of staff prototype. Return concise JSON only. You draft work for human approval and never imply autonomous sending. Respect restricted context and call out uncertainty.";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    response.status(503).json({ error: "OPENAI_API_KEY is not configured" });
    return;
  }

  try {
    const body = request.body ?? {};
    const action = body.action ?? "briefing";
    const persona = body.persona ?? {};

    const prompt = buildPrompt(action, persona, body.payload ?? {});
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        text: { format: { type: "json_object" } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      response.status(502).json({ error: "OpenAI request failed", detail: errorText });
      return;
    }

    const data = await aiResponse.json();
    const content = extractText(data);
    response.status(200).json({ mode: "Live AI", data: JSON.parse(content) });
  } catch (error) {
    response.status(500).json({ error: "AI generation failed", detail: error.message });
  }
}

function buildPrompt(action, persona, payload) {
  return JSON.stringify({
    task: action,
    userCommand: payload.command ?? "",
    persona: {
      name: persona.name,
      role: persona.role,
      teamSize: persona.teamSize,
      metrics: persona.metrics,
      currentBrief: persona.brief,
      currentRoadmap: persona.roadmap,
      followUps: persona.followUps,
      meetings: persona.meetings,
      risks: persona.risks,
      context: persona.context,
    },
    outputShape:
      action === "roadmap"
        ? "Return a roadmap object with name, objective, status, weeks, milestones."
        : action === "nudges"
          ? "Return an array of follow-up draft objects with id, owner, initials, reason, message, status."
          : action === "meeting"
            ? "Return one meeting prep object with title, owner, time, questions, openLoops."
            : "Return a briefing object with headline and bullets.",
  });
}

function extractText(data) {
  if (typeof data.output_text === "string") return data.output_text;

  const textPart = data.output
    ?.flatMap((item) => item.content ?? [])
    ?.find((part) => part.type === "output_text" || part.type === "text");

  return textPart?.text ?? "{}";
}
