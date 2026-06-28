import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Copy,
  FileText,
  Home,
  KeyRound,
  LogOut,
  Map,
  Menu,
  MessageSquare,
  Mic,
  Network,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import {
  CHAT_FALLBACK,
  CONNECTED_SOURCES_COPY,
  FOUR_RULES,
  HELP_FAQ,
  TOUR_STEPS,
  personas,
} from "./data/content.js";

const STATUS_META = {
  not_started: { label: "Not started", color: "#B7B2A6" },
  on_track: { label: "On track", color: "#0F766E" },
  blocked: { label: "Blocked", color: "#B0452A" },
  stale: { label: "Stale", color: "#9C6E12" },
  done: { label: "Done", color: "#0F766E" },
};

const CONFIDENCE_META = {
  verified: { label: "Verified", color: "#0F766E", soft: "#E5F0EE", ring: false },
  inferred: { label: "Inferred", color: "#9C6E12", soft: "#F4ECD8", ring: false },
  unknown: { label: "Blind spot", color: "#6B675E", soft: "#EFEDE7", ring: true },
};

const STORAGE_KEYS = {
  persona: "aicos.persona",
  byoKey: "aicos.anthropicKey",
  tourPrefix: "aicos.tourSeen.",
};

function App() {
  const [personaId, setPersonaId] = useLocalStorage(STORAGE_KEYS.persona, "");
  const [byoKey, setByoKey] = useLocalStorage(STORAGE_KEYS.byoKey, "");
  const [modal, setModal] = useState(null);
  const [showTour, setShowTour] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);

  const persona = personas.find((item) => item.id === personaId);

  useEffect(() => {
    if (!persona) return;
    const seen = localStorage.getItem(`${STORAGE_KEYS.tourPrefix}${persona.id}`);
    if (!seen) {
      setTourIndex(0);
      setShowTour(true);
    }
  }, [persona]);

  function enterWorkspace(nextPersonaId) {
    setPersonaId(nextPersonaId);
  }

  function signOut() {
    setPersonaId("");
    setModal(null);
    setShowTour(false);
  }

  function replayTour() {
    setModal(null);
    setTourIndex(0);
    setShowTour(true);
  }

  function finishTour() {
    if (persona) localStorage.setItem(`${STORAGE_KEYS.tourPrefix}${persona.id}`, "true");
    setShowTour(false);
  }

  if (!persona) {
    return <SignIn onEnter={enterWorkspace} />;
  }

  return (
    <>
      <Console
        persona={persona}
        byoKey={byoKey}
        onHelp={() => setModal({ type: "help" })}
        onSettings={() => setModal({ type: "settings" })}
        onSignOut={signOut}
        onRequestAccess={(scope) => setModal({ type: "request", scope })}
      />

      {modal?.type === "help" && (
        <HelpModal onClose={() => setModal(null)} onReplayTour={replayTour} />
      )}
      {modal?.type === "settings" && (
        <SettingsModal
          persona={persona}
          byoKey={byoKey}
          onKeyChange={setByoKey}
          onClose={() => setModal(null)}
        />
      )}
      {modal?.type === "request" && (
        <RequestAccessModal scope={modal.scope} onClose={() => setModal(null)} />
      )}
      {showTour && (
        <GuidedTour
          step={TOUR_STEPS[tourIndex]}
          index={tourIndex}
          total={TOUR_STEPS.length}
          onBack={() => setTourIndex((current) => Math.max(0, current - 1))}
          onNext={() => {
            if (tourIndex === TOUR_STEPS.length - 1) finishTour();
            else setTourIndex((current) => current + 1);
          }}
          onSkip={finishTour}
        />
      )}
    </>
  );
}

function SignIn({ onEnter }) {
  return (
    <main className="signin-screen">
      <section className="signin-copy">
        <p className="wordmark">AICOS</p>
        <h1>Your AI chief of staff.</h1>
        <p className="signin-line">
          It does the work, shows its confidence, and never acts without your say-so.
        </p>
      </section>

      <section className="workspace-picker" aria-label="Choose a workspace to enter">
        <p className="eyebrow">Choose a workspace to enter.</p>
        <div className="workspace-cards">
          {personas.map((persona) => (
            <button
              className="workspace-card"
              key={persona.id}
              onClick={() => onEnter(persona.id)}
            >
              <span>
                <strong>{persona.name}</strong>
                <small>
                  {persona.cardRole} · {persona.team}-person team
                </small>
              </span>
              <span className="card-action">
                Continue as {persona.name.split(" ")[0]} <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
        <p className="prototype-footnote">Interactive prototype · simulated workspace · no real data.</p>
      </section>
    </main>
  );
}

function Console({ persona, byoKey, onHelp, onSettings, onSignOut, onRequestAccess }) {
  const [objectives, setObjectives] = useState(persona.objectives);
  const [objectiveText, setObjectiveText] = useState(persona.objectivePrompt);
  const [objectiveError, setObjectiveError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftStates, setDraftStates] = useState({});
  const [chatMessages, setChatMessages] = useState([
    {
      id: "hello",
      role: "aicos",
      text: `I'm ready for ${persona.name}'s week. Pick a prompt or ask where the blind spots are.`,
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeView, setActiveView] = useState("Home");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setObjectives(persona.objectives);
    setObjectiveText(persona.objectivePrompt);
    setObjectiveError("");
    setDraftStates({});
    setChatInput("");
    setActiveView("Home");
    setChatMessages([
      {
        id: "hello",
        role: "aicos",
        text: `I'm ready for ${persona.name}'s week. Pick a prompt or ask where the blind spots are.`,
      },
    ]);
  }, [persona]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function notify(message) {
    setToast(message);
  }

  function scrollToPanel(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function navigatePanel(item) {
    setActiveView(item.label);
    setMobileNavOpen(false);
    if (item.target) {
      scrollToPanel(item.target);
      notify(`Showing ${item.label}.`);
      return;
    }
    if (item.label === "Integrations") {
      onSettings();
      return;
    }
    notify(`${item.label} is not a separate workspace yet.`);
  }

  function copyBrief() {
    const text = [
      "AICOS Weekly Leadership Briefing",
      persona.briefing.summary,
      "",
      ...persona.briefing.items.map((item) => `- ${item.title}: ${item.body}`),
    ].join("\n");
    navigator.clipboard?.writeText(text).catch(() => {});
    notify("Brief copied.");
  }

  async function submitObjective(event) {
    event?.preventDefault();
    const clean = objectiveText.trim();
    if (!clean) {
      setObjectiveError("Give AICOS an objective first.");
      return;
    }
    setObjectiveError("");
    setIsGenerating(true);
    const generated = await generateRoadmap(clean, persona, byoKey);
    setObjectives((current) => [generated, ...current]);
    setIsGenerating(false);
  }

  function setDraftState(itemId, state) {
    setDraftStates((current) => ({ ...current, [itemId]: state }));
  }

  async function sendChat(prompt) {
    const text = prompt.trim();
    if (!text) return;

    const userMessage = { id: `user-${Date.now()}`, role: "user", text };
    setChatMessages((current) => [...current, userMessage]);
    setChatInput("");
    setIsThinking(true);

    const reply = await getChatReply(text, persona, byoKey);
    setChatMessages((current) => [
      ...current,
      { id: `aicos-${Date.now()}`, role: "aicos", text: reply },
    ]);
    setIsThinking(false);
  }

  return (
    <div className={`app-shell ${mobileNavOpen ? "nav-open" : ""}`}>
      <Sidebar
        persona={persona}
        activeView={activeView}
        onNavigate={navigatePanel}
        onHelp={onHelp}
        onSettings={onSettings}
        onSignOut={onSignOut}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="workspace">
        <Topbar
          persona={persona}
          input={chatInput}
          isThinking={isThinking}
          onInput={setChatInput}
          onSend={sendChat}
          onOpenNav={() => setMobileNavOpen(true)}
          onNotifications={() => {
            setActiveView("Risks & Alerts");
            scrollToPanel("risks");
            notify("Showing risks and alerts.");
          }}
          onCalendar={() => {
            setActiveView("Meetings");
            scrollToPanel("meetings");
            notify("Showing meeting prep.");
          }}
          onProfile={onSettings}
        />

        <main className="console">
          <BriefingSection persona={persona} onCopyBrief={copyBrief} />

          <section className="dashboard-grid" aria-label="AICOS weekly dashboard">
            <div className="dashboard-main">
              <RoadmapBoard
                objectives={objectives}
                value={objectiveText}
                error={objectiveError}
                isGenerating={isGenerating}
                hasByoKey={Boolean(byoKey.trim())}
                onChange={setObjectiveText}
                onSubmit={submitObjective}
                onRoadmapActions={() => notify("Roadmap actions menu is ready for version 2.")}
              />
              <RisksTable objectives={objectives} persona={persona} />
            </div>

            <aside className="dashboard-side">
              <FollowUpQueue
                persona={persona}
                draftStates={draftStates}
                onDraftState={setDraftState}
                onRequestAccess={onRequestAccess}
                onViewAll={() => {
                  setActiveView("Follow-Ups");
                  scrollToPanel("followups");
                  notify("Showing all visible follow-ups.");
                }}
              />
              <MeetingsPanel
                persona={persona}
                onSend={sendChat}
                onViewCalendar={() => {
                  setActiveView("Meetings");
                  scrollToPanel("meetings");
                  notify("Calendar view is represented by meeting prep in this demo.");
                }}
              />
              <AccessPanel persona={persona} onRequestAccess={onRequestAccess} />
              <ChatPanel messages={chatMessages} isThinking={isThinking} />
            </aside>
          </section>
        </main>
        {toast && (
          <div className="toast" role="status" aria-live="polite">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ persona, activeView, onNavigate, onHelp, onSettings, onSignOut, onClose }) {
  const navItems = [
    { label: "Home", icon: Home, target: "briefing" },
    { label: "Leadership Briefing", icon: ClipboardList, target: "briefing" },
    { label: "Roadmaps", icon: Map, target: "roadmaps" },
    { label: "Follow-Ups", icon: MessageSquare, badge: "12", target: "followups" },
    { label: "Meetings", icon: CalendarDays, target: "meetings" },
    { label: "Risks & Alerts", icon: TriangleAlert, badge: "5", tone: "danger", target: "risks" },
    { label: "Goals", icon: Target, target: "roadmaps" },
    { label: "Documents", icon: FileText },
    { label: "People", icon: Users },
    { label: "Integrations", icon: Network },
  ];

  return (
    <>
      <button className="nav-scrim" aria-label="Close navigation" onClick={onClose} />
      <aside className="sidebar" aria-label="AICOS navigation">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden>
            <span />
          </div>
          <div>
            <p>AICOS</p>
            <span>AI Chief of Staff</span>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`nav-item ${activeView === item.label ? "active" : ""}`}
                key={item.label}
                onClick={() => onNavigate(item)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.badge && <strong className={item.tone}>{item.badge}</strong>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="source-card">
            <p>AICOS is connected to</p>
            <div className="source-icons" aria-label="Connected sources">
              {persona.connectors.slice(0, 7).map((connector) => (
                <span key={connector.source}>{connector.source.slice(0, 1)}</span>
              ))}
              <small>+3</small>
            </div>
          </div>

          <div className="confidence-card">
            <div className="confidence-topline">
              <span>Context confidence</span>
              <strong>High</strong>
            </div>
            <div className="confidence-meter" aria-hidden>
              <span />
            </div>
            <p>AICOS knows most of your context</p>
            <div className="confidence-row">
              <span><i className="known" />Knows</span>
              <strong>87%</strong>
            </div>
            <div className="confidence-row">
              <span><i className="needs" />Needs confirmation</span>
              <strong>13%</strong>
            </div>
            <button onClick={onHelp}>Review context</button>
          </div>

          <button className="nav-item utility" onClick={onSettings}>
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button className="nav-item utility" onClick={onSignOut}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

function Topbar({
  persona,
  input,
  isThinking,
  onInput,
  onSend,
  onOpenNav,
  onNotifications,
  onCalendar,
  onProfile,
}) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onOpenNav} aria-label="Open navigation">
        <Menu size={18} />
      </button>
      <form
        className="command-bar"
        onSubmit={(event) => {
          event.preventDefault();
          onSend(input);
        }}
      >
        <Search size={16} />
        <label className="sr-only" htmlFor="aicos-command">
          Ask AICOS
        </label>
        <input
          id="aicos-command"
          value={input}
          onChange={(event) => onInput(event.target.value)}
          placeholder={'Ask AICOS anything... (e.g., "Prepare me for my 1:15" or "What are our top risks?")'}
        />
        <button
          className="voice-button"
          type="button"
          aria-label="Voice input"
          onClick={() => onSend("What should I focus on today?")}
        >
          <Mic size={15} />
        </button>
        <button className="ask-button" disabled={isThinking}>
          {isThinking ? "Checking" : "Ask"}
        </button>
      </form>
      <div className="topbar-meta">
        <button className="top-icon alert" aria-label="Notifications" onClick={onNotifications}>
          <span>3</span>
          <Bell size={16} />
        </button>
        <button className="top-icon" aria-label="Calendar" onClick={onCalendar}>
          <CalendarDays size={16} />
        </button>
        <div className="date-stack">
          <strong>May 12, 2025</strong>
          <span>Mon 9:41 AM</span>
        </div>
        <button className="avatar-menu" aria-label={`${persona.name} profile`} onClick={onProfile}>
          {persona.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
        </button>
      </div>
    </header>
  );
}

function BriefingSection({ persona, onCopyBrief }) {
  const blockerCount = persona.briefing.items.filter((item) => item.kind === "blocker").length;
  const priorityItem = persona.briefing.items.find((item) => item.kind === "blocker") ?? persona.briefing.items[0];
  const tasks = persona.objectives.flatMap((objective) => objective.tasks);
  const onTrack = tasks.filter((task) => task.status === "on_track").length;
  const atRisk = tasks.filter((task) => ["blocked", "stale"].includes(task.status)).length;
  const metrics = [
    { label: "On track", value: onTrack + 3, delta: "+2", icon: CheckCircle2, tone: "success" },
    { label: "At risk", value: atRisk + blockerCount, delta: "+1", icon: TriangleAlert, tone: "warning" },
    { label: "Meetings", value: 24, delta: "+4", icon: CalendarDays, tone: "blue" },
    { label: "Action items", value: 42, delta: "-3", icon: Check, tone: "purple" },
  ];

  return (
    <section className="briefing-card rise" data-tour="briefing" id="briefing">
      <div className="briefing-heading">
        <div>
          <h1>Weekly Leadership Briefing</h1>
          <span>{persona.name} · May 12 - May 18, 2025</span>
        </div>
        <button className="copy-brief" onClick={onCopyBrief}>
          <Copy size={14} />
          Copy brief
        </button>
      </div>

      <div className="focus-brief">
        <div className="focus-copy">
          <span className="section-kicker">Decision that needs you</span>
          <h2>{priorityItem.title}</h2>
          <p>{priorityItem.body}</p>
          <div className="focus-actions">
            <a href="#risks">Review blocker <ArrowRight size={13} /></a>
            <ConfidenceTag confidence={priorityItem.confidence} />
          </div>
        </div>
        <div className="trust-card" aria-label="AICOS confidence summary">
          <div className="trust-card-top">
            <ShieldCheck size={18} />
            <span>Context confidence</span>
            <strong>87%</strong>
          </div>
          <div className="trust-meter" aria-hidden>
            <span />
          </div>
          <div className="trust-sources">
            {persona.connectors.slice(0, 4).map((connector) => (
              <span key={connector.source}>{connector.source}</span>
            ))}
          </div>
          <small><Clock3 size={13} /> Refreshed 12 minutes ago</small>
        </div>
      </div>

      <div className="metric-strip">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className="metric-card" key={metric.label} data-tone={metric.tone}>
              <span className="metric-icon">
                <Icon size={16} />
              </span>
              <div>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                <small>
                  vs last week <b>{metric.delta}</b>
                </small>
              </div>
            </article>
          );
        })}
      </div>

      <div className="top-insight">
        <strong>Top insight:</strong>
        <span>{persona.briefing.summary}</span>
        <a href="#risks">View all insights <ArrowRight size={13} /></a>
      </div>
    </section>
  );
}

function FollowUpQueue({ persona, draftStates, onDraftState, onRequestAccess, onViewAll }) {
  const owners = ["Alex Martinez", "Taylor Singh", "Jamie Williams", "Emily Rogers", "Daniel Kim"];
  const dueDates = ["May 13", "May 14", "May 15", "May 16", "May 16"];
  const items = [
    ...persona.briefing.items.map((item, index) => ({
      ...item,
      owner: owners[index] ?? persona.name,
      due: dueDates[index] ?? "May 17",
    })),
    {
      id: "manual-update",
      kind: "prep",
      confidence: "verified",
      title: "Update comms plan",
      body: "Add the latest launch dependency and send the revised plan for review.",
      owner: "Daniel Kim",
      due: "May 16",
    },
  ];

  return (
    <section className="panel follow-panel" id="followups">
      <PanelTitle title="Follow-Up Queue" badge="12" action="View all" onAction={onViewAll} />
      <div className="queue-table">
        <div className="queue-head">
          <span>Owner</span>
          <span>Next action</span>
          <span>Due</span>
        </div>
        {items.map((item, index) => (
          <article
            className="queue-row"
            key={item.id}
            data-tour={item.confidence === "unknown" ? "blindspot" : undefined}
          >
            <span className="person-cell">
              <Avatar name={item.owner} />
              {item.owner}
            </span>
            <div>
              <strong>{item.title}</strong>
              <small data-tour={index === 0 ? "confidence" : undefined}>
                <ConfidenceTag confidence={item.confidence} />
              </small>
            </div>
            <time>{item.due}</time>
          </article>
        ))}
      </div>
      <DraftStack
        items={items}
        draftStates={draftStates}
        onDraftState={onDraftState}
        onRequestAccess={onRequestAccess}
      />
    </section>
  );
}

function DraftStack({ items, draftStates, onDraftState, onRequestAccess }) {
  const actionable = items.filter((item) => item.draft || item.secondaryAction).slice(0, 1);
  if (!actionable.length) return null;
  return (
    <div className="draft-stack">
      {actionable.map((item) => (
        <DraftCard
          item={item}
          key={item.id}
          state={draftStates[item.id] ?? "open"}
          onApprove={() => onDraftState(item.id, "approved")}
          onDismiss={() => onDraftState(item.id, "dismissed")}
          onRequestAccess={onRequestAccess}
        />
      ))}
    </div>
  );
}

function DraftCard({ item, state, onApprove, onDismiss, onRequestAccess }) {
  if (state !== "open") {
    return (
      <div className="draft-card resolved">
        <Check size={15} />
        {state === "approved"
          ? "Draft approved. AICOS will wait for you to send it."
          : "Draft dismissed. AICOS will leave it untouched."}
      </div>
    );
  }

  return (
    <article className="draft-card" data-tour="draft">
      <div className="draft-label">
        <Sparkles size={14} />
        Draft ready
      </div>
      <strong>{item.draft?.subject ?? item.title}</strong>
      <p>{item.draft?.body ?? item.body}</p>
      <div className="button-row">
        <button className="btn btn-primary" onClick={onApprove}>
          <Check size={15} /> Approve
        </button>
        <button className="btn btn-ghost" onClick={onDismiss}>
          Dismiss
        </button>
        {item.secondaryAction && (
          <button className="tiny-link" onClick={() => onRequestAccess(item.secondaryAction.scope)}>
            {item.secondaryAction.label}
          </button>
        )}
      </div>
    </article>
  );
}

function RoadmapBoard({
  objectives,
  value,
  error,
  isGenerating,
  hasByoKey,
  onChange,
  onSubmit,
  onRoadmapActions,
}) {
  const objective = objectives[0];
  const timelineDates = ["12", "19", "26", "2", "9", "16", "23", "30", "7", "14"];
  return (
    <section className="panel roadmap-board" data-tour="objective" id="roadmaps">
      <div className="panel-heading">
        <div>
          <h2>Roadmap: {objective.title.replace(/^Roadmap:\s*/i, "")}</h2>
          <div className="panel-subline">
            <StatusPill status={objective.tasks.some((task) => task.status === "blocked") ? "blocked" : "on_track"} />
            <span>Updated from connected workstreams</span>
          </div>
        </div>
        <button className="more-button" aria-label="Roadmap actions" onClick={onRoadmapActions}>...</button>
      </div>

      <div className="roadmap-meta">
        <span><small>Objective</small>{objective.okr}</span>
        <span><small>Target</small>Jun 30, 2025</span>
        <span><small>Owner</small><Avatar name={objective.tasks[0]?.owner ?? "AICOS"} /> {objective.tasks[0]?.owner}</span>
      </div>

      <div className="timeline">
        <div className="timeline-months">
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
        </div>
        <div className="timeline-axis">
          <span>Initiative</span>
          {timelineDates.map((date) => <span key={date}>{date}</span>)}
        </div>
        {objective.tasks.slice(0, 5).map((task, index) => (
          <div className="timeline-row" key={task.title}>
            <span>{index + 1}. {task.title}</span>
            <i
              className={`bar ${task.status}`}
              style={{
                "--start": `${3 + index}`,
                "--span": `${index === 1 ? 3 : index === 2 ? 4 : 2}`,
              }}
            />
          </div>
        ))}
      </div>

      <form className="roadmap-composer" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="objective">Generate a roadmap objective</label>
        <span className="composer-label">Create a new plan</span>
        <input
          id="objective"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Describe a goal for AICOS to turn into a roadmap"
        />
        <small>{error || (hasByoKey ? "Live mode available" : "Simulated preview")}</small>
        <button className="btn btn-primary" disabled={isGenerating}>
          <Sparkles size={15} />
          {isGenerating ? "Generating..." : "Generate roadmap"}
        </button>
      </form>
    </section>
  );
}

function RisksTable({ objectives, persona }) {
  const rows = objectives
    .flatMap((objective) => objective.tasks.map((task) => ({ ...task, objective: objective.title })))
    .filter((task) => task.status !== "on_track")
    .slice(0, 5);

  const fallback = persona.briefing.items.map((item, index) => ({
    title: item.title,
    owner: ["Alex Martinez", "Jamie Williams", "Emily Rogers"][index] ?? persona.name,
    status: item.kind === "blocker" ? "blocked" : "stale",
    objective: item.body,
    confidence: item.confidence,
  }));

  return (
    <section className="panel risks-panel" id="risks">
      <PanelTitle title="Risks & Blockers" badge="5" action="View all" onAction={() => document.getElementById("risks")?.scrollIntoView({ behavior: "smooth" })} />
      <div className="risk-table">
        <div className="risk-head">
          <span>Severity</span>
          <span>Risk / blocker</span>
          <span>Impact</span>
          <span>Owner</span>
          <span>Trend</span>
        </div>
        {[...rows, ...fallback].slice(0, 5).map((row, index) => (
          <article className="risk-row" key={`${row.title}-${index}`}>
            <Severity status={row.status} />
            <div>
              <strong>{row.title}</strong>
              <small>{row.objective}</small>
            </div>
            <span>{row.status === "blocked" ? "Launch delay" : "Timeline risk"}</span>
            <span className="owner-cell"><Avatar name={row.owner} /> {row.owner}</span>
            <Sparkline tone={row.status === "blocked" ? "danger" : "warning"} />
          </article>
        ))}
      </div>
      <footer className="panel-footer">Risk model last updated May 12, 8:15 AM <a href="#top">View all risks <ArrowRight size={13} /></a></footer>
    </section>
  );
}

function MeetingsPanel({ persona, onSend, onViewCalendar }) {
  const [activeTab, setActiveTab] = useState("1:1s");
  const meetings = [
    { title: "Staff meeting", person: persona.name, role: persona.role, time: "Today, 10:00 - 10:30 AM", tone: "teal" },
    { title: "Director, People", person: "Taylor Singh", role: "Director, People", time: "Today, 2:00 - 2:30 PM", tone: "purple" },
  ];
  const visibleMeetings =
    activeTab === "Staff meeting"
      ? meetings.filter((meeting) => meeting.title === "Staff meeting")
      : meetings;
  return (
    <section className="panel meetings-panel" id="meetings">
      <PanelTitle title="Prep for your meetings" icon={CalendarDays} />
      <div className="meeting-tabs">
        {["1:1s", "Staff meeting"].map((tab) => (
          <button
            className={activeTab === tab ? "active" : ""}
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="meeting-list">
        {visibleMeetings.map((meeting) => (
          <article className="meeting-card" key={meeting.person}>
            <div className={`meeting-avatar ${meeting.tone}`}>{meeting.person.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
            <div>
              <strong>{meeting.person}</strong>
              <span>{meeting.role}</span>
              <small>{meeting.time}</small>
              <p><CalendarDays size={13} /> 6 <MessageSquare size={13} /> 3</p>
            </div>
            <button onClick={() => onSend(`Prepare me for ${meeting.person}`)}>Prep 1:1</button>
          </article>
        ))}
      </div>
      <button className="panel-link as-button" onClick={onViewCalendar}>View full calendar <ArrowRight size={13} /></button>
    </section>
  );
}

function AccessPanel({ persona, onRequestAccess }) {
  const connected = persona.access.filter((item) => item.state !== "off");
  const blocked = persona.access.filter((item) => item.state === "off");
  return (
    <section className="panel access-card" id="context">
      <div className="panel-heading">
        <h2>What AICOS knows vs. needs confirmation</h2>
        <button className="text-action" onClick={() => onRequestAccess("Review context sources")}>Manage context</button>
      </div>
      <div className="knowledge-block">
        <div className="knowledge-title success">
          <CheckCircle2 size={16} />
          <strong>AICOS knows</strong>
          <span>87%</span>
        </div>
        <ul>
          {connected.slice(0, 5).map((item) => (
            <li key={item.source}>{item.source}: {item.level}</li>
          ))}
        </ul>
      </div>
      <div className="knowledge-block">
        <div className="knowledge-title warning">
          <TriangleAlert size={16} />
          <strong>Needs confirmation</strong>
          <span>13%</span>
        </div>
        <ul>
          {blocked.map((item) => (
            <li key={item.source}>{item.source}{item.note ? `: ${item.note}` : ""}</li>
          ))}
          <li>Confirm stakeholder notes before executive review</li>
        </ul>
      </div>
      <button className="panel-link as-button" onClick={() => onRequestAccess("Confirm context gaps")}>Review all context gaps <ArrowRight size={13} /></button>
    </section>
  );
}

function ChatPanel({ messages, isThinking }) {
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <section className="panel chat-card">
      <PanelTitle title="AICOS response" icon={Bot} />
      <div className="chat-log" ref={messagesRef}>
        {messages.slice(-3).map((message) => (
          <div className={`chat-bubble ${message.role}`} key={message.id}>
            {message.text}
          </div>
        ))}
        {isThinking && <div className="chat-bubble aicos">Checking connected sources and confidence tags...</div>}
      </div>
    </section>
  );
}

function PanelTitle({ title, badge, action, icon: Icon, onAction }) {
  return (
    <div className="panel-title">
      <h2>{Icon && <Icon size={16} />} {title}</h2>
      <span>
        {badge && <b>{badge}</b>}
        {action && <button onClick={onAction}>{action}</button>}
      </span>
    </div>
  );
}

function Avatar({ name }) {
  return <span className="avatar">{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>;
}

function Severity({ status }) {
  const label = status === "blocked" ? "High" : status === "stale" ? "Medium" : "Low";
  return <span className={`severity ${label.toLowerCase()}`}>{label}</span>;
}

function Sparkline({ tone }) {
  return (
    <svg className={`sparkline ${tone}`} viewBox="0 0 72 24" aria-hidden>
      <polyline points="0,18 12,15 22,16 34,8 45,12 55,5 72,14" />
    </svg>
  );
}

function HelpModal({ onClose, onReplayTour }) {
  return (
    <Modal title="How AICOS works" onClose={onClose} size="wide">
      <p className="modal-intro">
        AICOS is a chief of staff, not a chatbot. It does work — roadmaps, briefings, drafts — and
        it works inside clear lines so you can trust what it hands you.
      </p>
      <div className="rules-grid">
        {FOUR_RULES.map((rule) => (
          <article key={rule.title}>
            <h3>{rule.title}</h3>
            <p>{rule.body}</p>
          </article>
        ))}
      </div>
      <div className="faq-list">
        {HELP_FAQ.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      <div className="modal-actions">
        <button className="btn btn-primary" onClick={onReplayTour}>
          <RotateCcw size={16} /> Replay the guided tour
        </button>
      </div>
    </Modal>
  );
}

function SettingsModal({ persona, byoKey, onKeyChange, onClose }) {
  const [saved, setSaved] = useState(false);
  const [connectorState, setConnectorState] = useState(() =>
    Object.fromEntries(persona.connectors.map((connector) => [connector.source, connector.state])),
  );

  useEffect(() => {
    setConnectorState(
      Object.fromEntries(persona.connectors.map((connector) => [connector.source, connector.state])),
    );
  }, [persona]);

  return (
    <Modal title="Settings" onClose={onClose} size="wide">
      <section className="settings-section">
        <div>
          <p className="eyebrow">Connected sources</p>
          <p>{CONNECTED_SOURCES_COPY}</p>
        </div>
        <div className="connector-list">
          {persona.connectors.map((connector) => {
            const isConnected = connectorState[connector.source] === "connected";
            return (
              <button
                className={`connector-row ${isConnected ? "connected" : ""}`}
                key={connector.source}
                onClick={() =>
                  setConnectorState((current) => ({
                    ...current,
                    [connector.source]: isConnected ? "available" : "connected",
                  }))
                }
              >
                <span>
                  <strong>{connector.source}</strong>
                  <small>{isConnected ? "connected" : "available"}</small>
                </span>
                <span className="toggle" aria-hidden>
                  <span />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="settings-section">
        <div>
          <p className="eyebrow">Bring your own AI model</p>
          <p>
            Optional. Leave this blank and the prototype remains fully satisfying with simulated
            briefings, chat, and roadmap generation. If you paste an Anthropic API key, AICOS will
            try live generation for the objective box and chat, then fall back silently if anything
            fails. The key is stored client-side only.
          </p>
        </div>
        <label className="key-field">
          <KeyRound size={18} />
          <input
            type="password"
            value={byoKey}
            placeholder="Anthropic API key (optional)"
            onChange={(event) => {
              setSaved(false);
              onKeyChange(event.target.value);
            }}
          />
        </label>
        <div className="modal-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setSaved(true);
              window.setTimeout(() => setSaved(false), 1800);
            }}
          >
            Save settings
          </button>
          {saved && <span className="saved-note">Saved locally. No setup required.</span>}
        </div>
      </section>
    </Modal>
  );
}

function RequestAccessModal({ scope, onClose }) {
  const [requestedScope, setRequestedScope] = useState(scope ?? "");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!sent) return undefined;
    const timer = window.setTimeout(onClose, 1800);
    return () => window.clearTimeout(timer);
  }, [sent, onClose]);

  return (
    <Modal title="Request access through your account manager" onClose={onClose}>
      {sent ? (
        <div className="confirmation-state">
          <Check size={22} />
          <p>
            {
              "Request sent to your AICOS account manager. You'll get a note here when access is granted. AICOS won't access anything until then."
            }
          </p>
        </div>
      ) : (
        <>
          <p className="modal-intro">
            {
              "AICOS won't reach into anything you haven't granted. Describe what you'd like it to see, and your AICOS account manager will set it up."
            }
          </p>
          <label className="field-label">
            What should AICOS be able to see?
            <input value={requestedScope} onChange={(event) => setRequestedScope(event.target.value)} />
          </label>
          <label className="field-label">
            Note (optional)
            <textarea rows={3} value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={() => setSent(true)}>
              Send request
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

function GuidedTour({ step, index, total, onBack, onNext, onSkip }) {
  useEffect(() => {
    document.querySelectorAll("[data-tour]").forEach((node) => {
      node.classList.toggle("tour-highlight", node.getAttribute("data-tour") === step.target);
    });
    document.querySelector(`[data-tour="${step.target}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return () => {
      document.querySelectorAll("[data-tour]").forEach((node) => node.classList.remove("tour-highlight"));
    };
  }, [step]);

  return (
    <div className="tour-panel" role="dialog" aria-modal="true" aria-label="Guided walkthrough">
      <div>
        <p className="eyebrow">
          Step {index + 1} of {total}
        </p>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
      </div>
      <div className="tour-actions">
        <button className="btn btn-ghost" onClick={onSkip}>
          Skip tour
        </button>
        <button className="icon-button" onClick={onBack} disabled={index === 0} aria-label="Back">
          <ChevronLeft size={16} />
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          {index === total - 1 ? "Start using AICOS" : "Next"}
          {index !== total - 1 && <ChevronRight size={16} />}
        </button>
      </div>
    </div>
  );
}

function Modal({ title, children, onClose, size = "default" }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const first = modalRef.current?.querySelector("button, [href], input, textarea, select, summary");
    first?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusable = [
        ...modalRef.current.querySelectorAll("button, [href], input, textarea, select, summary"),
      ].filter((node) => !node.disabled);
      if (focusable.length === 0) return;

      const firstNode = focusable[0];
      const lastNode = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === firstNode) {
        event.preventDefault();
        lastNode.focus();
      } else if (!event.shiftKey && document.activeElement === lastNode) {
        event.preventDefault();
        firstNode.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`modal ${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={17} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function StatusPill({ status }) {
  const meta = STATUS_META[status];
  return (
    <span className="status-pill">
      <span className="dot" style={{ background: meta.color }} aria-hidden />
      <span style={{ color: meta.color }}>{meta.label}</span>
    </span>
  );
}

function ConfidenceTag({ confidence }) {
  const meta = CONFIDENCE_META[confidence];
  const title =
    confidence === "verified"
      ? "Confirmed from a connected source"
      : confidence === "inferred"
        ? "AICOS's best inference — confirm before relying on it"
        : "AICOS can't see this — flagged, not assumed";
  return (
    <span
      className="confidence-tag"
      style={{ background: meta.soft, color: meta.color }}
      title={title}
    >
      <span
        className="dot"
        style={
          meta.ring
            ? { background: "transparent", boxShadow: `inset 0 0 0 1.5px ${meta.color}` }
            : { background: meta.color }
        }
        aria-hidden
      />
      {meta.label}
    </span>
  );
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (value) localStorage.setItem(key, value);
      else localStorage.removeItem(key);
    } catch {
      // Local storage is optional; the prototype still runs without persistence.
    }
  }, [key, value]);

  return [value, setValue];
}

async function generateRoadmap(objective, persona, byoKey) {
  if (byoKey.trim()) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "roadmap", objective, persona, apiKey: byoKey.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.objective?.tasks?.length) {
          return {
            ...data.objective,
            id: `live-${Date.now()}`,
            generated: true,
            live: true,
          };
        }
      }
    } catch {
      // Live mode is optional. Fall back to simulation without interrupting the evaluator.
    }
  }

  return simulateRoadmap(objective, persona);
}

async function getChatReply(text, persona, byoKey) {
  if (byoKey.trim()) {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "chat", message: text, persona, apiKey: byoKey.trim() }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.reply) return data.reply;
      }
    } catch {
      // Keep the demo reliable in optional live mode.
    }
  }

  return persona.chatReplies[text] ?? CHAT_FALLBACK;
}

function simulateRoadmap(objective, persona) {
  const firstWords = objective.split(/\s+/).filter(Boolean).slice(0, 8).join(" ");
  const owners = persona.generatorOwners;
  const dueDates = ["Jul 7", "Jul 14", "Jul 21", "Jul 28", "Aug 4", "Aug 11"];

  // Worked example: "Cut customer onboarding time by 30% across the two largest markets by end of Q3."
  // Title => "Roadmap: Cut customer onboarding time by 30% across the"; tasks are inferred, dated weekly,
  // and every assumption is surfaced before anyone relies on the plan.
  return {
    id: `generated-${Date.now()}`,
    generated: true,
    live: false,
    title: `Roadmap: ${firstWords || "New objective"}`,
    okr: `Deliver: ${objective}`,
    openQuestions: [
      "I generated this from the objective alone — owners and dates are my best inference, not confirmed. Tell me who actually owns each and I'll firm it up.",
      persona.generatorAssumption,
    ],
    tasks: [
      {
        title: "Define success metrics and current baseline",
        owner: owners[0],
        due: dueDates[0],
        status: "not_started",
        confidence: "inferred",
        provenance: "Discovery & alignment · owner inferred from the objective",
      },
      {
        title: "Align owners and dependencies across teams",
        owner: owners[1],
        due: dueDates[1],
        status: "not_started",
        confidence: "inferred",
        provenance: "Discovery & alignment · dependencies not confirmed",
      },
      {
        title: "Stand up the core workstream",
        owner: owners[2],
        due: dueDates[2],
        status: "not_started",
        confidence: "inferred",
        provenance: "Build & execute · workstream inferred from objective wording",
      },
      {
        title: "Run the first milestone and review",
        owner: owners[3],
        due: dueDates[3],
        status: "not_started",
        confidence: "inferred",
        provenance: "Build & execute · review cadence assumed weekly",
      },
      {
        title: "Pilot with one group",
        owner: owners[0],
        due: dueDates[4],
        status: "not_started",
        confidence: "inferred",
        provenance: "Roll out & verify · pilot group not confirmed",
      },
      {
        title: "Measure against the target and adjust",
        owner: owners[1],
        due: dueDates[5],
        status: "not_started",
        confidence: "inferred",
        provenance: "Roll out & verify · metric source needs confirmation",
      },
    ],
  };
}

export default App;
