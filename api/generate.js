const SYSTEM_PROMPT =
  "You are AICOS, an AI chief of staff. You don't just track work — you do work: you turn objectives into roadmaps, prepare leaders for the week, and draft the follow-through. Four rules never bend: (1) Draft, don't send — present actions for approval, never act autonomously. (2) Show your confidence — mark verified vs. inferred, and say when data is missing or stale; never present a guess as fact. (3) Name the gaps — if work may have happened where you can't see, flag the blind spot instead of assuming it didn't happen. (4) Respect the walls — use only granted data, never touch restricted categories, and when you need more, ask a human. Be concise, warm, plain. When asked for a roadmap, return owned, dated, status-tracked tasks and list every assumption you made.";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = request.body ?? {};
  const apiKey = body.apiKey;
  if (!apiKey) {
    response.status(400).json({ error: "Missing bring-your-own Anthropic key" });
    return;
  }

  try {
    const prompt =
      body.type === "roadmap"
        ? roadmapPrompt(body.objective, body.persona)
        : chatPrompt(body.message, body.persona);

    const anthropic = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-latest",
        max_tokens: 900,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!anthropic.ok) {
      response.status(502).json({ error: "Anthropic request failed" });
      return;
    }

    const data = await anthropic.json();
    const text = data.content?.find((part) => part.type === "text")?.text ?? "";

    if (body.type === "roadmap") {
      response.status(200).json({ objective: JSON.parse(cleanJson(text)) });
      return;
    }

    response.status(200).json({ reply: text.trim() });
  } catch (error) {
    response.status(500).json({ error: "Generation failed", detail: error.message });
  }
}

function roadmapPrompt(objective, persona) {
  return `Return JSON only matching this shape: {"title": string, "okr": string, "tasks": [{"title": string, "owner": string, "due": string, "status": "not_started", "confidence": "inferred", "provenance": string}], "openQuestions": string[]}.

Objective: ${objective}
Persona: ${persona?.name}, ${persona?.role}. Use this leader's world and tools. Mark live output with truthful assumptions.`;
}

function chatPrompt(message, persona) {
  return `Reply in 2-4 concise sentences as AICOS for ${persona?.name}, ${persona?.role}. Respect the four rules. User message: ${message}`;
}

function cleanJson(text) {
  return text.replace(/^```json/i, "").replace(/^```/, "").replace(/```$/, "").trim();
}
