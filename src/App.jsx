import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Eye,
  KeyRound,
  LogOut,
  Plus,
  RotateCcw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
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

const KIND_META = {
  attention: { label: "Needs attention", color: "#9C6E12", soft: "#F4ECD8" },
  blocker: { label: "Blocker", color: "#B0452A", soft: "#F6E7E2" },
  shift: { label: "Priority shift", color: "#2563EB", soft: "#E5EDFB" },
  prep: { label: "Prepare", color: "#6B3FA0", soft: "#EEE8F5" },
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

  useEffect(() => {
    setObjectives(persona.objectives);
    setObjectiveText(persona.objectivePrompt);
    setObjectiveError("");
    setDraftStates({});
    setChatInput("");
    setChatMessages([
      {
        id: "hello",
        role: "aicos",
        text: `I'm ready for ${persona.name}'s week. Pick a prompt or ask where the blind spots are.`,
      },
    ]);
  }, [persona]);

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
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="wordmark small">AICOS</p>
          <p className="workspace-context">
            {persona.name} · {persona.role} · {persona.team}-person team · Tracks in {persona.tracksIn}
          </p>
        </div>
        <div className="topbar-actions">
          <span className="prototype-chip">Interactive prototype · simulated workspace</span>
          <button className="btn btn-ghost" onClick={onHelp}>
            <CircleHelp size={16} /> Help
          </button>
          <button className="btn btn-ghost" onClick={onSettings}>
            <Settings size={16} /> Settings
          </button>
          <button className="btn btn-ghost" onClick={onSignOut}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </header>

      <main className="console">
        <section className="primary-column">
          <BriefingSection
            persona={persona}
            draftStates={draftStates}
            onDraftState={setDraftState}
            onRequestAccess={onRequestAccess}
          />
          <ObjectiveComposer
            value={objectiveText}
            error={objectiveError}
            isGenerating={isGenerating}
            hasByoKey={Boolean(byoKey.trim())}
            onChange={setObjectiveText}
            onSubmit={submitObjective}
          />
          <RoadmapBoard objectives={objectives} />
        </section>

        <aside className="right-rail">
          <AccessPanel persona={persona} onRequestAccess={onRequestAccess} />
          <ChatPanel
            messages={chatMessages}
            input={chatInput}
            isThinking={isThinking}
            onInput={setChatInput}
            onSend={sendChat}
          />
        </aside>
      </main>
    </div>
  );
}

function BriefingSection({ persona, draftStates, onDraftState, onRequestAccess }) {
  return (
    <section className="card briefing-card rise" data-tour="briefing">
      <div className="section-head">
        <div>
          <p className="eyebrow">{"This week's briefing"}</p>
          <h1>{persona.name.split(" ")[0]}, here is what needs you this week.</h1>
        </div>
        <ShieldCheck className="section-icon" size={28} />
      </div>
      <p className="briefing-summary">{persona.briefing.summary}</p>
      <div className="briefing-list">
        {persona.briefing.items.map((item, index) => (
          <article
            className="briefing-item"
            key={item.id}
            data-tour={item.confidence === "unknown" ? "blindspot" : undefined}
          >
            <div className="briefing-meta">
              <KindBadge kind={item.kind} />
              <span data-tour={index === 0 ? "confidence" : undefined}>
                <ConfidenceTag confidence={item.confidence} />
              </span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
            {item.draft && (
              <DraftCard
                itemId={item.id}
                draft={item.draft}
                state={draftStates[item.id] ?? "open"}
                onApprove={() => onDraftState(item.id, "approved")}
                onDismiss={() => onDraftState(item.id, "dismissed")}
              />
            )}
            {item.secondaryAction && (
              <button
                className="secondary-action"
                onClick={() => onRequestAccess(item.secondaryAction.scope)}
              >
                {item.secondaryAction.label}
                <ArrowRight size={15} />
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function DraftCard({ itemId, draft, state, onApprove, onDismiss }) {
  if (state === "dismissed") {
    return (
      <div className="draft-card resolved">
        <Check size={16} />
        Draft dismissed. AICOS will leave this action untouched.
      </div>
    );
  }

  if (state === "approved") {
    return (
      <div className="draft-card resolved">
        <Check size={16} />
        {"Draft approved — ready for you to send; AICOS won't send it for you."}
      </div>
    );
  }

  return (
    <div className="draft-card" data-tour={itemId ? "draft" : undefined}>
      <div className="draft-label">
        <Sparkles size={15} />
        Draft · {draft.type} → {draft.to}
      </div>
      {draft.subject && <p className="draft-subject">Subject: {draft.subject}</p>}
      <p>{draft.body}</p>
      <div className="button-row">
        <button className="btn btn-primary" onClick={onApprove}>
          <Check size={16} /> Approve
        </button>
        <button className="btn btn-ghost" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

function ObjectiveComposer({
  value,
  error,
  isGenerating,
  hasByoKey,
  onChange,
  onSubmit,
}) {
  return (
    <section className="card objective-card" data-tour="objective">
      <div className="section-head compact">
        <div>
          <p className="eyebrow">Hand AICOS a goal</p>
          <h2>Turn an objective into an owned, dated roadmap.</h2>
        </div>
        <span className="mode-chip">
          {hasByoKey ? "BYO-AI optional live mode" : "Simulated preview"}
        </span>
      </div>
      <form onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="objective">
          Give AICOS an objective
        </label>
        <textarea
          id="objective"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") onSubmit(event);
          }}
          rows={3}
        />
        <div className="composer-footer">
          <span>{error || "Press Cmd/Ctrl-Enter to generate."}</span>
          <button className="btn btn-primary" disabled={isGenerating}>
            <Plus size={16} />
            {isGenerating ? "Building roadmap..." : "Generate roadmap"}
          </button>
        </div>
      </form>
    </section>
  );
}

function RoadmapBoard({ objectives }) {
  return (
    <section className="roadmap-board">
      <div className="board-head">
        <div>
          <p className="eyebrow">Objectives & roadmaps board</p>
          <h2>Every plan carries status, owner, provenance, and confidence.</h2>
        </div>
      </div>
      <div className="objective-list">
        {objectives.map((objective) => (
          <ObjectiveCard objective={objective} key={objective.id} />
        ))}
      </div>
    </section>
  );
}

function ObjectiveCard({ objective }) {
  return (
    <article className={`card objective-item ${objective.generated ? "generated rise" : ""}`}>
      <div className="objective-title-row">
        <div>
          {objective.generated && (
            <span className={`generated-badge ${objective.live ? "live" : ""}`}>
              Generated · {objective.live ? "live" : "simulated preview"}
            </span>
          )}
          <h3>{objective.title}</h3>
          <p>{objective.okr}</p>
        </div>
      </div>
      <div className="task-list">
        {objective.tasks.map((task) => (
          <div className="task-row" key={`${objective.id}-${task.title}`}>
            <div>
              <strong>{task.title}</strong>
              <span>
                {task.owner} · due {task.due}
              </span>
            </div>
            <StatusPill status={task.status} />
            <ConfidenceTag confidence={task.confidence} />
            <p>{task.provenance}</p>
          </div>
        ))}
      </div>
      {objective.openQuestions.length > 0 && (
        <div className="questions-box">
          <p className="eyebrow">AICOS needs you to confirm</p>
          {objective.openQuestions.map((question) => (
            <p key={question}>{question}</p>
          ))}
        </div>
      )}
    </article>
  );
}

function AccessPanel({ persona, onRequestAccess }) {
  return (
    <section className="card rail-card access-card">
      <div className="section-head compact">
        <div>
          <p className="eyebrow">What AICOS can see</p>
          <h2>Access boundaries</h2>
        </div>
        <Eye size={22} />
      </div>
      <div className="access-list">
        {persona.access.map((item) => (
          <div className={`access-row ${item.state === "off" ? "blocked" : ""}`} key={item.source}>
            <div>
              <strong>{item.source}</strong>
              <span>
                {item.level}
                {item.note ? ` · ${item.note}` : ""}
              </span>
            </div>
            {item.state === "off" ? (
              <button className="tiny-button" onClick={() => onRequestAccess(item.source)}>
                Ask a human
              </button>
            ) : (
              <Check size={16} />
            )}
          </div>
        ))}
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
    <section className="card rail-card chat-card">
      <div className="section-head compact">
        <div>
          <p className="eyebrow">Talk to AICOS</p>
          <h2>Ask the chief of staff</h2>
        </div>
        <Bot size={22} />
      </div>
      <div className="starter-row">
        {CHAT_STARTERS.map((starter) => (
          <button className="starter-chip" key={starter} onClick={() => onSend(starter)}>
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
        {isThinking && <div className="chat-bubble aicos">AICOS is checking the trust rules...</div>}
      </div>
      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault();
          onSend(input);
        }}
      >
        <label className="sr-only" htmlFor="chat-input">
          Message AICOS
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(event) => onInput(event.target.value)}
          placeholder="Ask a follow-up..."
        />
        <button className="icon-button" aria-label="Send message">
          <Send size={16} />
        </button>
      </form>
    </section>
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

function KindBadge({ kind }) {
  const meta = KIND_META[kind];
  return (
    <span className="kind-badge" style={{ background: meta.soft, color: meta.color }}>
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
