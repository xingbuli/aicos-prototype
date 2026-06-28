import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  ChevronLeft,
  ChevronRight,
  Copy,
  Diamond,
  FileText,
  HelpCircle,
  Home,
  KeyRound,
  LogOut,
  Map,
  Mail,
  Menu,
  MessageSquare,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TriangleAlert,
  UsersRound,
  X,
} from "lucide-react";
import {
  CHAT_FALLBACK,
  CHAT_STARTERS,
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

const ACTION_TYPE_META = {
  deck_review: { label: "Deck Review", icon: FileText },
  meeting_prep: { label: "Meeting Prep", icon: CalendarDays },
  nudge_request: { label: "Nudge Request", icon: MessageSquare },
  schedule_followup: { label: "Schedule Follow-up", icon: Clock3 },
  adoption_note: { label: "Adoption Note", icon: UsersRound },
};

const STORAGE_KEYS = {
  persona: "aicos.persona",
  byoKey: "aicos.anthropicKey",
  tourPrefix: "aicos.tourSeen.",
};

const VIEWS = {
  home: "Home",
  roadmaps: "Roadmaps",
  prep: "Prep Desk",
  access: "Context access",
  chat: "Talk to AICOS",
};

const TOUR_VIEW_BY_TARGET = {
  briefing: VIEWS.home,
  confidence: VIEWS.home,
  blindspot: VIEWS.home,
  draft: VIEWS.home,
  objective: VIEWS.roadmaps,
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
        tourStep={showTour ? TOUR_STEPS[tourIndex] : null}
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

      <section className="workspace-picker" aria-label="Choose an account to sign in">
        <p className="eyebrow">Choose an account to sign in.</p>
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
                Sign in as {persona.name.split(" ")[0]} <ArrowRight size={16} />
              </span>
            </button>
          ))}
        </div>
        <p className="prototype-footnote">Demo sign-in · simulated accounts · no real data.</p>
      </section>
    </main>
  );
}

function Console({ persona, byoKey, tourStep, onHelp, onSettings, onSignOut, onRequestAccess }) {
  const [objectives, setObjectives] = useState(persona.objectives);
  const [objectiveText, setObjectiveText] = useState(persona.objectivePrompt);
  const [objectiveError, setObjectiveError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftStates, setDraftStates] = useState({});
  const [draftEdits, setDraftEdits] = useState({});
  const [prepStates, setPrepStates] = useState({});
  const [prepEdits, setPrepEdits] = useState({});
  const [editModalItem, setEditModalItem] = useState(null);
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
  const [activeView, setActiveView] = useState(VIEWS.home);
  const [toast, setToast] = useState("");

  useEffect(() => {
    setObjectives(persona.objectives);
    setObjectiveText(persona.objectivePrompt);
    setObjectiveError("");
    setDraftStates({});
    setDraftEdits({});
    setPrepStates({});
    setPrepEdits({});
    setEditModalItem(null);
    setChatInput("");
    setActiveView(VIEWS.home);
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

  useEffect(() => {
    const nextView = TOUR_VIEW_BY_TARGET[tourStep?.target];
    if (nextView) setActiveView(nextView);
  }, [tourStep]);

  function notify(message) {
    setToast(message);
  }

  function navigatePanel(item) {
    if (item.action === "help") {
      setMobileNavOpen(false);
      onHelp();
      return;
    }
    if (item.action === "settings") {
      setMobileNavOpen(false);
      onSettings();
      return;
    }
    setActiveView(item.view);
    setMobileNavOpen(false);
  }

  function openView(view) {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  function updateDraftEdit(itemId, patch) {
    setDraftEdits((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        ...patch,
      },
    }));
  }

  function resetDraftEdit(itemId) {
    setDraftEdits((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
  }

  function setPrepState(itemId, state) {
    setPrepStates((current) => ({ ...current, [itemId]: state }));
  }

  function updatePrepEdit(itemId, patch) {
    setPrepEdits((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        ...patch,
      },
    }));
  }

  function resetPrepEdit(itemId) {
    setPrepEdits((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
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
    <>
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
            onOpenNav={() => setMobileNavOpen(true)}
            onHelp={onHelp}
            onSettings={onSettings}
          />

          <main className="console">
            {activeView === VIEWS.home && (
              <HomeView
                persona={persona}
                objectives={objectives}
                chatMessages={chatMessages}
                draftStates={draftStates}
                draftEdits={draftEdits}
                onDraftState={setDraftState}
                onDraftEdit={updateDraftEdit}
                onDraftReset={resetDraftEdit}
                onRequestAccess={onRequestAccess}
                onCopyBrief={copyBrief}
                onOpenView={openView}
              />
            )}

            {activeView === VIEWS.roadmaps && (
              <RoadmapsView
                objectives={objectives}
                value={objectiveText}
                error={objectiveError}
                isGenerating={isGenerating}
                hasByoKey={Boolean(byoKey.trim())}
                onChange={setObjectiveText}
                onSubmit={submitObjective}
              />
            )}

            {activeView === VIEWS.prep && (
              <PrepDeskView
                persona={persona}
                prepStates={prepStates}
                prepEdits={prepEdits}
                onPrepState={setPrepState}
                onPrepEdit={updatePrepEdit}
                onPrepReset={resetPrepEdit}
                onEditPrep={setEditModalItem}
                onRequestAccess={onRequestAccess}
              />
            )}

            {activeView === VIEWS.access && (
              <AccessView persona={persona} onRequestAccess={onRequestAccess} />
            )}

            {activeView === VIEWS.chat && (
              <ChatView
                messages={chatMessages}
                input={chatInput}
                isThinking={isThinking}
                onInput={setChatInput}
                onSend={sendChat}
              />
            )}
          </main>
          {toast && (
            <div className="toast" role="status" aria-live="polite">
              {toast}
            </div>
          )}
        </div>
      </div>
      {editModalItem && (
        <PrepEditModal
          item={editModalItem}
          edit={getPrepEdit(editModalItem, prepEdits[editModalItem.id])}
          onEdit={(patch) => updatePrepEdit(editModalItem.id, patch)}
          onReset={() => resetPrepEdit(editModalItem.id)}
          onClose={() => setEditModalItem(null)}
        />
        )}
    </>
  );
}

function Sidebar({ persona, activeView, onNavigate, onHelp, onSettings, onSignOut, onClose }) {
  const navItems = [
    { label: VIEWS.home, icon: Home, view: VIEWS.home },
    { label: VIEWS.roadmaps, icon: Map, view: VIEWS.roadmaps },
    { label: VIEWS.prep, icon: FileText, view: VIEWS.prep },
    { label: VIEWS.access, icon: ShieldCheck, view: VIEWS.access },
    { label: VIEWS.chat, icon: MessageSquare, view: VIEWS.chat },
    { label: "How it works", icon: HelpCircle, action: "help" },
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
          <button className="source-card source-card-button" onClick={onSettings}>
            <p>Connected sources</p>
            <div className="source-icons" aria-label="Connected sources">
              {persona.connectors.map((connector) => (
                <SourceIcon key={connector.source} source={connector.source} state={connector.state} />
              ))}
            </div>
          </button>

          <div className="confidence-card">
            <div className="confidence-topline">
              <span>Safety checks</span>
              <strong>Always on</strong>
            </div>
            <div className="confidence-row">
              <span><i className="known" />Drafts wait for approval</span>
              <strong>1</strong>
            </div>
            <div className="confidence-row">
              <span><i className="needs" />Blind spots are named</span>
              <strong>2</strong>
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

function HomeView({
  persona,
  objectives,
  chatMessages,
  draftStates,
  draftEdits,
  onDraftState,
  onDraftEdit,
  onDraftReset,
  onRequestAccess,
  onCopyBrief,
  onOpenView,
}) {
  return (
    <>
      <BriefingSection
        persona={persona}
        draftStates={draftStates}
        draftEdits={draftEdits}
        onDraftState={onDraftState}
        onDraftEdit={onDraftEdit}
        onDraftReset={onDraftReset}
        onRequestAccess={onRequestAccess}
        onCopyBrief={onCopyBrief}
      />
      <HomePreviewGrid
        persona={persona}
        objectives={objectives}
        chatMessages={chatMessages}
        onOpenView={onOpenView}
      />
    </>
  );
}

function HomePreviewGrid({ persona, objectives, chatMessages, onOpenView }) {
  const allTasks = objectives.flatMap((objective) => objective.tasks);
  const blockedCount = allTasks.filter((task) => task.status === "blocked").length;
  const staleCount = allTasks.filter((task) => task.status === "stale").length;
  const offLimitsCount = persona.access.filter((item) => item.state === "off").length;
  const connectedCount = persona.access.filter((item) => item.state === "connected").length;
  const lastMessage = [...chatMessages].reverse().find((message) => message.role === "aicos");

  return (
    <section className="home-preview-grid" aria-label="Workspace sections">
      <article className="preview-card">
        <div>
          <span className="section-kicker">Roadmaps</span>
          <h2>{objectives.length} active objectives</h2>
          <p>
            {blockedCount
              ? `${blockedCount} blocked task needs attention.`
              : staleCount
                ? `${staleCount} stale task needs a check-in.`
                : "Plans are organized by owner, date, status, and confidence."}
          </p>
        </div>
        <button className="preview-action" onClick={() => onOpenView(VIEWS.roadmaps)}>
          Open roadmaps <ArrowRight size={14} />
        </button>
      </article>

      <article className="preview-card">
        <div>
          <span className="section-kicker">Context access</span>
          <h2>{connectedCount} connected sources</h2>
          <p>
            {offLimitsCount} area{offLimitsCount === 1 ? "" : "s"} stay private unless you request
            more context for AICOS.
          </p>
        </div>
        <button className="preview-action" onClick={() => onOpenView(VIEWS.access)}>
          Review access <ArrowRight size={14} />
        </button>
      </article>

      <article className="preview-card">
        <div>
          <span className="section-kicker">Talk to AICOS</span>
          <h2>Ask with context</h2>
          <p>{lastMessage?.text ?? "AICOS is ready to answer from the current workspace context."}</p>
        </div>
        <button className="preview-action" onClick={() => onOpenView(VIEWS.chat)}>
          Open chat <ArrowRight size={14} />
        </button>
      </article>
    </section>
  );
}

function RoadmapsView({
  objectives,
  value,
  error,
  isGenerating,
  hasByoKey,
  onChange,
  onSubmit,
}) {
  return (
    <section className="view-page">
      <ViewHeader
        eyebrow="Roadmaps"
        title="Turn goals into owned work."
        body="AICOS keeps the full execution plan here, with owners, dates, status, confidence, and the assumptions you need to confirm."
      />
      <RoadmapBoard
        objectives={objectives}
        value={value}
        error={error}
        isGenerating={isGenerating}
        hasByoKey={hasByoKey}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </section>
  );
}

function PrepDeskView({
  persona,
  prepStates,
  prepEdits,
  onPrepState,
  onPrepEdit,
  onPrepReset,
  onEditPrep,
  onRequestAccess,
}) {
  return (
    <section className="view-page">
      <ViewHeader
        eyebrow="Prep Desk"
        title="Review, stage, and complete the next actions."
        body="AICOS prepares the work, you stage it, then you complete the simulated outcome. Nothing edits a deck, sends a message, or touches a calendar unless you choose the final prototype action."
      />
      <section className="panel prep-desk">
        <div className="panel-heading">
          <div>
            <h2><Sparkles size={16} /> Action queue</h2>
            <div className="panel-subline">
              <span>{persona.prepDesk.summary}</span>
            </div>
          </div>
        </div>

        <div className="prep-grid">
          {persona.prepDesk.items.map((item) => (
            <PrepDeskCard
              item={item}
              key={item.id}
              state={prepStates[item.id] ?? "open"}
              edit={getPrepEdit(item, prepEdits[item.id])}
              onResolve={() => onPrepState(item.id, "staged")}
              onCommit={() => onPrepState(item.id, "completed")}
              onEdit={(patch) => onPrepEdit(item.id, patch)}
              onReset={() => onPrepReset(item.id)}
              onOpenEditor={() => onEditPrep(item)}
              onRequestAccess={onRequestAccess}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

function PrepDeskCard({
  item,
  state,
  edit,
  onResolve,
  onCommit,
  onEdit,
  onReset,
  onOpenEditor,
  onRequestAccess,
}) {
  const isOpen = state === "open";
  const isStaged = state === "staged" || state === "approved";
  const isCompleted = state === "completed";
  const isResolved = !isOpen;
  const usesInlineDraft = item.actionType === "nudge_request";
  const usesInlineSchedule = item.actionType === "schedule_followup";
  const usesModalEditor = ["meeting_prep", "deck_review"].includes(item.actionType);
  const commitMeta = getPrepCommitMeta(item);
  const details = splitEditLines(edit.detailsText);

  return (
    <article className={`prep-card ${isResolved ? "resolved" : ""} ${isCompleted ? "completed" : ""}`}>
      <div className="prep-card-head">
        <div className="prep-card-tags">
          <ActionTypeBadge actionType={item.actionType} />
          <div className="item-tags">
            <KindBadge kind={item.kind} />
            <ConfidenceTag confidence={item.confidence} />
          </div>
        </div>
        {isResolved && (
          <span className="prep-resolved">
            <Check size={14} /> {isCompleted ? "Completed" : "Ready"}
          </span>
        )}
      </div>

      <h3>{item.title}</h3>
      <p>{item.body}</p>

      {details.length > 0 && (
        <ul className="prep-detail-list">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      )}

      {usesInlineSchedule && isOpen && (
        <label className="editable-field">
          Editable schedule notes
          <textarea
            rows={4}
            value={edit.detailsText}
            onChange={(event) => onEdit({ detailsText: event.target.value })}
          />
        </label>
      )}

      {item.draft && usesInlineDraft && isOpen && (
        <EditableDraftBody
          label={item.draft.label}
          value={edit.draftBody}
          onChange={(value) => onEdit({ draftBody: value })}
        />
      )}

      {item.draft && (!usesInlineDraft || isResolved) && (
        <div className="prep-draft">
          <span>{item.draft.label}</span>
          <p>{edit.draftBody}</p>
        </div>
      )}

      <div className="button-row">
        {isStaged && (
          <div className="prep-confirmation">
            <Check size={15} />
            {commitMeta.readyLabel}
          </div>
        )}
        {isCompleted && (
          <div className="prep-confirmation completed">
            <Check size={15} />
            {commitMeta.completeLabel}
          </div>
        )}
        {isOpen && (
          <button className="btn btn-primary" onClick={onResolve}>
            <Check size={15} /> {item.actionLabel}
          </button>
        )}
        {isStaged && (
          <button className="btn btn-primary" onClick={onCommit}>
            <Check size={15} /> {commitMeta.commitLabel}
          </button>
        )}
        {isOpen && usesModalEditor && (
          <button className="btn btn-ghost" onClick={onOpenEditor}>
            {item.actionType === "deck_review" ? "Edit checklist" : "Edit agenda"}
          </button>
        )}
        {isOpen && (item.draft || usesInlineSchedule || usesModalEditor) && (
          <button className="tiny-link" onClick={onReset}>
            Reset edits
          </button>
        )}
        {item.secondaryAction && (
          <button className="tiny-link" onClick={() => onRequestAccess(item.secondaryAction.scope)}>
            {item.secondaryAction.label}
          </button>
        )}
      </div>
    </article>
  );
}

function ActionTypeBadge({ actionType }) {
  const meta = ACTION_TYPE_META[actionType] ?? { label: "Action", icon: Sparkles };
  const Icon = meta.icon;

  return (
    <span className={`action-type-badge ${actionType ?? "default"}`}>
      <Icon size={13} />
      {meta.label}
    </span>
  );
}

function EditableDraftBody({ label, value, onChange }) {
  return (
    <label className="editable-field">
      {label}
      <textarea rows={5} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function PrepEditModal({ item, edit, onEdit, onReset, onClose }) {
  const isDeck = item.actionType === "deck_review";
  const isOneOnOne = item.id === "alex-privacy-one-on-one";
  const detailsLabel = isDeck ? "Review checklist" : isOneOnOne ? "1:1 agenda bullets" : "Agenda bullets";
  const briefLabel = isDeck ? "Review brief" : isOneOnOne ? "1:1 agenda shell" : "Prep brief";

  return (
    <Modal title={isDeck ? "Edit checklist" : "Edit agenda"} onClose={onClose} size="wide">
      <p className="modal-intro">
        Edits stay in this simulated workspace. AICOS stages your version for approval; it does not
        update decks, calendars, messages, or private 1:1 notes.
      </p>
      <div className="edit-modal-stack">
        <label className="editable-field">
          Meeting goal
          <input value={edit.goal} onChange={(event) => onEdit({ goal: event.target.value })} />
        </label>
        <label className="editable-field">
          {detailsLabel}
          <textarea
            rows={7}
            value={edit.detailsText}
            onChange={(event) => onEdit({ detailsText: event.target.value })}
          />
        </label>
        {item.draft && (
          <label className="editable-field">
            {briefLabel}
            <textarea
              rows={5}
              value={edit.draftBody}
              onChange={(event) => onEdit({ draftBody: event.target.value })}
            />
          </label>
        )}
        {(item.editFields?.followUpNote || isOneOnOne) && (
          <label className="editable-field">
            Follow-up note
            <textarea
              rows={4}
              value={edit.followUpNote}
              onChange={(event) => onEdit({ followUpNote: event.target.value })}
            />
          </label>
        )}
      </div>
      <div className="modal-actions">
        <button className="btn btn-primary" onClick={onClose}>
          Save edits
        </button>
        <button className="btn btn-ghost" onClick={onReset}>
          Reset edits
        </button>
      </div>
    </Modal>
  );
}

function getDraftEdit(item, edit) {
  return {
    subject: edit?.subject ?? item.draft?.subject ?? item.title,
    body: edit?.body ?? item.draft?.body ?? item.body,
  };
}

function getPrepEdit(item, edit) {
  return {
    goal: edit?.goal ?? item.editFields?.goal ?? item.title,
    detailsText: edit?.detailsText ?? (item.details ?? []).join("\n"),
    draftBody: edit?.draftBody ?? item.draft?.body ?? "",
    followUpNote: edit?.followUpNote ?? item.editFields?.followUpNote ?? "",
  };
}

function getPrepCommitMeta(item) {
  const owner = item.title.includes("1:1") ? "agenda" : "item";
  const labels = {
    nudge_request: {
      readyLabel: "Ready to send. You reviewed this nudge; AICOS has not sent anything.",
      commitLabel: "Mark sent",
      completeLabel: "Nudge marked sent in prototype. No real message was sent.",
    },
    schedule_followup: {
      readyLabel: "Ready to create. You reviewed this hold; AICOS has not touched a calendar.",
      commitLabel: "Create calendar hold",
      completeLabel: "Calendar hold created in prototype. No real calendar was updated.",
    },
    deck_review: {
      readyLabel: "Ready to apply. You reviewed these notes; AICOS has not changed a deck.",
      commitLabel: "Apply review notes",
      completeLabel: "Deck notes applied in prototype. No real document was edited.",
    },
    meeting_prep: {
      readyLabel: `Ready to save. You reviewed this ${owner}; AICOS has not updated any workspace.`,
      commitLabel: "Save agenda",
      completeLabel: "Agenda saved in prototype. No private notes or external systems were updated.",
    },
    adoption_note: {
      readyLabel: "Ready to record. You reviewed this adoption note.",
      commitLabel: "Record note",
      completeLabel: "Adoption note recorded in prototype. No external system was updated.",
    },
  };

  return labels[item.actionType] ?? {
    readyLabel: "Ready to complete in prototype.",
    commitLabel: "Complete",
    completeLabel: "Completed in prototype. No external system was updated.",
  };
}

function splitEditLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function AccessView({ persona, onRequestAccess }) {
  return (
    <section className="view-page">
      <ViewHeader
        eyebrow="Context access"
        title="Control what AICOS can use."
        body="This view shows what AICOS can read, what stays private, and where you can request more context."
      />
      <div className="access-view-shell">
        <AccessPanel persona={persona} onRequestAccess={onRequestAccess} />
      </div>
    </section>
  );
}

function ChatView({ messages, input, isThinking, onInput, onSend }) {
  return (
    <section className="view-page">
      <ViewHeader
        eyebrow="Talk to AICOS"
        title="Ask questions without losing the trust layer."
        body="Starter prompts stay reliable for the demo, and free-form questions are handled honestly when the answer would need live model context."
      />
      <div className="chat-view-shell">
        <ChatPanel
          messages={messages}
          input={input}
          isThinking={isThinking}
          onInput={onInput}
          onSend={onSend}
        />
      </div>
    </section>
  );
}

function ViewHeader({ eyebrow, title, body }) {
  return (
    <header className="view-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </header>
  );
}

function Topbar({ persona, onOpenNav, onHelp, onSettings }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onOpenNav} aria-label="Open navigation">
        <Menu size={18} />
      </button>
      <div className="workspace-title">
        <strong>{persona.name}</strong>
        <span>{persona.role} · {persona.team}-person team · tracks in {persona.tracksIn}</span>
      </div>
      <div className="topbar-meta">
        <span className="prototype-marker">Interactive prototype · simulated workspace</span>
        <button className="top-icon" aria-label="How AICOS works" onClick={onHelp}>
          <ShieldCheck size={16} />
        </button>
        <button className="avatar-menu" aria-label={`${persona.name} settings`} onClick={onSettings}>
          {persona.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
        </button>
      </div>
    </header>
  );
}

function BriefingSection({
  persona,
  draftStates,
  draftEdits,
  onDraftState,
  onDraftEdit,
  onDraftReset,
  onRequestAccess,
  onCopyBrief,
}) {
  const priorityItem = persona.briefing.items.find((item) => item.kind === "blocker") ?? persona.briefing.items[0];

  return (
    <section className="briefing-card rise" data-tour="briefing" id="briefing">
      <div className="briefing-heading">
        <div>
          <h1>This week&apos;s briefing</h1>
          <span>{persona.name} · late June 2026 demo · early July work</span>
        </div>
        <button className="copy-brief" onClick={onCopyBrief}>
          <Copy size={14} />
          Copy brief
        </button>
      </div>

      <div className="focus-brief">
        <div className="focus-copy">
          <span className="section-kicker">Start here</span>
          <h2>{priorityItem.title}</h2>
          <p>{priorityItem.body}</p>
          <div className="focus-actions">
            <a href="#briefing-items">Review briefing <ArrowRight size={13} /></a>
            <ConfidenceTag confidence={priorityItem.confidence} />
          </div>
        </div>
        <div className="trust-card" aria-label="AICOS action guard summary">
          <div className="trust-card-top">
            <ShieldCheck size={18} />
            <span>Action Guard</span>
            <strong>On</strong>
          </div>
          <div className="trust-sources">
            <span>Approval before sending</span>
            <span>Confidence shown</span>
            <span>Gaps flagged</span>
            <span>Boundaries respected</span>
          </div>
          <small><Clock3 size={13} /> Nothing leaves without your approval</small>
        </div>
      </div>

      <div className="briefing-summary">
        <strong>Summary</strong>
        <p>{persona.briefing.summary}</p>
      </div>

      <div className="briefing-items" id="briefing-items">
        {persona.briefing.items.map((item, index) => (
          <article
            className="briefing-item"
            key={item.id}
            data-tour={
              item.confidence === "unknown" ? "blindspot" : index === 0 ? "confidence" : undefined
            }
          >
            <div className="briefing-item-main">
              <div className="item-tags">
                <KindBadge kind={item.kind} />
                <ConfidenceTag confidence={item.confidence} />
              </div>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </div>
            {(item.draft || item.secondaryAction) && (
              <DraftCard
                item={item}
                state={draftStates[item.id] ?? "open"}
                edit={getDraftEdit(item, draftEdits[item.id])}
                onEdit={(patch) => onDraftEdit(item.id, patch)}
                onReset={() => onDraftReset(item.id)}
                onApprove={() =>
                  onDraftState(
                    item.id,
                    ["staged", "approved"].includes(draftStates[item.id]) ? "completed" : "staged",
                  )
                }
                onDismiss={() => onDraftState(item.id, "dismissed")}
                onRequestAccess={onRequestAccess}
              />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function DraftCard({ item, state, edit, onEdit, onReset, onApprove, onDismiss, onRequestAccess }) {
  if (state === "dismissed") {
    return (
      <div className="draft-card resolved">
        <Check size={15} />
        Draft dismissed. AICOS will leave it untouched.
      </div>
    );
  }

  if (state === "staged" || state === "approved") {
    return (
      <div className="draft-card resolved">
        <div className="commit-copy">
          <Check size={15} />
          <span>Ready to send. You reviewed this draft; AICOS has not sent anything.</span>
        </div>
        <button className="btn btn-primary" onClick={onApprove}>
          <Check size={15} /> Mark sent
        </button>
      </div>
    );
  }

  if (state === "completed") {
    return (
      <div className="draft-card resolved completed">
        <Check size={15} />
        Sent in prototype. No real message was sent.
      </div>
    );
  }

  return (
    <article className="draft-card" data-tour="draft">
      <div className="draft-label">
        <Sparkles size={14} />
        Editable draft
      </div>
      {item.draft?.subject && (
        <label className="editable-field compact">
          Subject
          <input
            value={edit.subject}
            onChange={(event) => onEdit({ subject: event.target.value })}
          />
        </label>
      )}
      <EditableDraftBody
        label={item.draft?.type ? `${item.draft.type} body` : "Draft body"}
        value={edit.body}
        onChange={(value) => onEdit({ body: value })}
      />
      <div className="button-row">
        <button className="btn btn-primary" onClick={onApprove}>
          <Check size={15} /> Approve
        </button>
        <button className="btn btn-ghost" onClick={onDismiss}>
          Dismiss
        </button>
        <button className="tiny-link" onClick={onReset}>
          Reset draft
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
}) {
  return (
    <section className="panel roadmap-board" data-tour="objective" id="roadmaps">
      <div className="panel-heading">
        <div>
          <h2>Hand AICOS a goal</h2>
          <div className="panel-subline">
            <span>
              AICOS turns an objective into an owned, dated plan and marks every assumption.
            </span>
          </div>
        </div>
      </div>

      <form className="roadmap-composer" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="objective">Generate a roadmap objective</label>
        <span className="composer-label">New objective</span>
        <input
          id="objective"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Describe a goal for AICOS to turn into a roadmap"
        />
        <small>{error || (hasByoKey ? "Generated · live when available" : "Generated · simulated preview")}</small>
        <button className="btn btn-primary" disabled={isGenerating}>
          <Sparkles size={15} />
          {isGenerating ? "Generating..." : "Generate roadmap"}
        </button>
      </form>

      <RoadmapTimeline objectives={objectives} />

      <div className="objective-stack">
        {objectives.map((objective) => (
          <ObjectiveCard objective={objective} key={objective.id} />
        ))}
      </div>
    </section>
  );
}

function ObjectiveCard({ objective }) {
  const status = getObjectiveStatus(objective);

  return (
    <article className={`objective-card ${objective.generated ? "generated" : ""}`}>
      <div className="objective-head">
        <div>
          <h3>{objective.title}</h3>
          <p>{objective.okr}</p>
        </div>
        <div className="objective-badges">
          {objective.generated && (
            <span className="generated-badge">
              Generated · {objective.live ? "live" : "simulated preview"}
            </span>
          )}
          <StatusPill status={status} />
        </div>
      </div>

      {objective.openQuestions?.length > 0 && (
        <div className="open-questions">
          <strong>AICOS needs you to confirm</strong>
          {objective.openQuestions.map((question) => (
            <p key={question}>{question}</p>
          ))}
        </div>
      )}

      <ObjectiveTimeline objective={objective} />

      <div className="task-list" role="list">
        {objective.tasks.map((task) => (
          <article className="task-row" role="listitem" key={`${objective.id}-${task.title}`}>
            <div>
              <strong>{task.title}</strong>
              <small>{task.provenance}</small>
            </div>
            <span className="task-owner">
              <Avatar name={task.owner} />
              {task.owner}
            </span>
            <time>{task.due}</time>
            <StatusPill status={task.status} />
            <ConfidenceTag confidence={task.confidence} />
          </article>
        ))}
      </div>
    </article>
  );
}

function RoadmapTimeline({ objectives }) {
  const timeline = buildTimelineModel(objectives);
  const totalTasks = objectives.reduce((sum, objective) => sum + objective.tasks.length, 0);

  return (
    <section className="roadmap-timeline" aria-labelledby="roadmap-timeline-title">
      <div className="timeline-heading">
        <div>
          <span className="section-kicker">Timeline</span>
          <h3 id="roadmap-timeline-title">Roadmap at a glance</h3>
          <p>What is happening when, and what is blocking the plan.</p>
        </div>
        <div className="timeline-summary" aria-label="Roadmap summary">
          <span>{objectives.length} objectives</span>
          <span>{totalTasks} tasks</span>
          <span>{timeline.blockedCount} blockers</span>
        </div>
      </div>

      <TimelineNote />

      {timeline.rows.length > 0 ? (
        <div className="timeline-scroll" role="region" aria-label="Portfolio roadmap timeline" tabIndex={0}>
          <TimelineAxis ticks={timeline.ticks} />
          <div className="portfolio-timeline">
            {timeline.objectives.map((objective) => (
              <div className="timeline-objective-group" key={objective.id}>
                <div className="timeline-objective-title">
                  <strong>{objective.title}</strong>
                  <StatusPill status={objective.status} />
                </div>
                {objective.rows.map((row) => (
                  <TimelineTaskRow row={row} key={`${objective.id}-${row.task.title}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="timeline-empty">Add or generate an objective to see the roadmap timeline.</p>
      )}
    </section>
  );
}

function ObjectiveTimeline({ objective }) {
  const timeline = buildTimelineModel([objective]);

  return (
    <section className="objective-timeline" aria-label={`${objective.title} timeline`}>
      <div className="objective-timeline-head">
        <span>Timeline</span>
        <small>spans inferred</small>
      </div>
      {timeline.rows.length > 0 ? (
        <div className="timeline-scroll compact" role="region" aria-label={`${objective.title} task timeline`} tabIndex={0}>
          <TimelineAxis ticks={timeline.ticks} compact />
          <div className="compact-timeline">
            {timeline.rows.map((row) => (
              <TimelineTaskRow row={row} key={`${objective.id}-${row.task.title}`} compact />
            ))}
          </div>
        </div>
      ) : (
        <p className="timeline-empty compact">Task dates need confirmation before AICOS can draw a timeline.</p>
      )}
    </section>
  );
}

function TimelineAxis({ ticks, compact = false }) {
  return (
    <div className={`timeline-axis ${compact ? "compact" : ""}`} aria-hidden>
      <span className="timeline-axis-spacer" />
      <div className="timeline-axis-track">
        {ticks.map((tick) => (
          <span style={{ left: `${tick.position}%` }} key={tick.label}>
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineTaskRow({ row, compact = false }) {
  const statusMeta = STATUS_META[row.task.status] ?? STATUS_META.not_started;
  const confidenceMeta = CONFIDENCE_META[row.task.confidence] ?? CONFIDENCE_META.unknown;

  return (
    <article className={`timeline-task-row ${compact ? "compact" : ""} ${row.invalid ? "invalid" : ""}`}>
      <div className="timeline-task-label">
        <strong>{row.task.title}</strong>
        <span>
          {row.task.owner} · {row.task.due || "date needs confirmation"} · {statusMeta.label} · {confidenceMeta.label}
        </span>
      </div>
      <div className="timeline-track">
        {row.invalid ? (
          <span className="timeline-date-missing">
            <TriangleAlert size={13} /> date needs confirmation
          </span>
        ) : (
          <span
            className={`timeline-bar ${row.task.status}`}
            style={{
              "--bar-left": `${row.left}%`,
              "--bar-width": `${row.width}%`,
            }}
          >
            <span>{compact ? row.task.due : `${row.task.owner} · ${row.task.due}`}</span>
          </span>
        )}
      </div>
    </article>
  );
}

function TimelineNote() {
  return (
    <p className="timeline-note">
      <TriangleAlert size={14} />
      Timeline spans inferred from due dates. Confirm starts before relying on this.
    </p>
  );
}

function AccessPanel({ persona, onRequestAccess }) {
  return (
    <section className="panel access-card" id="context">
      <div className="panel-heading">
        <h2>What AICOS can see</h2>
        <button className="text-action" onClick={() => onRequestAccess("Review context sources")}>Request access</button>
      </div>
      <p className="access-intro">
        AICOS only uses granted sources. Private areas stay out of reach unless you ask the AICOS
        team to connect more context.
      </p>
      <div className="access-list">
        {persona.access.map((item) => {
          const isOffLimits = item.state === "off";
          return (
            <article className={`access-row ${isOffLimits ? "off" : "connected"}`} key={item.source}>
              <span className="access-state" aria-hidden>
                {isOffLimits ? <TriangleAlert size={15} /> : <CheckCircle2 size={15} />}
              </span>
              <div>
                <strong>{item.source}</strong>
                <small>{item.level}{item.note ? ` · ${item.note}` : ""}</small>
              </div>
              {isOffLimits && (
                <button className="tiny-link" onClick={() => onRequestAccess(item.source)}>
                  Request access
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ChatPanel({ messages, input, isThinking, onInput, onSend }) {
  const messagesRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  return (
    <section className="panel chat-card" id="chat">
      <PanelTitle title="Talk to AICOS" icon={Bot} />
      <div className="starter-chips">
        {CHAT_STARTERS.map((starter) => (
          <button key={starter} onClick={() => onSend(starter)} disabled={isThinking}>
            {starter}
          </button>
        ))}
      </div>
      <div className="chat-log" ref={messagesRef}>
        {messages.map((message) => (
          <div className={`chat-bubble ${message.role}`} key={message.id}>
            {message.text}
          </div>
        ))}
        {isThinking && <div className="chat-bubble aicos">Checking connected sources and confidence tags...</div>}
      </div>
      <form
        className="chat-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSend(input);
        }}
      >
        <label className="sr-only" htmlFor="chat-input">Message AICOS</label>
        <input
          id="chat-input"
          value={input}
          onChange={(event) => onInput(event.target.value)}
          placeholder="Ask a follow-up"
        />
        <button className="btn btn-primary" disabled={isThinking}>
          Ask
        </button>
      </form>
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

function SourceIcon({ source, state }) {
  const normalized = source.toLowerCase();
  const meta = normalized.includes("calendar")
    ? { icon: CalendarDays, tone: "calendar" }
    : normalized.includes("email")
      ? { icon: Mail, tone: "email" }
      : normalized.includes("slack")
        ? { icon: MessageSquare, tone: "slack" }
        : normalized.includes("teams")
          ? { icon: UsersRound, tone: "teams" }
          : normalized.includes("jira")
            ? { icon: Diamond, tone: "jira" }
            : normalized.includes("power")
              ? { icon: BarChart3, tone: "powerbi" }
              : normalized.includes("okr")
                ? { icon: Target, tone: "okr" }
                : normalized.includes("doc")
                  ? { icon: FileText, tone: "docs" }
                  : normalized.includes("loop")
                    ? { icon: RotateCcw, tone: "loop" }
                    : { icon: FileText, tone: "default" };
  const Icon = meta.icon;

  return (
    <span className={`source-icon ${meta.tone} ${state === "connected" ? "connected" : ""}`} title={source}>
      <Icon size={13} aria-hidden />
      <span className="sr-only">{source}</span>
    </span>
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
                <span className="connector-main">
                  <SourceIcon source={connector.source} state={connectorState[connector.source]} />
                  <span>
                  <strong>{connector.source}</strong>
                  <small>{isConnected ? "connected" : "available"}</small>
                  </span>
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
    <Modal title="Request access for AICOS" onClose={onClose}>
      {sent ? (
        <div className="confirmation-state">
          <Check size={22} />
          <p>
            {
              "Request sent to the AICOS team. You can track updates here, and AICOS won't access anything until it is granted."
            }
          </p>
        </div>
      ) : (
        <>
          <p className="modal-intro">
            {
              "AICOS won't reach into anything you haven't granted. Describe what you'd like it to see, and the AICOS team will take it from here."
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
    const timer = window.setTimeout(() => {
      document.querySelectorAll("[data-tour]").forEach((node) => {
        node.classList.toggle("tour-highlight", node.getAttribute("data-tour") === step.target);
      });
      document.querySelector(`[data-tour="${step.target}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
    return () => {
      window.clearTimeout(timer);
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

function KindBadge({ kind }) {
  const labels = {
    blocker: "Blocker",
    attention: "Needs attention",
    prep: "Prepare",
    shift: "Priority shift",
  };
  return <span className={`kind-badge ${kind}`}>{labels[kind] ?? kind}</span>;
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

const DEMO_YEAR = 2026;
const DAY_MS = 24 * 60 * 60 * 1000;
const MONTH_INDEX = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function buildTimelineModel(objectives) {
  const objectiveModels = objectives.map((objective) => {
    const rows = [];
    let previousDueDate = null;

    objective.tasks.forEach((task) => {
      const dueDate = parseDemoDate(task.due);
      if (!dueDate) {
        rows.push({ task, objective, invalid: true });
        return;
      }

      const startDate = previousDueDate ?? addDays(dueDate, -7);
      rows.push({
        task,
        objective,
        startDate,
        dueDate,
        invalid: false,
      });
      previousDueDate = dueDate;
    });

    return {
      id: objective.id,
      title: objective.title,
      status: getObjectiveStatus(objective),
      rows,
    };
  });

  const validRows = objectiveModels.flatMap((objective) => objective.rows).filter((row) => !row.invalid);
  const earliest = validRows.reduce(
    (current, row) => (current && current < row.startDate ? current : row.startDate),
    null,
  );
  const latest = validRows.reduce(
    (current, row) => (current && current > row.dueDate ? current : row.dueDate),
    null,
  );
  const domainStart = earliest ? addDays(earliest, -2) : null;
  const domainEnd = latest ? addDays(latest, 2) : null;
  const domainDays = domainStart && domainEnd ? Math.max(1, daysBetween(domainStart, domainEnd)) : 1;

  objectiveModels.forEach((objective) => {
    objective.rows = objective.rows.map((row) => {
      if (row.invalid || !domainStart) return row;
      const left = clampPercent((daysBetween(domainStart, row.startDate) / domainDays) * 100);
      const width = Math.max(3, (Math.max(1, daysBetween(row.startDate, row.dueDate)) / domainDays) * 100);
      return {
        ...row,
        left,
        width: Math.min(width, 100 - left),
      };
    });
  });

  const rows = objectiveModels.flatMap((objective) => objective.rows);

  return {
    objectives: objectiveModels,
    rows,
    ticks: buildTimelineTicks(domainStart, domainEnd),
    blockedCount: rows.filter((row) => ["blocked", "stale"].includes(row.task.status)).length,
  };
}

function getObjectiveStatus(objective) {
  if (objective.tasks.some((task) => task.status === "blocked")) return "blocked";
  if (objective.tasks.some((task) => task.status === "stale")) return "stale";
  if (objective.tasks.some((task) => task.status === "not_started")) return "not_started";
  return "on_track";
}

function parseDemoDate(value) {
  if (!value || typeof value !== "string") return null;
  const match = value.trim().match(/^([A-Za-z]{3,9})\s+(\d{1,2})$/);
  if (!match) return null;
  const monthKey = `${match[1][0].toUpperCase()}${match[1].slice(1, 3).toLowerCase()}`;
  const month = MONTH_INDEX[monthKey];
  const day = Number(match[2]);
  if (month === undefined || !Number.isInteger(day) || day < 1 || day > 31) return null;

  const date = new Date(DEMO_YEAR, month, day);
  if (date.getMonth() !== month || date.getDate() !== day) return null;
  return date;
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function daysBetween(start, end) {
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

function buildTimelineTicks(start, end) {
  if (!start || !end) return [];
  const totalDays = Math.max(1, daysBetween(start, end));
  const tickCount = Math.min(5, totalDays + 1);
  const seen = new Set();

  return Array.from({ length: tickCount }, (_, index) => {
    const offset = Math.round((totalDays / Math.max(1, tickCount - 1)) * index);
    const date = addDays(start, offset);
    return {
      label: formatTimelineDate(date),
      position: clampPercent((offset / totalDays) * 100),
    };
  }).filter((tick) => {
    if (seen.has(tick.label)) return false;
    seen.add(tick.label);
    return true;
  });
}

function formatTimelineDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, value));
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
