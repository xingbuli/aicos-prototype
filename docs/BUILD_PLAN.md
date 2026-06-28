# AICOS — Build plan

Build in this order. After each milestone: `npm run build` (must pass), fix all errors, check the acceptance criteria, commit. **Priority rule:** content quality of the core loop (M2–M4) outranks shell depth (M6). If time runs short, cut M5/M6 scope — never M2–M4 polish.

## M0 — Scaffold & foundation
- Next.js 14 (App Router) + TS + Tailwind. `lib/types.ts` (types per `docs/CONTENT.md`), `lib/content.ts` (all curated data), `components/ui.tsx` (trust primitives, exact code in `docs/DESIGN.md`), `globals.css`, Tailwind tokens, fonts.
- **Done when:** dev server runs, tokens/fonts applied, `ConfidenceTag`/`StatusPill`/`KindBadge` render in isolation.

## M1 — Sign in / choose workspace
- Entry screen with the three workspace cards. Selecting one stores the choice (`localStorage`) and routes to the console. Sign-out / switch returns here.
- **Done when:** a user can pick any of the three leaders and land in that workspace; switching works.

## M2 — Core loop: briefing + roadmap board + access panel  *(highest value)*
- **Weekly briefing**: summary + items with `KindBadge` + `ConfidenceTag`; actionable items render an approvable **draft** (Approve → confirms "ready for you to send; AICOS won't send it for you"; Dismiss). At least one staged blind-spot item per persona (with a "Request access" secondary action where specified).
- **Roadmap board**: curated objectives → tasks with owner/due/`StatusPill`/`ConfidenceTag`/provenance; per-objective "AICOS needs you to confirm" open-questions block.
- **Access panel**: "What AICOS can see", off-limits rows visibly walled, each with "Ask a human" → request-access flow.
- All three populated per-persona from `lib/content.ts`, verbatim copy.
- **Done when:** every persona shows a complete, insightful, on-brand console with no placeholder text; drafts approve/dismiss; the blind-spot moment reads clearly.

## M3 — Objective composer + simulated generator
- Free-text box → `simulateRoadmap()` (spec in `docs/CONTENT.md`) → new objective card prepended, badged "Generated · simulated preview", `rise` animation. Validates empty input; ⌘/Ctrl-Enter submits.
- Keep model/provider selection out of v1 runtime. The demo should remain simulated and provider-neutral; add model selection to the backlog.
- **Done when:** any typed objective yields a sensible, well-formatted roadmap offline, instantly, every time.

## M4 — Chat + draft interactions
- **Talk to AICOS**: in-page side panel with 3 starter chips → curated persona-aware replies (`docs/CONTENT.md`); off-script input → the honest provider-neutral fallback. Smooth scroll, thinking state.
- Confirm all draft-approve/dismiss interactions from M2 feel finished.
- **Done when:** chat demonstrates the four rules in conversation; nothing dead-ends.

## M5 — Guided walkthrough
- Skippable 5-step spotlight tour (copy in `docs/CONTENT.md`), shown on first workspace entry, "seen" tracked in `localStorage`, relaunchable from Help. Steps highlight: briefing → a confidence tag → the blind-spot item → a draft's Approve → the objective box.
- **Done when:** a first-time evaluator is guided through the differentiator without reading anything; Skip and Replay both work.

## M6 — Product shells (thin, simulated, complete)
- **Help / How AICOS works**: four rules + FAQ + "Replay tour".
- **Request access / escalation modal**: from blind-spot items and off-limits rows; prefilled scope + note → "Send request" → confirmation → auto-close. Focus-trapped, Esc-closable.
- **Connected sources (Setup + Settings)**: per-persona connector list with connected/available states; simulated toggles; source choices reflected in sidebar and access counts.
- **Model provider note (Settings)**: provider/model selection is backlog work; no real LLM calls in the prototype.
- **Done when:** every shell opens, does its job, and closes cleanly; no dead buttons anywhere in the app.

## M7 — Polish
- Persistent "Interactive prototype · simulated workspace" marker. Empty/confirmation states written. Responsive pass (phone → desktop). A11y pass (focus, Esc, reduced motion, labels). Remove one decorative thing per screen.
- **Done when:** quality floor in `docs/DESIGN.md` is met; no console errors; looks intentional on a phone.

## M8 — README & ship
- Write `README.md` per `docs/PRD.md` → "README requirements" (what's real/simulated/assumed table, model-provider note, AI tools used, two-month roadmap from `docs/CONTENT.md`, submission steps).
- Verify `npm run build` clean and that the app runs with **no env vars**.
- Print the final submission commands for the human:
  ```bash
  git add -A && git commit -m "AICOS v1 submission"
  git tag v1-submission
  git push origin main --tags
  ```
- **Done when:** README is complete and honest; build is green; deploy-ready.

## Global acceptance (the assessment bar)
A non-technical evaluator opens the deployed URL and, without docs or settings: signs in, is guided through the trust differentiator, reads an insightful weekly briefing, approves a draft, generates a roadmap from their own objective, sees a blind spot handled honestly, and requests access through a human — all polished, all coherent, nothing broken.
