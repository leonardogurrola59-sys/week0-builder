"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
// These mirror (but intentionally don't import) the shapes written to
// localStorage by app/chat/page.tsx and app/marketing/page.tsx.

interface ChatLogMessage {
  feedback: "up" | "down" | null;
  variant?: "guardrail" | "checkpoint";
}

interface ChatLogRecord {
  id: string;
  saved_at: string;
  stepReached: number;
  intake: {
    location: string;
    source: string;
    reach: string;
  };
  messages: ChatLogMessage[];
  feedbackSummary: { up: number; down: number };
}

interface MarketingFormState {
  productName: string;
  targetUser: string;
  problemSolved: string;
  valueProposition: string;
  toneOfVoice: string;
  callToAction: string;
  marketingChannel: string;
  campaignObjective: string;
}

interface MarketingSpecRecord {
  id: string;
  saved_at: string;
  label: string;
  formState: MarketingFormState;
}

// ── Small reusable primitives ─────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function StatusPill({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium ${color}`}>
      {label}
    </span>
  );
}

function formatDateTime(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

// ── Derivation helpers ─────────────────────────────────────────────────────────

function sentimentCell(summary: { up: number; down: number }) {
  if (summary.up === 0 && summary.down === 0) {
    return { text: "No feedback logged", color: "text-slate-500" };
  }
  if (summary.up > summary.down) {
    return { text: `👍 ${summary.up}  ·  👎 ${summary.down}`, color: "text-emerald-400" };
  }
  if (summary.down > summary.up) {
    return { text: `👍 ${summary.up}  ·  👎 ${summary.down}`, color: "text-amber-400" };
  }
  return { text: `👍 ${summary.up}  ·  👎 ${summary.down}`, color: "text-slate-300" };
}

function complianceStatus(entry: ChatLogRecord): { label: string; color: string } {
  const hasCheckpoint = entry.messages.some((m) => m.variant === "checkpoint");
  const hasGuardrail = entry.messages.some((m) => m.variant === "guardrail");

  if (hasCheckpoint) {
    return { label: "👤 Escalated — Human Checkpoint", color: "border-red-700 bg-red-950/40 text-red-300" };
  }
  if (entry.stepReached >= 4) {
    return { label: "✅ Ready for SEMARNAT Submission", color: "border-emerald-700 bg-emerald-950/40 text-emerald-300" };
  }
  if (hasGuardrail) {
    return { label: "🛡️ Guardrail Intercepted", color: "border-amber-700 bg-amber-950/40 text-amber-300" };
  }
  return { label: "🕓 Intake In Progress", color: "border-slate-600 bg-slate-900 text-slate-300" };
}

// ── Empty-state fallback mock data ────────────────────────────────────────────
// Realistic stand-ins mirroring the actual user-test inputs from the Week 5
// chat assistant and Week 4 marketing engine, shown only when localStorage
// has no saved records yet.

const MOCK_AUDIT_ENTRIES: ChatLogRecord[] = [
  {
    id: "mock-audit-1",
    saved_at: "2026-06-25T16:40:00.000Z",
    stepReached: 4,
    intake: {
      location: "Iztapalapa, Sector 8",
      source: "Brick kiln smoke (hornos de ladrillo)",
      reach: "WhatsApp group — 187 members",
    },
    messages: [{ feedback: "up" }, { feedback: null }],
    feedbackSummary: { up: 1, down: 0 },
  },
  {
    id: "mock-audit-2",
    saved_at: "2026-06-27T11:05:00.000Z",
    stepReached: 1,
    intake: { location: "", source: "", reach: "" },
    messages: [{ feedback: null, variant: "guardrail" }],
    feedbackSummary: { up: 0, down: 0 },
  },
  {
    id: "mock-audit-3",
    saved_at: "2026-06-28T09:20:00.000Z",
    stepReached: 4,
    intake: {
      location: "San Lorenzo Tezonco",
      source: "Unpaved transit dust",
      reach: "Facebook Community Hub",
    },
    messages: [{ feedback: "up" }, { feedback: "up" }],
    feedbackSummary: { up: 2, down: 0 },
  },
];

const MOCK_GROWTH_TEMPLATES: MarketingSpecRecord[] = [
  {
    id: "mock-growth-1",
    saved_at: "2026-06-26T18:10:00.000Z",
    label: "AireLimpio CDMX",
    formState: {
      productName: "AireLimpio CDMX",
      targetUser: "Mexico City Community Leaders & Activists (e.g., Iztapalapa)",
      problemSolved:
        "Unstructured community air pollution evidence gets dismissed by SEMARNAT/SEMAICA due to formatting and citation errors.",
      valueProposition:
        "Transforming local community photos and raw air data into formal, legally cited environmental compliance packets in one click.",
      toneOfVoice: 'Authoritative yet deeply accessible "trusted doctor" voice',
      callToAction: "Generate Verified Compliance Report",
      marketingChannel: "WhatsApp Community Groups & Local Facebook Hubs",
      campaignObjective: "Recruit 50 neighborhood leads to join our localized air tracking network",
    },
  },
];

const MARKETING_FIELDS: { key: keyof MarketingFormState; label: string }[] = [
  { key: "productName", label: "Product Name" },
  { key: "targetUser", label: "Target User" },
  { key: "problemSolved", label: "Problem Solved" },
  { key: "valueProposition", label: "Value Proposition" },
  { key: "toneOfVoice", label: "Tone of Voice" },
  { key: "callToAction", label: "Call to Action" },
  { key: "marketingChannel", label: "Marketing Channel" },
  { key: "campaignObjective", label: "Campaign Objective" },
];

// ── Main page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [auditEntries, setAuditEntries] = useState<ChatLogRecord[]>([]);
  const [growthTemplates, setGrowthTemplates] = useState<MarketingSpecRecord[]>([]);
  const [usingMockAudit, setUsingMockAudit] = useState(false);
  const [usingMockGrowth, setUsingMockGrowth] = useState(false);

  // Hydrate both registries from localStorage on mount (client-only — avoids
  // any server/client markup mismatch since these arrays only exist in the browser).
  useEffect(() => {
    try {
      const raw = localStorage.getItem("airelimpio_chat_logs");
      const parsed: ChatLogRecord[] = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setAuditEntries(parsed);
      } else {
        setAuditEntries(MOCK_AUDIT_ENTRIES);
        setUsingMockAudit(true);
      }
    } catch {
      setAuditEntries(MOCK_AUDIT_ENTRIES);
      setUsingMockAudit(true);
    }

    try {
      const raw = localStorage.getItem("saved_marketing_history");
      const parsed: MarketingSpecRecord[] = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setGrowthTemplates(parsed);
      } else {
        setGrowthTemplates(MOCK_GROWTH_TEMPLATES);
        setUsingMockGrowth(true);
      }
    } catch {
      setGrowthTemplates(MOCK_GROWTH_TEMPLATES);
      setUsingMockGrowth(true);
    }
  }, []);

  return (
    <div className="min-h-screen pb-16 text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-6" style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">Records Registry Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 6 — Unified compliance audit log and growth engine template registry
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* ── Registry Table A: Compliance Audit Entries ── */}
        <SectionCard title="Registry A — Compliance Audit Entries">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs leading-relaxed text-slate-400">
              Sourced from <code className="text-slate-300">airelimpio_chat_logs</code> — every
              saved Dra. Aire intake session, including guardrail and human-checkpoint events.
            </p>
            {usingMockAudit && (
              <span className="shrink-0 rounded border border-indigo-700 bg-indigo-950/40 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                Showing sample data
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Sector Location</th>
                  <th className="px-4 py-3">Pollution Source Type</th>
                  <th className="px-4 py-3">Active Sentiment</th>
                  <th className="px-4 py-3">Compliance Status</th>
                </tr>
              </thead>
              <tbody>
                {auditEntries.map((entry) => {
                  const sentiment = sentimentCell(entry.feedbackSummary);
                  const status = complianceStatus(entry);
                  return (
                    <tr key={entry.id} className="border-t border-slate-800">
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">
                        {formatDateTime(entry.saved_at)}
                      </td>
                      <td className="px-4 py-3 text-slate-200">{entry.intake.location || "—"}</td>
                      <td className="px-4 py-3 text-slate-200">{entry.intake.source || "—"}</td>
                      <td className={`px-4 py-3 font-medium ${sentiment.color}`}>{sentiment.text}</td>
                      <td className="px-4 py-3">
                        <StatusPill label={status.label} color={status.color} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── Registry Table B: Growth Engine Templates ── */}
        <SectionCard title="Registry B — Growth Engine Templates">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs leading-relaxed text-slate-400">
              Sourced from <code className="text-slate-300">saved_marketing_history</code> — the
              8-input campaign specifications saved from the Marketing Engine.
            </p>
            {usingMockGrowth && (
              <span className="shrink-0 rounded border border-indigo-700 bg-indigo-950/40 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                Showing sample data
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3">Saved At</th>
                  {MARKETING_FIELDS.map((f) => (
                    <th key={f.key} className="px-4 py-3">
                      {f.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {growthTemplates.map((spec) => (
                  <tr key={spec.id} className="border-t border-slate-800">
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">
                      {formatDateTime(spec.saved_at)}
                    </td>
                    {MARKETING_FIELDS.map((f) => (
                      <td
                        key={f.key}
                        title={spec.formState[f.key]}
                        className="max-w-[220px] truncate px-4 py-3 text-slate-200"
                      >
                        {spec.formState[f.key] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
