import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Home,
  Lock,
  Map,
  MessageSquareText,
  Mic,
  PanelRightOpen,
  Plus,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { personas } from "./data/personas.js";
import { createDemoResponse } from "./services/demoAi.js";

const navItems = [
  { id: "briefing", label: "Leadership Briefing", icon: Home },
  { id: "roadmaps", label: "Roadmaps", icon: Map },
  { id: "followups", label: "Follow-Up Queue", icon: ClipboardCheck },
  { id: "meetings", label: "Meeting Prep", icon: CalendarDays },
  { id: "context", label: "Access & Context", icon: ShieldCheck },
];

const statusLabels = {
  approved: "Approved draft",
  waiting: "Waiting",
  stale: "Stale context",
  sent: "Sent in demo",
};

function App() {
  const [personaId, setPersonaId] = useState("claudia");
  const [activeView, setActiveView] = useState("briefing");
  const [command, setCommand] = useState("");
  const [aiMode, setAiMode] = useState("Demo intelligence");
  const [isWorking, setIsWorking] = useState(false);
  const [lastBrief, setLastBrief] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [meetingPrep, setMeetingPrep] = useState(null);

  const persona = personas.find((item) => item.id === personaId);
  const activeMeeting = meetingPrep ?? persona.meetings[0];
  const activeRoadmap = roadmap ?? persona.roadmap;
  const visibleDrafts = drafts.length ? drafts : persona.followUps;

  const briefingCards = useMemo(
    () => [
      { label: "On track", value: persona.metrics.onTrack, tone: "good", icon: Check },
      { label: "Needs attention", value: persona.metrics.atRisk, tone: "warn", icon: AlertTriangle },
      { label: "Meetings this week", value: persona.metrics.meetings, tone: "info", icon: CalendarDays },
      { label: "Open actions", value: persona.metrics.actions, tone: "action", icon: ClipboardCheck },
    ],
    [persona],
  );

  async function runAicos(action, payload = {}) {
    setIsWorking(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, persona, payload }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result?.data) {
          setAiMode(result.mode ?? "Live AI");
          return result.data;
        }
      }
    } catch {
      // The hosted API is optional. The prototype remains fully usable without it.
    } finally {
      setIsWorking(false);
    }

    setAiMode("Demo intelligence");
    return createDemoResponse(action, persona, payload);
  }

  async function handleCommand(actionOverride) {
    const action = actionOverride ?? inferAction(command);
    const result = await runAicos(action, { command });
    applyAiResult(action, result);
  }

  function applyAiResult(action, result) {
    if (action === "roadmap") {
      setRoadmap(result);
      setActiveView("roadmaps");
    }

    if (action === "nudges") {
      setDrafts(result);
      setActiveView("followups");
    }

    if (action === "meeting") {
      setMeetingPrep(result);
      setActiveView("meetings");
    }

    if (action === "briefing") {
      setLastBrief(result);
      setActiveView("briefing");
    }
  }

  function approveDraft(id) {
    setDrafts((current) =>
      (current.length ? current : persona.followUps).map((draft) =>
        draft.id === id ? { ...draft, status: "approved" } : draft,
      ),
    );
  }

  function sendApprovedDrafts() {
    setDrafts((current) =>
      (current.length ? current : persona.followUps).map((draft) =>
        draft.status === "approved" ? { ...draft, status: "sent" } : draft,
      ),
    );
  }

  function resetPersona(nextId) {
    setPersonaId(nextId);
    setCommand("");
    setDrafts([]);
    setRoadmap(null);
    setMeetingPrep(null);
    setLastBrief(null);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>
          <div>
            <strong>AICOS</strong>
            <small>AI Chief of Staff</small>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeView === item.id ? "nav-item active" : "nav-item"}
                key={item.id}
                onClick={() => setActiveView(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <div className="card-title">
            <ShieldCheck size={16} />
            Context confidence
          </div>
          <div className="confidence-meter">
            <span style={{ width: `${persona.context.confidence}%` }} />
          </div>
          <div className="confidence-row">
            <span>AICOS knows</span>
            <strong>{persona.context.confidence}%</strong>
          </div>
          <div className="confidence-row warn-text">
            <span>Needs confirmation</span>
            <strong>{100 - persona.context.confidence}%</strong>
          </div>
          <button className="text-button" onClick={() => setActiveView("context")}>
            Review access panel
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="command-wrap">
            <Search size={18} />
            <input
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleCommand();
              }}
              placeholder='Ask AICOS: "prep my 1:1", "draft nudges", or "build roadmap"'
              aria-label="Ask AICOS"
            />
            <Mic size={18} />
            <button className="primary-button" onClick={() => handleCommand()}>
              <Sparkles size={16} />
              Ask
            </button>
          </div>

          <div className="persona-picker">
            <label htmlFor="persona">Demo role</label>
            <select
              id="persona"
              value={personaId}
              onChange={(event) => resetPersona(event.target.value)}
            >
              {personas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.role}
                </option>
              ))}
            </select>
            <ChevronDown size={16} />
          </div>
        </header>

        <section className="workspace">
          <div className="page-heading">
            <div>
              <p>{persona.role} / {persona.teamSize} person team</p>
              <h1>{viewTitle(activeView)}</h1>
            </div>
            <div className="mode-pill">
              <Bot size={16} />
              {isWorking ? "AICOS is drafting..." : aiMode}
            </div>
          </div>

          {activeView === "briefing" && (
            <BriefingView
              persona={persona}
              cards={briefingCards}
              lastBrief={lastBrief}
              onGenerateRoadmap={() => handleCommand("roadmap")}
              onDraftNudges={() => handleCommand("nudges")}
              onPrepMeeting={() => handleCommand("meeting")}
            />
          )}

          {activeView === "roadmaps" && (
            <RoadmapView roadmap={activeRoadmap} onGenerate={() => handleCommand("roadmap")} />
          )}

          {activeView === "followups" && (
            <FollowUpView
              drafts={visibleDrafts}
              onDraft={() => handleCommand("nudges")}
              onApprove={approveDraft}
              onSend={sendApprovedDrafts}
            />
          )}

          {activeView === "meetings" && (
            <MeetingView
              persona={persona}
              meeting={activeMeeting}
              onPrep={() => handleCommand("meeting")}
            />
          )}

          {activeView === "context" && <ContextView persona={persona} />}
        </section>
      </main>
    </div>
  );
}

function inferAction(command) {
  const normalized = command.toLowerCase();
  if (normalized.includes("roadmap") || normalized.includes("objective")) return "roadmap";
  if (normalized.includes("nudge") || normalized.includes("follow")) return "nudges";
  if (normalized.includes("1:1") || normalized.includes("meeting") || normalized.includes("prep")) {
    return "meeting";
  }
  return "briefing";
}

function viewTitle(view) {
  return {
    briefing: "Weekly Leadership Briefing",
    roadmaps: "Roadmaps",
    followups: "Follow-Up Queue",
    meetings: "Meeting Prep",
    context: "Access & Context",
  }[view];
}

function BriefingView({ persona, cards, lastBrief, onGenerateRoadmap, onDraftNudges, onPrepMeeting }) {
  return (
    <div className="dashboard-grid">
      <section className="metric-strip panel">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div className="metric" key={card.label}>
              <div className={`metric-icon ${card.tone}`}>
                <Icon size={18} />
              </div>
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </div>
          );
        })}
      </section>

      <section className="panel brief-panel">
        <div className="section-title">
          <div>
            <h2>Today’s operating brief</h2>
            <p>{lastBrief?.headline ?? persona.brief.headline}</p>
          </div>
          <button className="secondary-button">
            <FileText size={16} />
            Copy brief
          </button>
        </div>
        <div className="brief-list">
          {(lastBrief?.bullets ?? persona.brief.bullets).map((item) => (
            <div className="brief-item" key={item}>
              <Check size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel action-panel">
        <h2>Recommended next moves</h2>
        <button onClick={onGenerateRoadmap}>
          <Map size={17} />
          Generate roadmap
          <ArrowRight size={16} />
        </button>
        <button onClick={onDraftNudges}>
          <MessageSquareText size={17} />
          Draft nudges
          <ArrowRight size={16} />
        </button>
        <button onClick={onPrepMeeting}>
          <CalendarDays size={17} />
          Prep 1:1
          <ArrowRight size={16} />
        </button>
      </section>

      <section className="panel risk-table">
        <div className="section-title">
          <div>
            <h2>Risks & uncertainty flags</h2>
            <p>AICOS separates signals from gaps before recommending action.</p>
          </div>
        </div>
        {persona.risks.map((risk) => (
          <div className="risk-row" key={risk.title}>
            <div className={`severity ${risk.severity.toLowerCase()}`}>{risk.severity}</div>
            <div>
              <strong>{risk.title}</strong>
              <p>{risk.detail}</p>
              {risk.uncertain && (
                <span className="uncertainty">
                  I have no recent update from {risk.owner}; this may be stale. Want me to draft a
                  nudge?
                </span>
              )}
            </div>
            <span>{risk.owner}</span>
          </div>
        ))}
      </section>

      <section className="panel mini-roadmap">
        <div className="section-title">
          <div>
            <h2>Active objective</h2>
            <p>{persona.roadmap.objective}</p>
          </div>
          <span className="status-chip">{persona.roadmap.status}</span>
        </div>
        <Timeline roadmap={persona.roadmap} />
      </section>
    </div>
  );
}

function RoadmapView({ roadmap, onGenerate }) {
  return (
    <div className="two-column">
      <section className="panel roadmap-panel">
        <div className="section-title">
          <div>
            <h2>{roadmap.name}</h2>
            <p>{roadmap.objective}</p>
          </div>
          <button className="primary-button" onClick={onGenerate}>
            <Sparkles size={16} />
            Generate roadmap
          </button>
        </div>
        <Timeline roadmap={roadmap} detailed />
      </section>
      <section className="panel">
        <h2>Execution plan</h2>
        <div className="milestone-list">
          {roadmap.milestones.map((milestone) => (
            <article className="milestone" key={milestone.title}>
              <div>
                <strong>{milestone.title}</strong>
                <span>{milestone.owner} / {milestone.due}</span>
              </div>
              <p>{milestone.next}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Timeline({ roadmap, detailed = false }) {
  return (
    <div className={detailed ? "timeline detailed" : "timeline"}>
      <div className="timeline-head">
        {roadmap.weeks.map((week) => (
          <span key={week}>{week}</span>
        ))}
      </div>
      {roadmap.milestones.map((item, index) => (
        <div className="timeline-row" key={item.title}>
          <span>{index + 1}. {item.title}</span>
          <div className="timeline-track">
            <span
              className={`bar ${item.tone}`}
              style={{ left: `${item.start}%`, width: `${item.width}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FollowUpView({ drafts, onDraft, onApprove, onSend }) {
  const approvedCount = drafts.filter((draft) => draft.status === "approved").length;
  return (
    <div className="two-column">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Draft-not-send queue</h2>
            <p>AICOS composes actions for approval. Nothing fires autonomously.</p>
          </div>
          <div className="button-row">
            <button className="secondary-button" onClick={onDraft}>
              <RefreshCcw size={16} />
              Redraft
            </button>
            <button className="primary-button" onClick={onSend} disabled={!approvedCount}>
              <Send size={16} />
              Send approved
            </button>
          </div>
        </div>
        <div className="draft-list">
          {drafts.map((draft) => (
            <article className="draft-card" key={draft.id}>
              <div className="draft-header">
                <div className="avatar">{draft.initials}</div>
                <div>
                  <strong>{draft.owner}</strong>
                  <span>{draft.reason}</span>
                </div>
                <span className={`draft-status ${draft.status}`}>
                  {statusLabels[draft.status]}
                </span>
              </div>
              <p>{draft.message}</p>
              {draft.status !== "sent" && (
                <button className="secondary-button" onClick={() => onApprove(draft.id)}>
                  <Check size={16} />
                  Approve draft
                </button>
              )}
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>Why AICOS is asking</h2>
        <div className="explain-list">
          <p>
            Follow-ups are prioritized when an objective is blocked, an owner has not provided a
            recent update, or a meeting created an open loop.
          </p>
          <div>
            <Lock size={17} />
            Sensitive categories remain excluded from follow-up drafting.
          </div>
          <div>
            <PanelRightOpen size={17} />
            Each draft includes the reason so leaders can correct missing context.
          </div>
        </div>
      </section>
    </div>
  );
}

function MeetingView({ persona, meeting, onPrep }) {
  return (
    <div className="two-column">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>{meeting.title}</h2>
            <p>{meeting.owner} / {meeting.time}</p>
          </div>
          <button className="primary-button" onClick={onPrep}>
            <CalendarDays size={16} />
            Prep 1:1
          </button>
        </div>
        <div className="prep-block">
          <h3>Suggested conversation</h3>
          {meeting.questions.map((question) => (
            <div className="question" key={question}>
              <MessageSquareText size={16} />
              <span>{question}</span>
            </div>
          ))}
        </div>
        <div className="prep-block">
          <h3>Open loops</h3>
          {meeting.openLoops.map((item) => (
            <div className="brief-item" key={item}>
              <AlertTriangle size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <h2>Meeting calendar</h2>
        <div className="meeting-list">
          {persona.meetings.map((item) => (
            <article key={item.title}>
              <strong>{item.title}</strong>
              <span>{item.owner}</span>
              <p>{item.time}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ContextView({ persona }) {
  return (
    <div className="context-grid">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>What AICOS can see</h2>
            <p>Company-owned work context used for planning and follow-through.</p>
          </div>
          <span className="large-score">{persona.context.confidence}%</span>
        </div>
        <div className="access-list">
          {persona.context.allowed.map((item) => (
            <div className="access-row allowed" key={item}>
              <Check size={17} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Walled off</h2>
            <p>Restricted categories are explicitly unavailable to AICOS.</p>
          </div>
          <Lock size={24} />
        </div>
        <div className="access-list">
          {persona.context.restricted.map((item) => (
            <div className="access-row blocked" key={item}>
              <Lock size={17} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="panel full-span">
        <div className="section-title">
          <div>
            <h2>Needs confirmation</h2>
            <p>AICOS asks before turning incomplete context into action.</p>
          </div>
          <button className="secondary-button">
            <Plus size={16} />
            Add context
          </button>
        </div>
        <div className="gap-list">
          {persona.context.gaps.map((gap) => (
            <article key={gap.title}>
              <AlertTriangle size={18} />
              <div>
                <strong>{gap.title}</strong>
                <p>{gap.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
