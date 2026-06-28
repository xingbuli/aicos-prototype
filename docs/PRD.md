# AICOS — Product Requirements

## 1. Context

This is a take-home for **AES Product Lead — AI Business Incubation** (AES Next, a venture studio partnered with AI Fund / Andrew Ng). The brief: prototype an "AI-powered chief of staff that eliminates the administrative burden of managing teams and projects… it doesn't just track work — it does work… a virtual team member that supports your whole team. AICOS is not a chatbot or work-management software."

Two stated objectives for the prototype: **(1) gather user feedback to focus the MVP**, and **(2) demonstrate technical feasibility.** A non-technical user must be able to navigate it from a URL.

We are deliberately weighting **(1)** — the complete, satisfying, self-evident experience — and satisfying **(2)** through a clearly-documented simulation plus an optional bring-your-own-AI path. See `CLAUDE.md` for locked scope.

### The three users (anonymized AES interviews)

| User | Role | Team | Tracks in | Headline need | Signature concern |
|---|---|---|---|---|---|
| **Claudia Nep** | Sr. Director, Stakeholder Relations & Comms | 22 | Microsoft Loop | Turn OKRs into detailed roadmaps + orchestrate execution (her "killer feature") | Human-account-manager onboarding; accuracy without heavy intervention |
| **Alfredo Ordonez** | VP, International Business | 7 | Power BI (low adoption) | Track KPIs/objectives, nudge for follow-through, restore market intel | **AI over-reporting without context** — an in-person meeting it didn't see looking like it never happened |
| **Alex Lopez** | Digital Director | 12 | OKRs + Jira | Surface status/blockers/priority shifts across cross-functional teams | **Privacy** — doesn't record 1:1s; wants lightweight, non-intrusive support |

These three are almost certainly the evaluators (or stand-ins). Build *for* them by name. Full curated data in `docs/CONTENT.md`.

## 2. Thesis & differentiator

Everyone in this candidate pool will build "an AI that manages tasks." The differentiator is the **visible trust layer**, and it's not decoration — it's the direct answer to what these three users actually fear:

- **Draft, don't send** → nothing happens to a leader's team without approval.
- **Confidence on every claim** (Verified / Inferred / Blind spot) → answers Alfredo and Alex; an inference is never dressed as fact.
- **Name the gaps** → when work may have happened off-tool or in person, AICOS flags the blind spot instead of reporting a miss (Alfredo's exact scenario).
- **Respect the walls, with a governed path to request more** → restricted data (comp, un-recorded 1:1s) is off-limits; when AICOS needs access, it routes a request to a human (ties to Claudia's account-manager ask). Boundaries become a designed flow, not a limitation.

The product is *useful* because it does work (roadmaps, briefings, drafts). It's *adoptable* because of the trust layer. Both must be legible to a non-technical evaluator in the first two minutes.

## 3. The experience (screen by screen)

### 3.1 Sign in / choose workspace and sources
Frictionless, no real auth. A clean entry screen that frames AICOS in one line and presents the three leaders as **workspaces to enter**. Choosing a workspace opens a short source setup step with persona-specific defaults already selected. The user can turn simulated sources on/off before entering, and the sidebar, access view, and source counts reflect those choices. Copy in `docs/CONTENT.md` → "Sign-in".

### 3.2 First-run guided walkthrough
On first entry to a workspace, a **skippable 5-step spotlight tour** that stages the differentiator in order. It's the "saves the evaluator from reading the doc" mechanism. Steps and copy in `docs/CONTENT.md` → "Guided walkthrough". Relaunchable from Help. Track "seen" in `localStorage`; never force it twice.

### 3.3 Core loop (the home console)
The main screen. Three things in a deliberate hierarchy:

- **This week's briefing** (top, hero) — AICOS's prepared read: blockers, priority shifts, things to prepare for. Each item carries a confidence tag; actionable items include an **editable, approvable draft** with a two-step action flow: edit/review → stage as ready to send → leader marks it sent. The final receipt is simulated and explicit that no real message was sent. At least one item per persona is a staged **blind-spot** moment.
- **Hand AICOS a goal** — the free-text objective box → simulated roadmap generator (always works) → roadmap appears in the board, marked "Generated · simulated preview".
- **Objectives & roadmaps board** — curated objectives broken into owned, dated, status-tracked tasks, each with a confidence tag; AICOS's "open questions / confirm before relying on this" surfaced under each objective.
- **Prep Desk** — a simulated but visible action queue for deck review, meeting prep, nudge requests, 1:1 agenda prep, and follow-up scheduling. It honors Alfredo's slide-deck review ask and Claudia's scheduling/follow-up ask without pretending the prototype can edit PowerPoint files, send messages, read private 1:1s, or create calendar events. Every item is typed, editable where useful, marked with confidence, and clear about blind spots. Actions use the same approval-gated lifecycle: edit/review → stage → user commits the final prototype outcome, such as **Mark sent**, **Create calendar hold**, **Save agenda**, **Apply review notes**, or **Record note**.

Right rail / preview cards: **What AICOS can see** (access panel, with off-limits items visible) and **Talk to AICOS** (opens an in-page side panel).

### 3.4 Chat ("Talk to AICOS")
Simulated side panel, not a separate page. Suggested starter prompts produce curated, persona-aware replies that demonstrate the four rules in conversation. Off-script free text returns an honest fallback that says provider/model selection is backlog work. Copy in `docs/CONTENT.md` → "Chat".

### 3.5 Request access / escalation (the trust spine, extended)
Triggered from any blind-spot or off-limits item ("Request access" / "Ask a human"). Opens a modal that lets the leader request a scope (e.g., "Region C status in Power BI") with a note, routed to a **simulated human account manager**. Confirms ("Request sent to your AICOS account manager — you'll get a note when it's granted") and closes. No backend. This is realism *and* differentiator: AICOS handles boundaries by escalating through a person, never by bypassing them.

### 3.6 Product shells (thin, simulated, but complete)
- **Help / "How AICOS works"** — the four rules in plain language, a short FAQ, and a "Replay the tour" button. Copy in `docs/CONTENT.md` → "Help".
- **Connected sources (Setup + Settings)** — shows Slack, Teams, Jira, Microsoft Loop, Power BI, Calendar, Email as connectors with realistic connected/available states per persona, plus a one-line stated assumption that the real product would integrate the user's actual stack. Toggles are simulated local state but update the visible source panel and access counts.
- **Model provider note (Settings)** — states that the prototype does not require a real LLM provider and that provider/model selection belongs in the backlog.
- **Adoption note in Prep Desk** — Claudia's team-mode and role-impact objections are explicitly acknowledged: AICOS is framed as a team coordination layer with human setup/training, not a silent replacement for coordinators or project leads.
- **Sign out / switch workspace** — returns to 3.1.

## 4. Simulation & model-provider stance

- **Default:** every surface is curated or deterministically generated client-side. Zero provider setup; nothing can fail in front of the evaluator.
- **Simulated roadmap generator:** a pure function that decomposes any objective string into a sensible phased roadmap with inferred owners/dates, confidence tags, and an open-questions list — clearly badged "simulated preview". Spec + example in `docs/CONTENT.md`.
- **Provider selection backlog:** real model/provider configuration is deliberately deferred so the prototype does not imply a single required vendor. The future product should support model selection behind the same trust layer.

## 5. README requirements (graded deliverable)

The final `README.md` must include:
1. **What AICOS is** + the thesis (does work + trust spine), in a few sentences.
2. **For the evaluator:** open the URL, pick a workspace, confirm source setup, take the tour — no external setup needed.
3. **What's real vs. simulated vs. assumed** — an explicit, honest table. State that this is a curated, simulation-only prototype; that integrations (Slack/Teams/Jira/Loop/Power BI/Calendar/Email) are assumed and represented as placeholders because the real stack is unknown; and that no real data is used.
4. **Model provider note** — state that the prototype is provider-neutral and that model selection is backlog work.
5. **AI tools used, and how** — built with Codex and any other tools Buli used; no real runtime model is required for the evaluator flow.
6. **If I had two months** — the MVP roadmap (use the version in `docs/CONTENT.md` → "Two-month roadmap"; it's derived from the interviews).
7. **Submission** — the git tag commands (below).

## 6. Submission mechanics

```bash
git add -A && git commit -m "AICOS v1 submission"
git tag v1-submission
git push origin main --tags
```
Reply to the assignment with the live URL + the link to the `v1-submission` tag. (Push the tag — easy to forget.)
