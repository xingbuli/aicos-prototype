# AICOS

AICOS is an AI chief of staff that does work, not just tracks it: it turns objectives into roadmaps, prepares a leader's week, and drafts the follow-through. The product thesis is that useful AI for leaders needs a visible trust spine: draft, don't send; show confidence; name the gaps; respect the walls.

## For Evaluators

Open the deployed URL, choose one of the three workspaces, and take the guided tour. No setup, account, environment variable, or real data is required. The intended first run is:

1. Sign in by choosing Claudia, Alfredo, or Alex.
2. Follow the 5-step tour.
3. Read the weekly briefing.
4. Edit a draft, approve it, then mark it sent in the prototype.
5. Open Prep Desk to review, stage, and complete simulated deck prep, meeting prep, 1:1 agenda prep, nudge requests, and scheduling work.
6. Generate a roadmap from your own objective.
7. Request access from a blind spot or off-limits source.

## What Is Real, Simulated, And Assumed

| Area | Status | Notes |
|---|---|---|
| Product workflow | Real prototype UI | Workspace selection, guided tour, briefing, Prep Desk action queue, editable draft approval, final prototype commit actions, roadmap generation, chat, settings, help, and request-access flows are interactive. |
| Data | Simulated | All workspace content is curated, pre-written demo content from `docs/CONTENT.md`. No real AES or user data is used. |
| Integrations | Assumed placeholders | Slack, Teams, Jira, Microsoft Loop, Power BI, Calendar, Email, OKR tracker, and shared docs are represented as simulated connected sources because the real evaluator stack is unknown. |
| Prep Desk actions | Simulated prototype flow | Prep Desk lets users edit/review, stage, and then commit a simulated outcome: apply deck notes, save agendas, mark nudges sent, create calendar holds, or record adoption notes. Edits are local browser state; it does not parse PowerPoint files, edit documents, read private 1:1s, send messages, or create real calendar events. Final actions show receipts only. |
| Team adoption | Product framing | Claudia's team-mode and role-impact concerns are acknowledged in Prep Desk. Real multi-user collaboration and onboarding workflows are future MVP work. |
| Authentication | Simulated | Choosing a workspace is persona selection, not real auth. |
| Sending messages | Simulated | AICOS drafts messages and the leader can mark them sent in the prototype. No real message is sent. |
| Access requests | Simulated | Requests route to a simulated AICOS account manager and confirm locally. |
| Default AI | Simulated | The app works offline with curated replies and a deterministic client-side roadmap generator. |
| Optional live AI | Bring your own key | Evaluators may paste their own Anthropic key in Settings to try live objective/chat generation. This is optional and never required. |

## Bring Your Own AI Model

The deployed app is complete without live AI. To try live generation, open **Settings → Bring your own AI model** and paste an Anthropic API key. The key is stored in browser `localStorage` only and is sent to the optional `/api/generate` function for that request. If the request fails, the app silently falls back to the simulated generator so the demo never blocks.

No environment variables are required for deployment.

## AI Tools Used

- Codex was used to implement and refine the prototype in this repository.
- Claude / Claude Code and Cursor may be listed here if used during the final submission workflow. Buli should adjust this section to match the actual tool history before tagging.
- Optional runtime model: Anthropic Claude via a bring-your-own API key, off by default.

## Two-Month MVP Roadmap

**Weeks 1-3 — Real visibility (read-only).** Replace simulated data with scoped, read-only connectors for the tools these users actually use: Calendar + Email, Jira (Alex), Microsoft Loop (Claudia), Power BI (Alfredo), plus the team's chat (Slack or Teams). Permissions inherit what each user already has — no parallel access layer.

**Weeks 3-5 — Trust hardening.** Turn the demo's trust layer into infrastructure: a staleness/coverage model behind the confidence tags, an audit log of every inference and its source, human-in-the-loop gates on any outbound action, and the restricted-category wall enforced server-side.

**Weeks 4-6 — Execution orchestration.** Two-way write-back behind approval (create/assign tasks in Loop/Jira), scheduled nudges and follow-ups, and a draft-deck reviewer that checks slides against a corporate style guide (Alfredo's ask).

**Weeks 6-7 — Proactive intelligence.** A weekly competitive/regulatory digest from a configurable watchlist (Alfredo lost his subscriptions in the reorg), and priority-shift detection across objectives.

**Weeks 7-8 — Adoption & accuracy.** Guided onboarding with a human account manager (Claudia's ask), a team mode (AICOS supports the whole team, not one leader), and an evaluation harness measuring briefing accuracy and false-positive rate — the answer to "accurate without excessive human intervention."

Throughout: lowest-blast-radius first (read, then draft), earning higher-stakes capability (write, then act) only as accuracy is proven.

## Development

```bash
npm install
npm run dev
npm run build
npm run lint
```

This prototype is a Vite/React app. It deploys to Vercel with no required environment variables.

## Submission

```bash
git add -A && git commit -m "AICOS v1 submission"
git tag v1-submission
git push origin main --tags
```

Reply to the assignment with the live URL and the link to the `v1-submission` tag.
