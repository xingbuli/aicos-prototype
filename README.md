# AICOS

AICOS is an AI chief of staff that does work, not just tracks it: it turns objectives into roadmaps, prepares a leader's week, and drafts the follow-through. The product thesis is that useful AI for leaders needs a visible trust spine: draft, don't send; show confidence; name the gaps; respect the walls.

## For Evaluators

Open the deployed URL, choose one of the three workspaces, confirm the pre-selected source setup, and take the guided tour. No account, environment variable, or real data is required. The intended first run is:

1. Choose Claudia, Alfredo, or Alex.
2. Confirm or adjust the simulated connected sources for that workspace.
3. Follow the 5-step tour.
4. Read the weekly briefing.
5. Edit a draft, approve it, edit again if needed, then mark it sent in the prototype.
6. Open Prep Desk to review, stage, and complete simulated deck prep, meeting prep, 1:1 agenda prep, nudge requests, and scheduling work.
7. Open chat as an in-page side panel without leaving the current view.
8. Generate a roadmap from your own objective.
9. Request access from a blind spot or off-limits source.

## What Is Real, Simulated, And Assumed

| Area | Status | Notes |
|---|---|---|
| Product workflow | Real prototype UI | Workspace selection, source setup, guided tour, briefing, Prep Desk action queue, editable draft approval, final prototype commit actions, roadmap generation, in-page chat, settings, help, and request-access flows are interactive. |
| Data | Simulated | All workspace content is curated, pre-written demo content from `docs/CONTENT.md`. No real AES or user data is used. |
| Integrations | Assumed placeholders | Slack, Teams, Jira, Microsoft Loop, Power BI, Calendar, Email, OKR tracker, and shared docs are represented as simulated connected sources because the real evaluator stack is unknown. Source choices are local prototype state and update the visible connected-source panel. |
| Prep Desk actions | Simulated prototype flow | Prep Desk lets users edit/review, stage, and then commit a simulated outcome: apply deck notes, save agendas, mark nudges sent, create calendar holds, or record adoption notes. Edits are local browser state; it does not parse PowerPoint files, edit documents, read private 1:1s, send messages, or create real calendar events. Final actions show receipts only. |
| Team adoption | Product framing | Claudia's team-mode and role-impact concerns are acknowledged in Prep Desk. Real multi-user collaboration and onboarding workflows are future MVP work. |
| Authentication | Simulated | Choosing a workspace is persona selection, not real auth. |
| Sending messages | Simulated | AICOS drafts messages and the leader can mark them sent in the prototype. No real message is sent. |
| Access requests | Simulated | Requests route to a simulated AICOS account manager and confirm locally. |
| Default AI | Simulated | The app works offline with curated replies and a deterministic client-side roadmap generator. |
| LLM providers | Backlog | The prototype does not require a real LLM provider. Provider/model selection is a future product decision; the current demo keeps responses reliable with curated and deterministic simulation. |

## Model Provider Note

The deployed app is complete without live AI. The Settings panel states that model/provider selection belongs in the backlog; this keeps the prototype provider-neutral and avoids implying that one vendor is required.

No environment variables are required for deployment.

## AI Tools Used

- Codex was used to implement and refine the prototype in this repository.
- Claude / Claude Code and Cursor may be listed here if used during the final submission workflow. Buli should adjust this section to match the actual tool history before tagging.
- No real runtime model is required for the evaluator flow. Model/provider selection is future work.

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
