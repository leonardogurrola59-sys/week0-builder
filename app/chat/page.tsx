"use client";

import { useEffect, useRef, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ComplianceSummaryData {
  location: string;
  source: string;
  reach: string;
  checklist: string[];
  whatsappPlan: string[];
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  feedback: "up" | "down" | null;
  summary?: ComplianceSummaryData;
  variant?: "guardrail" | "checkpoint";
}

interface IntakeData {
  location: string;
  source: string;
  reach: string;
}

interface ChatLog {
  id: string;
  saved_at: string;
  stepReached: number;
  intake: IntakeData;
  messages: Message[];
  feedbackSummary: { up: number; down: number };
}

interface TestLog {
  id: string;
  tester: string;
  location: string;
  rating: number;
  scenario: string;
  outcome: string;
  status: string;
}

// ── Small reusable primitives ─────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5 space-y-4">
      <h2 className="text-sm font-semibold text-white tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="text-amber-400 text-xs tracking-tight">
      {"★".repeat(rating)}
      <span className="text-slate-600">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({
  message,
  onFeedback,
}: {
  message: Message;
  onFeedback: (id: string, value: "up" | "down") => void;
}) {
  const isUser = message.sender === "user";
  const isGuardrail = message.variant === "guardrail";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        {!isUser && (
          <span className={`text-xs font-semibold ${isGuardrail ? "text-amber-400" : "text-emerald-400"}`}>
            {isGuardrail ? "🛡️ Dra. Aire — Guardrail" : "🩺 Dra. Aire"}
          </span>
        )}
        <div
          className={`whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "bg-indigo-600 text-white"
              : isGuardrail
              ? "border border-amber-600 bg-amber-950/30 text-amber-100"
              : "border border-slate-600 bg-slate-900 text-slate-200"
          }`}
        >
          {message.text}
        </div>
        <div className="flex items-center gap-2 px-1">
          <span className="text-[11px] text-slate-500">{formatTime(message.timestamp)}</span>
          {!isUser && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onFeedback(message.id, "up")}
                className={`text-xs transition ${
                  message.feedback === "up" ? "text-emerald-400" : "text-slate-600 hover:text-slate-400"
                }`}
              >
                👍
              </button>
              <button
                onClick={() => onFeedback(message.id, "down")}
                className={`text-xs transition ${
                  message.feedback === "down" ? "text-red-400" : "text-slate-600 hover:text-slate-400"
                }`}
              >
                👎
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl border border-slate-600 bg-slate-900 px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
      </div>
    </div>
  );
}

function ComplianceSummaryCard({ data, timestamp }: { data: ComplianceSummaryData; timestamp: string }) {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[92%] space-y-4 rounded-2xl border border-emerald-700 bg-emerald-950/20 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="text-sm font-bold text-white">Dra. Aire&apos;s Actionable Compliance Summary</span>
          </div>
          <span className="rounded-full border border-emerald-600 bg-emerald-900/40 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-300">
            Analysis Complete
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-2">
            <span className="block text-[10px] text-slate-400">📍 Location</span>
            <span className="block truncate text-slate-200">{data.location || "—"}</span>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-2">
            <span className="block text-[10px] text-slate-400">🏭 Source</span>
            <span className="block truncate text-slate-200">{data.source || "—"}</span>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900 p-2">
            <span className="block text-[10px] text-slate-400">💬 Reach</span>
            <span className="block truncate text-slate-200">{data.reach || "—"}</span>
          </div>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-300">
            ✅ SEMARNAT Evidence Format Checklist
          </span>
          <ul className="space-y-1.5">
            {data.checklist.map((item, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                <span className="text-emerald-400">☑</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 rounded-xl border border-slate-700 bg-slate-900 p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            📲 Custom WhatsApp Broadcast Plan
          </span>
          <ol className="space-y-1.5">
            {data.whatsappPlan.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-300">
                <span className="font-bold text-violet-400">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <span className="block text-[11px] text-slate-500">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
}

function HumanCheckpointCard({ timestamp }: { timestamp: string }) {
  return (
    <div className="flex justify-start">
      <div className="w-full max-w-[92%] space-y-2 rounded-2xl border border-red-700 bg-red-950/20 p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <span className="text-sm font-bold text-white">Human Checkpoint</span>
          <span className="ml-auto rounded-full border border-red-600 bg-red-900/40 px-2.5 py-0.5 text-[10px] font-semibold text-red-300">
            Escalation Required
          </span>
        </div>
        <p className="text-sm leading-relaxed text-red-200">
          This situation requires immediate external oversight. Please contact{" "}
          <strong className="font-semibold text-white">PROFEPA</strong> or our linked
          environmental legal network immediately at{" "}
          <a href="mailto:citizen-action@airelimpiocdmx.org" className="underline hover:text-white">
            citizen-action@airelimpiocdmx.org
          </a>
          .
        </p>
        <span className="block text-[11px] text-red-400/70">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
}

// ── Hardcoded validation evidence ─────────────────────────────────────────────

const TEST_LOGS: TestLog[] = [
  {
    id: "test-1",
    tester: "My Friend",
    location: "Metropolitan Area",
    rating: 5,
    scenario: "Logged smoke from a nearby restaurant to see if the step-by-step intake worked.",
    outcome: "Left a 5-star rating.",
    status: "✅ Passed",
  },
  {
    id: "test-2",
    tester: "My Mom",
    location: "Family Member",
    rating: 4,
    scenario: "Ran a stress test asking an unrelated Spanish question ('mi celular se rompio').",
    outcome: "Guardrail successfully intercepted the loop. Left a 4-star rating.",
    status: "🛡️ Guardrail Held",
  },
  {
    id: "test-3",
    tester: "My Classmate",
    location: "",
    rating: 5,
    scenario:
      "Rapidly clicked through steps 1-3 to see if the custom WhatsApp broadcast plan generated correctly.",
    outcome: "Left a 5-star rating.",
    status: "✅ Broadcast Plan Generated",
  },
];

const AVG_RATING = (TEST_LOGS.reduce((sum, t) => sum + t.rating, 0) / TEST_LOGS.length).toFixed(1);

const WELCOME_TEXT =
  "👩‍⚕️ Hola, soy la Dra. Aire. Estoy aquí para ayudarte a convertir lo que ves, hueles o documentas en tu colonia en un reporte formal que SEMARNAT pueda revisar.\n\nCuéntame primero: ¿qué problema de calidad del aire estás viviendo en tu comunidad? (Por ejemplo: humo de una fábrica, olores fuertes, quema de basura, polvo de una obra, etc.)";

const STEP2_QUESTION =
  "📍 [Step 2/3 - Source Type] Understood. Which specific neighborhood or sector in Iztapalapa/CDMX is experiencing this air anomaly, and what is the primary source? (e.g., local brick kilns, unpaved transit dust, factory smoke, or local photos)";

const STEP3_QUESTION =
  "💬 [Step 3/3 - Community Reach] Got it. To build a proper SEMARNAT complaint, we need mobilization. Do you have local neighborhood WhatsApp groups or Facebook hubs ready for broadcast?";

const STEP4_PLUS_REPLY =
  "✅ El análisis ya está completo. Usa el resumen de arriba para armar tu reporte para SEMARNAT y para lanzar tus alertas de WhatsApp.";

const CHAT_LOGS_KEY = "airelimpio_chat_logs";

// Bilingual keyword sets — the assistant serves an es-MX audience, so each
// trigger also scans for its common Spanish equivalent.
const GUARDRAIL_KEYWORDS = [
  "medical",
  "médico",
  "medico",
  "medica",
  "asthma",
  "asma",
  "cough",
  "tos",
  "medicine",
  "medicina",
  "medicamento",
  "pill",
  "pastilla",
  "píldora",
  "election",
  "elección",
  "eleccion",
  "vote",
  "votar",
  "candidate",
  "candidato",
  "water leak",
  "fuga de agua",
  "agua",
  "pothole",
  "bache",
  "celular",
  "teléfono",
  "telefono",
];

const CHECKPOINT_KEYWORDS = [
  "illegal dumping",
  "tiradero ilegal",
  "tiradero clandestino",
  "toxic waste",
  "residuos tóxicos",
  "residuos toxicos",
  "chemical spill",
  "derrame químico",
  "derrame quimico",
  "corrupt",
  "corrupción",
  "corrupcion",
];

const GUARDRAIL_RESPONSE_TEXT =
  "⚠️ Guardrail Triggered: I am specialized strictly in formatting air quality data and SEMARNAT legal evidence compliance. For medical emergencies, health diagnoses, or unrelated city services, please consult an official municipal provider or healthcare practitioner.";

const HUMAN_CHECKPOINT_TEXT =
  "👤 Human Checkpoint: This situation requires immediate external oversight. Please contact PROFEPA or our linked environmental legal network immediately at citizen-action@airelimpiocdmx.org.";

function findKeywordMatch(text: string, keywords: string[]): string | null {
  const lower = text.toLowerCase();
  return keywords.find((kw) => lower.includes(kw)) ?? null;
}

function buildComplianceSummary(data: IntakeData): ComplianceSummaryData {
  const location = data.location || "tu colonia";
  const source = data.source || "la fuente reportada";
  const reach = data.reach || "tu red comunitaria";

  return {
    location: data.location,
    source: data.source,
    reach: data.reach,
    checklist: [
      "Fecha y hora exacta de cada observación registrada",
      "Ubicación específica: calle, colonia y punto de referencia",
      "Fuente de contaminación claramente identificada",
      "Fotografías o videos con metadatos de geolocalización",
      "Lecturas de la estación SINAICA / SEDEMA más cercana, si están disponibles",
      "Datos de contacto del representante comunitario que presenta el reporte",
    ],
    whatsappPlan: [
      `Comparte una alerta corta en tu grupo: "🚨 Aviso de calidad del aire en ${location}: hemos detectado ${source}. Estamos documentando evidencia para un reporte formal a SEMARNAT."`,
      `Pide a 3-5 vecinos de ${location} que respondan con foto y hora exacta cada vez que noten ${source}.`,
      `Usa ${reach} para publicar un resumen semanal citando cuántos reportes se han recopilado antes de enviarlos a SEMARNAT.`,
    ],
  };
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ChatPage() {
  // Foundation state hooks
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [intakeData, setIntakeData] = useState<IntakeData>({ location: "", source: "", reach: "" });

  // Persistent session logging
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);
  const [justSavedLog, setJustSavedLog] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  // Seed the welcome message on mount (client-only to avoid timestamp hydration mismatch)
  useEffect(() => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: "assistant",
        text: WELCOME_TEXT,
        timestamp: new Date().toISOString(),
        feedback: null,
      },
    ]);
  }, []);

  // Hydrate previously saved chat logs from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHAT_LOGS_KEY);
      if (raw) setChatLogs(JSON.parse(raw));
    } catch {
      console.error("Failed to load saved chat logs");
    }
  }, []);

  // Keep the latest message in view
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleFeedback(id: string, value: "up" | "down") {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === value ? null : value } : m))
    );
  }

  function appendAssistantMessage(
    text: string,
    summary?: ComplianceSummaryData,
    variant?: "guardrail" | "checkpoint"
  ) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "assistant",
        text,
        timestamp: new Date().toISOString(),
        feedback: null,
        ...(summary ? { summary } : {}),
        ...(variant ? { variant } : {}),
      },
    ]);
  }

  function handleSend() {
    const text = inputMessage.trim();
    if (!text || isTyping) return;

    const stepAtSend = currentStep;

    // ── Guardrail Engine: scan before any standard step processing ──────────
    const checkpointMatch = findKeywordMatch(text, CHECKPOINT_KEYWORDS);
    const guardrailMatch = checkpointMatch ? null : findKeywordMatch(text, GUARDRAIL_KEYWORDS);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "user",
        text,
        timestamp: new Date().toISOString(),
        feedback: null,
      },
    ]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      if (checkpointMatch) {
        // Severe/dangerous incident — halt intake, escalate to a human checkpoint
        appendAssistantMessage(HUMAN_CHECKPOINT_TEXT, undefined, "checkpoint");
      } else if (guardrailMatch) {
        // Out-of-scope input — halt intake, redirect within scope
        appendAssistantMessage(GUARDRAIL_RESPONSE_TEXT, undefined, "guardrail");
      } else if (stepAtSend === 1) {
        setIntakeData((prev) => ({ ...prev, location: text }));
        appendAssistantMessage(STEP2_QUESTION);
        setCurrentStep(2);
      } else if (stepAtSend === 2) {
        setIntakeData((prev) => ({ ...prev, source: text }));
        appendAssistantMessage(STEP3_QUESTION);
        setCurrentStep(3);
      } else if (stepAtSend === 3) {
        const finalData: IntakeData = { ...intakeData, reach: text };
        setIntakeData(finalData);
        appendAssistantMessage(
          "📊 Dra. Aire's Actionable Compliance Summary",
          buildComplianceSummary(finalData)
        );
        setCurrentStep(4);
      } else {
        appendAssistantMessage(STEP4_PLUS_REPLY);
      }
      setIsTyping(false);
    }, 1000);
  }

  // ── Persistent session logging ───────────────────────────────────────────
  function handleSaveSessionLog() {
    const feedbackSummary = messages.reduce(
      (acc, m) => {
        if (m.feedback === "up") acc.up += 1;
        if (m.feedback === "down") acc.down += 1;
        return acc;
      },
      { up: 0, down: 0 }
    );

    const log: ChatLog = {
      id: crypto.randomUUID(),
      saved_at: new Date().toISOString(),
      stepReached: currentStep,
      intake: intakeData,
      messages,
      feedbackSummary,
    };

    setChatLogs((prev) => {
      const updated = [log, ...prev].slice(0, 20);
      localStorage.setItem(CHAT_LOGS_KEY, JSON.stringify(updated));
      return updated;
    });
    setJustSavedLog(true);
    setTimeout(() => setJustSavedLog(false), 2000);
  }

  function handleRemoveLog(id: string) {
    setChatLogs((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      localStorage.setItem(CHAT_LOGS_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function handleClearLogs() {
    if (!confirm("Clear all saved chat session logs?")) return;
    setChatLogs([]);
    localStorage.removeItem(CHAT_LOGS_KEY);
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-16 text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-6" style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dra. Aire — Compliance Chat Assistant
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 5 — Conversational intake for SEMARNAT-ready evidence packets
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[35%_1fr]">
          {/* ── Left Sidebar: Test Logs & Saved Evidence ── */}
          <div className="space-y-4">
            <SectionCard title="Test Logs & Saved Evidence">
              <p className="text-xs leading-relaxed text-slate-400">
                Validation evidence collected from real external testers interacting with the
                Dra. Aire intake assistant.
              </p>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-center">
                  <span className="block text-[10px] text-slate-400">Tests</span>
                  <span className="block text-sm font-bold text-white">{TEST_LOGS.length}</span>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-center">
                  <span className="block text-[10px] text-slate-400">Avg Rating</span>
                  <span className="block text-sm font-bold text-amber-400">{AVG_RATING}★</span>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-900 p-2 text-center">
                  <span className="block text-[10px] text-slate-400">Guardrails Held</span>
                  <span className="block text-sm font-bold text-emerald-400">1/1</span>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="External User Tests">
              <div className="space-y-3">
                {TEST_LOGS.map((t) => (
                  <div key={t.id} className="rounded-xl border border-slate-600 bg-slate-900 p-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold text-white">{t.tester}</span>
                        {t.location && <span className="ml-1.5 text-xs text-slate-500">({t.location})</span>}
                      </div>
                      <StarRating rating={t.rating} />
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">{t.scenario}</p>
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] leading-snug text-slate-300">{t.outcome}</span>
                    </div>
                    <span className="inline-block rounded border border-emerald-700 bg-emerald-950/40 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Saved Evidence">
              <div className="flex items-start justify-between gap-2">
                <p className="flex-1 text-xs leading-relaxed text-slate-400">
                  Save the current chat history, intake metrics, and feedback ratings as a
                  persistent session log.
                </p>
                {chatLogs.length > 0 && (
                  <button onClick={handleClearLogs} className="shrink-0 text-xs text-red-400 hover:underline">
                    Clear
                  </button>
                )}
              </div>

              <button
                onClick={handleSaveSessionLog}
                className="w-full rounded-lg border border-violet-600 bg-violet-600/20 px-3 py-2 text-xs font-semibold text-violet-200 transition-colors hover:bg-violet-600/30 hover:text-white"
              >
                {justSavedLog ? "✅ Session Saved!" : "💾 Save Session Log"}
              </button>

              {chatLogs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-center text-xs text-slate-500">
                  No evidence packets saved yet in this session.
                </div>
              ) : (
                <ul className="space-y-2 overflow-y-auto max-h-72 pr-1">
                  {chatLogs.map((log) => {
                    const isOpen = expandedLogId === log.id;
                    return (
                      <li key={log.id} className="rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-xs text-slate-300">
                        <button
                          onClick={() => setExpandedLogId(isOpen ? null : log.id)}
                          className="flex w-full items-center justify-between gap-2 text-left"
                        >
                          <div>
                            <div className="font-medium text-white">
                              Session — {new Date(log.saved_at).toLocaleDateString()}{" "}
                              {new Date(log.saved_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {log.messages.length} messages · Step {Math.min(log.stepReached, 4)}/4
                            </div>
                          </div>
                          <span className="shrink-0 text-slate-500">{isOpen ? "−" : "+"}</span>
                        </button>
                        {isOpen && (
                          <div className="mt-2 space-y-1.5 border-t border-slate-800 pt-2 text-[11px] leading-relaxed text-slate-400">
                            <div>
                              📍 <span className="text-slate-300">{log.intake.location || "—"}</span>
                            </div>
                            <div>
                              🏭 <span className="text-slate-300">{log.intake.source || "—"}</span>
                            </div>
                            <div>
                              💬 <span className="text-slate-300">{log.intake.reach || "—"}</span>
                            </div>
                            <div className="flex items-center gap-3 pt-1">
                              <span>👍 {log.feedbackSummary.up}</span>
                              <span>👎 {log.feedbackSummary.down}</span>
                            </div>
                            <button
                              onClick={() => handleRemoveLog(log.id)}
                              className="mt-1 rounded border border-red-600 px-2 py-1 text-[11px] text-red-300 hover:bg-red-600/20"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </SectionCard>
          </div>

          {/* ── Right Pane: Active Chat Workflow Shell ── */}
          <div className="flex h-[680px] flex-col rounded-2xl border border-slate-700 bg-slate-800">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-900/50 text-lg">
                  🩺
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Dra. Aire</div>
                  <div className="text-xs text-slate-400">Asistente de evidencia ambiental</div>
                </div>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${
                  currentStep >= 4
                    ? "border-emerald-700 bg-emerald-950/40 text-emerald-300"
                    : "border-indigo-700 bg-indigo-950/40 text-indigo-300"
                }`}
              >
                {currentStep >= 4 ? "Analysis Complete" : `Intake — Step ${currentStep} of 3`}
              </span>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.map((m) => {
                if (m.summary) {
                  return <ComplianceSummaryCard key={m.id} data={m.summary} timestamp={m.timestamp} />;
                }
                if (m.variant === "checkpoint") {
                  return <HumanCheckpointCard key={m.id} timestamp={m.timestamp} />;
                }
                return <MessageBubble key={m.id} message={m} onFeedback={handleFeedback} />;
              })}
              {isTyping && <TypingIndicator />}
              <div ref={scrollAnchorRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-slate-700 px-5 py-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                disabled={isTyping}
                placeholder="Describe lo que estás viendo u oliendo en tu colonia..."
                className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none disabled:opacity-60"
              />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || isTyping}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
