# AICOS Prototype

AICOS is an AI-powered chief of staff prototype for leaders who manage teams, projects, meetings, and follow-through. The prototype demonstrates how AICOS can turn objectives into roadmaps, prepare leaders for meetings, draft follow-ups for approval, and flag uncertainty before it draws conclusions.

## Prototype URL

Production URL: https://aicos-prototype.vercel.app

For local review:

```bash
pnpm install
pnpm dev
```

Then open the local URL printed by Vite.

## How To Navigate The Demo

1. Use the **Demo role** selector in the top right to switch between the three seeded interview personas:
   - Alex Lopez: Digital Director, 7-person team.
   - Claudia Nep: Sr. Director, 22-person team.
   - Alfredo Ordonez: VP, International Business, 7 direct reports.
2. Start on **Leadership Briefing** to see weekly priorities, risks, stale updates, and recommended next moves.
3. Click **Generate roadmap** to see AICOS convert an objective into milestones, owners, and next actions.
4. Click **Draft nudges** to see follow-up messages. AICOS only drafts; use **Approve draft** and **Send approved** to simulate human approval.
5. Click **Prep 1:1** to generate a meeting brief with suggested questions and open loops.
6. Open **Access & Context** to see what AICOS can see, what is walled off, and where it needs confirmation.

## What Is Real vs. Simulated

Real in this prototype:

- Role-based user experience across three business personas.
- Interactive role switching, generated roadmap state, meeting prep state, draft approvals, and send simulation.
- Trust controls: uncertainty flags, context confidence, and sensitive-data walls.
- Optional API endpoint at `/api/ai` for live AI generation.

Simulated for reviewer convenience:

- Connected calendar, email, Loop, Jira, Power BI, and document data are represented by seeded demo data.
- Outbound nudges are not actually sent.
- The prototype uses deterministic demo intelligence when no API key is configured.

## Optional AI Setup

The app works without setup. To enable live AI generation in a Vercel deployment, add:

```bash
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4.1-mini
```

If `OPENAI_API_KEY` is missing or the API is unavailable, the UI gracefully falls back to demo intelligence.

## AI Tools Used

- Codex was used to synthesize the interview themes, plan the prototype, generate the application code, and write this README.
- OpenAI image generation was used to create the visual concept for the app-shell dashboard.
- The optional `/api/ai` endpoint is designed to call OpenAI for live roadmap, nudge, meeting-prep, and briefing generation when configured.

## Two-Month MVP Roadmap

Week 1-2: Discovery and trust foundation

- Validate the role-based workflows with 5-8 target leaders.
- Define permission model for company-owned data, private notes, 1:1s, and sensitive HR categories.
- Add audit logs for every recommendation and drafted outbound action.

Week 3-4: Integrations and source of truth

- Connect calendar and email read access.
- Add Microsoft Loop or SharePoint document ingestion for project hubs and review materials.
- Add Jira or task-board ingestion for execution status.

Week 5-6: Real execution workflows

- Build approved-send integrations for email or Teams nudges.
- Add meeting-prep generation from recent context.
- Add objective-to-roadmap generation with owner confirmation and stale-context checks.

Week 7-8: Pilot readiness

- Add onboarding flows for managers and admins.
- Add feedback capture on recommendation quality.
- Add privacy review, observability, and usage analytics.
- Run a pilot with a small leadership team and refine the MVP scope based on real usage.

## Development Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
```

## Submission Notes

The homework asks for a GitHub repository, final commit tag named `v1-submission`, and a deployed URL. After final verification:

```bash
git add .
git commit -m "Build AICOS prototype"
git tag v1-submission
git push origin main --tags
```

Deploy to Vercel with:

```bash
vercel
vercel --prod
```
