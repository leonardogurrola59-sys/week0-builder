"use client";

// ── Nav index ──────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  { id: "prompt-library", label: "1. Prompt Library" },
  { id: "system-build-logs", label: "2. System Build Logs" },
  { id: "structural-architecture-notes", label: "3. Structural Architecture Notes" },
];

// ── Section 1 data: Prompt Library ────────────────────────────────────────────

const PROMPTS = [
  {
    title: "The Chatbot Intake Logic Prompt",
    subtitle: "Week 5 — app/chat/page.tsx · 3-question intake → compliance summary",
    code: `Let's fully implement Step 2: The 3 Intake Questions & Venture
Response Logic inside app/chat/page.tsx.

Modify the message submission flow to execute this sequential
logic based on currentStep:

1. Step 1 → 2: capture the user's reply as Location data, show the
   typing indicator for 1s, then ask for the specific neighborhood/
   sector and primary pollution source (Source Type).
2. Step 2 → 3: capture the reply as Source data, then ask whether
   the user has WhatsApp groups or Facebook hubs ready for
   broadcast (Community Reach).
3. Step 3 → 4: capture Reach data, then render a structured
   "Dra. Aire's Actionable Compliance Summary" card containing a
   SEMARNAT Evidence Format Checklist and a custom WhatsApp
   broadcast plan built from the captured location + source.

Update the step header to read "Intake — Step N of 3" until
complete, then "Analysis Complete".`,
  },
  {
    title: "The Spanish Keyword Guardrail Revision Prompt",
    subtitle: "Week 5 — app/chat/page.tsx · bilingual guardrail bypass fix",
    code: `Let's fix an edge case in our app/chat/page.tsx guardrail engine.

Right now, if a user types something completely unrelated in
Spanish like "mi celular se rompio, que hago?", it bypasses the
guardrail and advances to Step 2.

1. Add common Spanish out-of-scope keywords to the trigger list:
   "celular", "teléfono", "médico", "asma", "tos", "pastilla",
   "medicina", "agua", "bache", "elección", "votar".
2. Ensure that when any of these keywords match, currentStep
   remains frozen and the "⚠️ Guardrail Triggered..." message is
   appended instead of advancing the conversation.`,
  },
  {
    title: "The Active Local Storage Feedback Persistence Prompt",
    subtitle: "Week 5 — app/chat/page.tsx · 👍/👎 toggle + localStorage upsert",
    code: `Let's make the thumbs up and thumbs down feedback buttons fully
functional on our app/chat/page.tsx page.

1. Create a handleFeedback(messageId, type: 'up' | 'down')
   function that toggles that message's feedback value (or back to
   null if clicked again).
2. Immediately after updating message state, push an updated
   snapshot of the entire active chat history session to the
   localStorage key 'airelimpio_chat_logs' so feedback metrics are
   permanently saved in our session log evidence.
3. Update the icon styles reactively on click: bg-emerald-500/20
   text-emerald-400 for thumbs-up, bg-amber-500/20 text-amber-400
   for thumbs-down.`,
  },
];

// ── Section 2 data: System Build Logs ─────────────────────────────────────────

const BUILD_LOGS = [
  {
    week: "Week 1",
    title: "Core Dashboard — raw simulation input",
    description:
      "The schema starts as a single raw measurement: one PM2.5 reading paired with a timestamp, fed straight into the simulation engine.",
    schema: `interface CoreSimulation {
  pm25: number;
  timestamp: string;
}`,
  },
  {
    week: "Week 2",
    title: "Research & Benchmarking — nested multi-section payload",
    description:
      "The shape grows from one flat record into a nested research document: validated problem, benchmarks, competitor matrix, and a risk map.",
    schema: `interface ResearchResult {
  validated_problem: { refined: string; severity_score: number };
  global_benchmarks: BenchmarkEntry[];
  competitor_matrix: CompetitorEntry[];
  project_risk_map: RiskEntry[];
}`,
  },
  {
    week: "Week 3",
    title: "Pricing Simulator — slider-driven scenario snapshots",
    description:
      "Five interactive sliders (segment, users, price, conversion, churn) get captured into discrete, comparable saved-scenario records.",
    schema: `interface SavedScenario {
  index: number;
  segment: string;
  users: number;
  price: number;
  conversion: number;
  churn: number;
  monthly: number;
  annual: number;
}`,
  },
  {
    week: "Week 4",
    title: "Marketing Engine — 8-input multi-variable campaign spec",
    description:
      "The schema jumps from numeric sliders to an 8-field qualitative campaign spec, plus a generated asset pack (posts, scripts, calendar, prompts, A/B variants).",
    schema: `interface MarketingFormState {
  productName: string;
  targetUser: string;
  problemSolved: string;
  valueProposition: string;
  toneOfVoice: string;
  callToAction: string;
  marketingChannel: string;
  campaignObjective: string;
}`,
  },
  {
    week: "Week 5",
    title: "Chat Assistant — localized, guardrail-aware session structures",
    description:
      "The schema becomes conversational and stateful: an intake object, a message list carrying guardrail/checkpoint variants, and an aggregated feedback summary.",
    schema: `interface ChatLog {
  intake: { location: string; source: string; reach: string };
  messages: {
    feedback: "up" | "down" | null;
    variant?: "guardrail" | "checkpoint";
  }[];
  feedbackSummary: { up: number; down: number };
}`,
  },
];

// ── Small reusable primitives ─────────────────────────────────────────────────

function SectionShell({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="max-h-[70vh] space-y-5 overflow-y-auto rounded-2xl border border-slate-700 bg-slate-800 p-6 scroll-mt-6"
    >
      <h2 className="sticky top-0 -mx-6 -mt-6 border-b border-slate-700 bg-slate-800 px-6 py-4 text-lg font-semibold text-white tracking-wide">
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function DocsPage() {
  return (
    <div className="min-h-screen pb-16 text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-6" style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">Technical Documentation</h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 6 — Prompt library, build-log history, and architecture notes for AireLimpio CDMX
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[25%_1fr] lg:items-start">
          {/* ── Left Sidebar: navigation index ── */}
          <aside className="lg:sticky lg:top-6">
            <nav className="space-y-1 rounded-2xl border border-slate-700 bg-slate-800 p-4">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Index
              </span>
              {NAV_SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* ── Right Content Panel ── */}
          <div className="space-y-8">
            {/* Section 1 — Prompt Library */}
            <SectionShell id="prompt-library" title="1 — Prompt Library">
              <p className="text-xs leading-relaxed text-slate-400">
                The three foundational prompts that drove the Week 5 chat-assistant build, kept
                verbatim for reproducibility.
              </p>
              <div className="space-y-4">
                {PROMPTS.map((p) => (
                  <div key={p.title} className="rounded-xl border border-slate-600 bg-slate-900 p-4 space-y-2">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{p.title}</h3>
                      <p className="text-[11px] text-slate-500">{p.subtitle}</p>
                    </div>
                    <pre className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs leading-relaxed text-emerald-300">
                      <code>{p.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </SectionShell>

            {/* Section 2 — System Build Logs */}
            <SectionShell id="system-build-logs" title="2 — System Build Logs">
              <p className="text-xs leading-relaxed text-slate-400">
                Schema evolution across the project — from a single raw PM2.5 reading in Week 1 to
                multi-variable marketing specs in Week 4 and localized chat structures in Week 5.
              </p>
              <div className="space-y-4">
                {BUILD_LOGS.map((log) => (
                  <div key={log.week} className="rounded-xl border border-slate-600 bg-slate-900 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded border border-indigo-700 bg-indigo-950/40 px-2 py-0.5 text-[10px] font-semibold text-indigo-300">
                        {log.week}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{log.title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-400">{log.description}</p>
                    <pre className="overflow-x-auto rounded-lg border border-slate-700 bg-slate-950 p-3 text-xs leading-relaxed text-sky-300">
                      <code>{log.schema}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </SectionShell>

            {/* Section 3 — Structural Architecture Notes */}
            <SectionShell id="structural-architecture-notes" title="3 — Structural Architecture Notes">
              <h3 className="text-sm font-semibold text-white">
                Why client-side localStorage hydration loops instead of a database
              </h3>
              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <p>
                  Every saved-state feature in this app — chat session logs, marketing specs,
                  pricing scenarios — persists through a <code className="text-slate-200">useEffect</code>{" "}
                  hydration loop reading and writing browser <code className="text-slate-200">localStorage</code>,
                  rather than round-tripping to a backend database.
                </p>
                <p>
                  <span className="font-semibold text-emerald-300">Zero connection latency:</span>{" "}
                  reads and writes are synchronous calls on the same device — there is no network
                  hop, no connection pool, and no query planner standing between a click and a
                  saved record.
                </p>
                <p>
                  <span className="font-semibold text-emerald-300">Zero API/token cost:</span> none
                  of this persistence requires an LLM call. Saving a scenario, a campaign spec, or
                  a feedback rating is pure client-side state serialization — it never touches a
                  streaming token budget, unlike the generative steps (Dra. Aire&apos;s replies,
                  marketing copy) that intentionally do call out to simulated/real AI logic.
                </p>
                <p>
                  <span className="font-semibold text-emerald-300">Mobile-first by design:</span>{" "}
                  our target user — a community leader on a mid-range Android phone with a limited
                  data plan — gets instant, offline-tolerant access to everything they&apos;ve
                  already saved, with no spinner waiting on a flaky connection.
                </p>
                <p className="text-slate-400">
                  <span className="font-semibold text-amber-300">Trade-off, acknowledged:</span>{" "}
                  this scopes data to a single browser/device (no cross-device sync), caps total
                  storage around 5–10MB, and keeps no server-side audit trail. That&apos;s an
                  acceptable MVP-stage trade for this pilot; a future phase could sync this same
                  schema to a lightweight backend (e.g. Supabase) once the product moves past
                  single-device community testing.
                </p>
              </div>
            </SectionShell>
          </div>
        </div>
      </div>
    </div>
  );
}
