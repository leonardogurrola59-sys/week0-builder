"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface ResearchResult {
  id: string;
  generated_at: string;
  venture_idea: string;
  validated_problem: {
    original: string;
    refined: string;
    severity_score: number;
    is_validated: boolean;
  };
  target_user_profile: string[];
  global_benchmarks: {
    rank: number;
    name: string;
    region: string;
    description: string;
    url: string;
    relevance: string;
  }[];
  mexico_local_notes: {
    regulatory_body: string;
    data_portal: string;
    primary_language: string;
    localization_notes: string[];
    key_open_feeds: { name: string; url: string }[];
  };
  competitor_matrix: {
    id: number;
    name: string;
    type: string;
    open_data: boolean;
    mobile_app: boolean;
    spanish_ui: boolean;
    evidence_packets: boolean;
    mexico_coverage: string;
    pricing: string;
    gap: string;
  }[];
  project_risk_map: {
    risk_id: string;
    category: string;
    description: string;
    likelihood: string;
    impact: string;
    mitigation: string;
  }[];
  next_steps: {
    immediate: string[];
    week_1_features: string[];
    week_2_scaling: string[];
  };
  request_echo: {
    venture_idea: string;
    target_user: string;
    problem: string;
    context: string;
    assumptions: string;
  };
}

// ── Small reusable primitives ──────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function Badge({ value, color }: { value: string; color: string }) {
  const colors: Record<string, string> = {
    red:    "bg-red-900/60 text-red-300 border-red-700",
    orange: "bg-orange-900/60 text-orange-300 border-orange-700",
    yellow: "bg-yellow-900/60 text-yellow-300 border-yellow-700",
    green:  "bg-emerald-900/60 text-emerald-300 border-emerald-700",
    blue:   "bg-blue-900/60 text-blue-300 border-blue-700",
  };
  return (
    <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${colors[color] ?? colors.blue}`}>
      {value}
    </span>
  );
}

function likelihoodColor(v: string) {
  if (v === "High")   return "red";
  if (v === "Medium") return "yellow";
  return "green";
}
function impactColor(v: string) {
  if (v === "High")   return "orange";
  if (v === "Medium") return "yellow";
  return "green";
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ResearchPage() {
  // Form state
  const [ventureIdea,  setVentureIdea]  = useState("CivicAir community dashboard");
  const [targetUser,   setTargetUser]   = useState("Residents in underserved urban communities");
  const [problem,      setProblem]      = useState("No accessible plain-language air quality data in Spanish");
  const [context,      setContext]      = useState("Mexico City, Mexico");
  const [assumptions,  setAssumptions]  = useState("Users have Android phones and WhatsApp");

  // Output + loading
  const [result,   setResult]   = useState<ResearchResult | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // History
  const [history,  setHistory]  = useState<ResearchResult[]>([]);

  // Competitor filter
  const [filter, setFilter] = useState("");

  // ── Load history from localStorage on mount ──────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem("saved_research_history");
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      console.error("Failed to load research history");
    }
  }, []);

  // ── API call ──────────────────────────────────────────────────────────────
  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ventureIdea, targetUser, problem, context, assumptions }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data: ResearchResult = await res.json();
      setResult(data);
      saveToHistory(data);
    } catch (e: any) {
      setError(e.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function saveToHistory(data: ResearchResult) {
    setHistory((prev) => {
      const deduped = [data, ...prev.filter((r) => r.id !== data.id)].slice(0, 20);
      localStorage.setItem("saved_research_history", JSON.stringify(deduped));
      return deduped;
    });
  }

  function clearHistory() {
    if (!confirm("Clear all saved research history?")) return;
    setHistory([]);
    localStorage.removeItem("saved_research_history");
  }

  // ── Filtered competitors ──────────────────────────────────────────────────
  const filteredCompetitors = result
    ? result.competitor_matrix.filter((c) => {
        const q = filter.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.gap.toLowerCase().includes(q);
      })
    : [];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen pb-32 text-slate-200"
      style={{ backgroundColor: "#0f172a" }}
    >
      {/* ── Header ── */}
      <div className="border-b border-slate-700 px-6 py-6"
           style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Research &amp; Benchmarking Agent
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 2 — Venture validation, competitive analysis, and Mexico market context
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">

        {/* ── Input form + history sidebar ── */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Form */}
          <div className="md:col-span-2 rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-4">
            <h2 className="font-semibold text-white">Venture Input</h2>

            {[
              { label: "Venture Idea",  value: ventureIdea,  set: setVentureIdea  },
              { label: "Target User",   value: targetUser,   set: setTargetUser   },
              { label: "Problem",       value: problem,      set: setProblem      },
              { label: "Context",       value: context,      set: setContext      },
              { label: "Assumptions",   value: assumptions,  set: setAssumptions  },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs text-slate-400 mb-1">{label}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            ))}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing… (~1s)
                </span>
              ) : (
                "Run Research Agent"
              )}
            </button>

            {error && (
              <p className="rounded bg-red-900/40 border border-red-700 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            )}
          </div>

          {/* History panel */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Saved History</h2>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-xs text-red-400 hover:underline">
                  Clear
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <p className="text-xs text-slate-500 flex-1">No runs saved yet.</p>
            ) : (
              <ul className="space-y-2 overflow-y-auto max-h-80 flex-1 pr-1">
                {history.map((h) => (
                  <li
                    key={h.id}
                    onClick={() => setResult(h)}
                    className={`cursor-pointer rounded-lg border p-2.5 text-xs transition ${
                      result?.id === h.id
                        ? "border-indigo-500 bg-indigo-950 text-white"
                        : "border-slate-600 bg-slate-900 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <div className="font-medium truncate">{h.venture_idea}</div>
                    <div className="text-slate-500 mt-0.5 truncate">
                      {new Date(h.generated_at).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Results (only shown post-generation) ── */}
        {result && (
          <div className="space-y-6">

            {/* ── Section A — Problem Validation ── */}
            <SectionCard title="A — Problem Validation">
              <div className="space-y-3">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Original</span>
                  <p className="mt-1 text-slate-200">{result.validated_problem.original}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">Refined Statement</span>
                  <p className="mt-1 text-slate-200">{result.validated_problem.refined}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">
                      Severity Score
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-40 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${result.validated_problem.severity_score * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-indigo-300">
                        {result.validated_problem.severity_score.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">
                      Validated
                    </span>
                    <Badge
                      value={result.validated_problem.is_validated ? "✓ Confirmed" : "Unconfirmed"}
                      color={result.validated_problem.is_validated ? "green" : "red"}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ── Section B — Target User Profile ── */}
            <SectionCard title="B — Target User Profile">
              <ul className="space-y-3">
                {result.target_user_profile.map((bullet, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-400" />
                    <span className="text-slate-200 text-sm leading-relaxed">{bullet}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            {/* ── Section C — Global Benchmarks ── */}
            <SectionCard title="C — Global Benchmarks">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.global_benchmarks.map((b) => (
                  <a
                    key={b.rank}
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col gap-2 rounded-xl border border-slate-600 bg-slate-900 p-4 transition hover:border-indigo-500 hover:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-white group-hover:text-indigo-300 transition">
                        {b.name}
                      </span>
                      <span className="shrink-0 text-slate-500 text-xs">#{b.rank}</span>
                    </div>
                    <span className="text-xs text-indigo-400">{b.region}</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
                    <p className="text-xs text-slate-500 italic">{b.relevance}</p>
                    <span className="mt-auto text-xs text-indigo-400 group-hover:underline truncate">
                      {b.url}
                    </span>
                  </a>
                ))}
              </div>
            </SectionCard>

            {/* ── Section D — Mexico Local Notes ── */}
            <SectionCard title="D — Mexico Local Translation">
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3 text-sm">
                  {[
                    { label: "Regulatory Body", value: result.mexico_local_notes.regulatory_body },
                    { label: "Data Portal",     value: result.mexico_local_notes.data_portal     },
                    { label: "Primary Language", value: result.mexico_local_notes.primary_language },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg border border-slate-600 bg-slate-900 p-3">
                      <span className="block text-xs text-slate-400 mb-1">{label}</span>
                      {label === "Data Portal" ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-400 hover:underline break-all text-xs"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-slate-200">{value}</span>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    Localization Notes
                  </span>
                  <ul className="mt-2 space-y-2">
                    {result.mexico_local_notes.localization_notes.map((note, i) => (
                      <li key={i} className="flex gap-3 text-sm text-slate-300">
                        <span className="shrink-0 text-indigo-400 font-mono text-xs mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide">
                    Key Open Feeds
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result.mexico_local_notes.key_open_feeds.map((feed) => (
                      <a
                        key={feed.name}
                        href={feed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-slate-600 bg-slate-900 px-3 py-1.5 text-xs text-indigo-400 hover:border-indigo-500 hover:text-indigo-300 transition"
                      >
                        ↗ {feed.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* ── Section E — Competitor Matrix ── */}
            <SectionCard title="E — Competitor Matrix">
              <div>
                <input
                  type="text"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter by name or gap..."
                  className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase tracking-wide">
                      <tr>
                        {["Name","Type","Open Data","Mobile","es-MX","Packets","MX Coverage","Pricing","Gap"].map((h) => (
                          <th key={h} className="px-3 py-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompetitors.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-3 py-6 text-center text-slate-500">
                            No results match "{filter}"
                          </td>
                        </tr>
                      ) : (
                        filteredCompetitors.map((c, i) => (
                          <tr
                            key={c.id}
                            className={`border-t border-slate-700 ${
                              i % 2 === 0 ? "bg-slate-800" : "bg-slate-800/50"
                            } hover:bg-slate-700 transition`}
                          >
                            <td className="px-3 py-3 font-medium text-white whitespace-nowrap">{c.name}</td>
                            <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{c.type}</td>
                            <td className="px-3 py-3 text-center">{c.open_data      ? "✓" : "—"}</td>
                            <td className="px-3 py-3 text-center">{c.mobile_app     ? "✓" : "—"}</td>
                            <td className="px-3 py-3 text-center">{c.spanish_ui     ? "✓" : "—"}</td>
                            <td className="px-3 py-3 text-center">{c.evidence_packets ? "✓" : "—"}</td>
                            <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{c.mexico_coverage}</td>
                            <td className="px-3 py-3 text-slate-400 whitespace-nowrap">{c.pricing}</td>
                            <td className="px-3 py-3 text-slate-400 max-w-xs">{c.gap}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Showing {filteredCompetitors.length} of {result.competitor_matrix.length} entries
                </p>
              </div>
            </SectionCard>

            {/* ── Section F — Risk Map ── */}
            <SectionCard title="F — Project Risk Map">
              <div className="grid gap-4 sm:grid-cols-3">
                {result.project_risk_map.map((risk) => (
                  <div
                    key={risk.risk_id}
                    className="rounded-xl border border-slate-600 bg-slate-900 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-indigo-400">{risk.risk_id}</span>
                      <span className="text-xs font-medium text-slate-300">{risk.category}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{risk.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Likelihood</span>
                        <Badge value={risk.likelihood} color={likelihoodColor(risk.likelihood)} />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block mb-1">Impact</span>
                        <Badge value={risk.impact} color={impactColor(risk.impact)} />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 block mb-1">Mitigation</span>
                      <p className="text-xs text-slate-400 leading-relaxed">{risk.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Section G — Next Steps Timeline ── */}
            <SectionCard title="G — Next Steps Timeline">
              <div className="grid gap-6 md:grid-cols-3">
                {(
                  [
                    { key: "immediate",       label: "Immediate",     color: "border-emerald-500 text-emerald-400", dot: "bg-emerald-400" },
                    { key: "week_1_features", label: "Week 1",        color: "border-indigo-500 text-indigo-400",   dot: "bg-indigo-400"  },
                    { key: "week_2_scaling",  label: "Week 2 Scale",  color: "border-violet-500 text-violet-400",   dot: "bg-violet-400"  },
                  ] as const
                ).map(({ key, label, color, dot }) => (
                  <div key={key} className={`rounded-xl border-l-2 ${color.split(" ")[0]} bg-slate-900 p-4 space-y-3`}>
                    <h3 className={`text-xs font-semibold uppercase tracking-wide ${color.split(" ")[1]}`}>
                      {label}
                    </h3>
                    <ul className="space-y-3">
                      {result.next_steps[key].map((step, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-slate-300 leading-relaxed">
                          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>

          </div>
        )}

        {/* ── Empty state ── */}
        {!result && !loading && (
          <div className="rounded-2xl border border-dashed border-slate-700 p-16 text-center">
            <p className="text-slate-500 text-sm">
              Fill in the venture inputs above and click{" "}
              <span className="text-indigo-400 font-medium">Run Research Agent</span> to generate
              your analysis.
            </p>
          </div>
        )}

      </div>

      {/* ── Validation Evidence Footer ── */}
      <div
        className="fixed bottom-0 left-0 right-0 border-t border-slate-700 px-6 py-3"
        style={{ backgroundColor: "#0f172a" }}
      >
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Week 2 Research &amp; Benchmarking Agent — validation evidence on file
          </span>
          <a
            href="/interviews/human-interview-01.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-emerald-600 bg-emerald-900/40 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-800/60 hover:text-white"
          >
            👤 View Primary Evidence: Rosa Elena Vargas Mendoza Transcript
          </a>
        </div>
      </div>

    </div>
  );
}
