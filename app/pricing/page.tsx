"use client";

import { useMemo, useState } from "react";

// ── Reusable primitives (mirrors /research and /product aesthetic) ─────────────

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

// ── Scenario presets ────────────────────────────────────────────────────────────

type ScenarioKey = "Conservative" | "Expected" | "Aggressive";

const scenarios: Record<ScenarioKey, {
  users: number; price: number; conversion: number; churn: number; color: string;
}> = {
  Conservative: { users: 2000,  price: 5,  conversion: 2, churn: 12, color: "border-red-500 text-red-300"      },
  Expected:     { users: 8000,  price: 9,  conversion: 5, churn: 7,  color: "border-indigo-500 text-indigo-300" },
  Aggressive:   { users: 20000, price: 15, conversion: 9, churn: 4,  color: "border-emerald-500 text-emerald-300" },
};

const segments = [
  { key: "individual", label: "Individual / Starter", hint: "Free–$9/mo range, high volume, low conversion" },
  { key: "business",   label: "Business / Enterprise", hint: "$9–$50+/mo range, low volume, higher conversion" },
] as const;

const assumptionRisks = [
  {
    id: "MR-01",
    assumption: "Conversion rate stays constant as user base scales",
    risk: "Conversion typically decreases as you move from early adopters to mainstream users — modeled rate may overstate revenue at scale.",
    severity: "High",
  },
  {
    id: "MR-02",
    assumption: "Churn is flat month-over-month (no seasonality)",
    risk: "Real churn often spikes around billing cycles, contingencias ambientales lulls, or after onboarding — flat-rate model can under- or over-estimate annual revenue.",
    severity: "Medium",
  },
  {
    id: "MR-03",
    assumption: "No new user acquisition during the 12-month projection window",
    risk: "Annual figure is a conservative 'cohort decay' estimate — actual revenue could be materially higher with ongoing acquisition, or lower if acquisition stalls.",
    severity: "Medium",
  },
  {
    id: "MR-04",
    assumption: "Price elasticity is ignored — demand doesn't shift with price changes",
    risk: "Raising price may reduce conversion non-linearly; lowering it may not proportionally increase signups. Model treats price as an independent lever.",
    severity: "High",
  },
];

function severityColor(v: string) {
  if (v === "High") return "red";
  if (v === "Medium") return "yellow";
  return "green";
}

// ── Formatting helpers ──────────────────────────────────────────────────────────

const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtNum = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

// Cohort-decay annual multiplier: sum of (1 - churn)^m for m = 0..11
function annualMultiplier(monthlyChurnPct: number) {
  const c = monthlyChurnPct / 100;
  if (c <= 0) return 12;
  const retention = 1 - c;
  return (1 - Math.pow(retention, 12)) / c;
}

function computeRevenue(users: number, price: number, conversionPct: number, churnPct: number) {
  const payingUsers = users * (conversionPct / 100);
  const monthly = payingUsers * price;
  const annual = monthly * annualMultiplier(churnPct);
  return { payingUsers, monthly, annual };
}

// ── Slider row ──────────────────────────────────────────────────────────────────

function SliderRow({
  label, value, min, max, step, suffix, onChange,
}: {
  label: string; value: number; min: number; max: number; step: number; suffix: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-slate-400">{label}</label>
        <span className="text-sm font-mono text-indigo-300">{fmtNum(value)}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500 cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
        <span>{fmtNum(min)}{suffix}</span>
        <span>{fmtNum(max)}{suffix}</span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [segment, setSegment] = useState<typeof segments[number]["key"]>("individual");
  const [users, setUsers] = useState(8000);
  const [price, setPrice] = useState(9);
  const [conversion, setConversion] = useState(5);
  const [churn, setChurn] = useState(7);
  const [activeScenario, setActiveScenario] = useState<ScenarioKey | null>("Expected");

  // Saved scenarios — local React state, in-memory documented output
  const [savedScenarios, setSavedScenarios] = useState<{
    index: number;
    timestamp: string;
    segment: string;
    users: number;
    price: number;
    conversion: number;
    churn: number;
    monthly: number;
    annual: number;
  }[]>([]);

  function applyScenario(key: ScenarioKey) {
    const s = scenarios[key];
    setUsers(s.users);
    setPrice(s.price);
    setConversion(s.conversion);
    setChurn(s.churn);
    setActiveScenario(key);
  }

  // Any manual slider change clears the "active scenario" highlight
  function manualSet<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setActiveScenario(null);
    };
  }

  const current = useMemo(
    () => computeRevenue(users, price, conversion, churn),
    [users, price, conversion, churn]
  );

  const scenarioResults = useMemo(
    () =>
      (Object.keys(scenarios) as ScenarioKey[]).map((key) => {
        const s = scenarios[key];
        return { key, ...s, ...computeRevenue(s.users, s.price, s.conversion, s.churn) };
      }),
    []
  );

  const maxAnnual = Math.max(...scenarioResults.map((r) => r.annual), current.annual);

  function handleSaveScenario() {
    setSavedScenarios((prev) => [
      ...prev,
      {
        index: prev.length + 1,
        timestamp: new Date().toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "short",
        }),
        segment,
        users,
        price,
        conversion,
        churn,
        monthly: current.monthly,
        annual: current.annual,
      },
    ]);
  }

  return (
    <div className="min-h-screen text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-6" style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Pricing &amp; Revenue Simulator
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 3 — Interactive modeling of monthly &amp; annual revenue across pricing scenarios
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">

        {/* ── Scenario toggle ── */}
        <SectionCard title="Scenario Presets">
          <p className="text-sm text-slate-400">
            Click a scenario to instantly load baseline assumptions into the sliders below, or
            adjust manually for a custom projection.
          </p>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(scenarios) as ScenarioKey[]).map((key) => {
              const s = scenarios[key];
              const isActive = activeScenario === key;
              return (
                <button
                  key={key}
                  onClick={() => applyScenario(key)}
                  className={`flex-1 min-w-[160px] rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? `${s.color} bg-slate-900 ring-1 ring-inset ring-current`
                      : "border-slate-600 bg-slate-900 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <div className="font-semibold">{key}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {fmtNum(s.users)} users · {fmtUSD(s.price)}/mo · {s.conversion}% conv · {s.churn}% churn
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Inputs + Live calc ── */}
        <div className="grid gap-6 lg:grid-cols-2">

          {/* Inputs */}
          <SectionCard title="Interactive Inputs">
            <div>
              <span className="text-xs text-slate-400 block mb-2">Customer Segment</span>
              <div className="flex gap-2">
                {segments.map((seg) => (
                  <button
                    key={seg.key}
                    onClick={() => setSegment(seg.key)}
                    className={`flex-1 rounded-lg border px-3 py-2 text-left text-xs transition ${
                      segment === seg.key
                        ? "border-indigo-500 bg-indigo-950/50 text-white"
                        : "border-slate-600 bg-slate-900 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    <div className="font-medium">{seg.label}</div>
                    <div className="text-slate-500 mt-0.5">{seg.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            <SliderRow
              label="Number of Users (signups)"
              value={users} min={100} max={50000} step={100} suffix=""
              onChange={manualSet(setUsers)}
            />
            <SliderRow
              label="Monthly Price per Paying User"
              value={price} min={0} max={100} step={1} suffix=" USD"
              onChange={manualSet(setPrice)}
            />
            <SliderRow
              label="Conversion Rate (signup → paying)"
              value={conversion} min={0} max={20} step={0.5} suffix="%"
              onChange={manualSet(setConversion)}
            />
            <SliderRow
              label="Monthly Churn Rate"
              value={churn} min={0} max={30} step={0.5} suffix="%"
              onChange={manualSet(setChurn)}
            />
          </SectionCard>

          {/* Live calculations */}
          <SectionCard title="Live Calculations">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-600 bg-slate-900 p-4">
                <span className="text-xs text-slate-400 block mb-1">Paying Users</span>
                <span className="text-xl font-bold text-white">{fmtNum(current.payingUsers)}</span>
              </div>
              <div className="rounded-xl border border-slate-600 bg-slate-900 p-4">
                <span className="text-xs text-slate-400 block mb-1">Avg. Annual Multiplier</span>
                <span className="text-xl font-bold text-white">
                  {annualMultiplier(churn).toFixed(1)}×
                </span>
              </div>
              <div className="rounded-xl border border-emerald-700 bg-emerald-950/30 p-4 col-span-2">
                <span className="text-xs text-emerald-400 block mb-1">Monthly Revenue</span>
                <span className="text-3xl font-bold text-emerald-300">{fmtUSD(current.monthly)}</span>
              </div>
              <div className="rounded-xl border border-indigo-700 bg-indigo-950/30 p-4 col-span-2">
                <span className="text-xs text-indigo-400 block mb-1">
                  Projected Annual Revenue (churn-adjusted, no new acquisition)
                </span>
                <span className="text-3xl font-bold text-indigo-300">{fmtUSD(current.annual)}</span>
              </div>
            </div>

            {/* Save Scenario — captures current sliders + computed revenue into local state */}
            <button
              type="button"
              onClick={handleSaveScenario}
              className="w-full rounded-xl border border-violet-600 bg-violet-600/20 px-4 py-3 text-sm font-semibold text-violet-200 transition-colors hover:bg-violet-600/30 hover:text-white"
            >
              💾 Save Scenario — capture current inputs &amp; revenue snapshot
            </button>

            {/* Scenario comparison bars */}
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wide block mb-2">
                Scenario Comparison — Annual Revenue
              </span>
              <div className="space-y-2.5">
                {scenarioResults.map((r) => (
                  <div key={r.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-medium ${
                        r.key === "Conservative" ? "text-red-300" :
                        r.key === "Expected" ? "text-indigo-300" : "text-emerald-300"
                      }`}>
                        {r.key}
                      </span>
                      <span className="font-mono text-slate-400">{fmtUSD(r.annual)}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          r.key === "Conservative" ? "bg-red-500" :
                          r.key === "Expected" ? "bg-indigo-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${(r.annual / maxAnnual) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                {/* Current custom projection, shown alongside */}
                <div className="pt-1 border-t border-slate-700">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-white">Your Current Inputs</span>
                    <span className="font-mono text-slate-400">{fmtUSD(current.annual)}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-white/70"
                      style={{ width: `${(current.annual / maxAnnual) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* ── Saved Scenarios / Documented Output ── */}
        <SectionCard title="Saved Scenarios / Documented Output">
          {savedScenarios.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
              No scenarios saved yet. Adjust the sliders above and click{" "}
              <span className="font-semibold text-violet-300">“💾 Save Scenario”</span> to capture
              a snapshot here for side-by-side comparison.
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 uppercase tracking-wide block">
                {savedScenarios.length} saved {savedScenarios.length === 1 ? "scenario" : "scenarios"}
              </span>
              <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase tracking-wide text-xs">
                    <tr>
                      <th className="px-4 py-3">Scenario</th>
                      <th className="px-4 py-3">Saved At</th>
                      <th className="px-4 py-3">Segment</th>
                      <th className="px-4 py-3 text-right">Users</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Conversion</th>
                      <th className="px-4 py-3 text-right">Churn</th>
                      <th className="px-4 py-3 text-right">Monthly Rev.</th>
                      <th className="px-4 py-3 text-right">Annual Rev.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedScenarios.map((s) => (
                      <tr key={s.index} className="border-t border-slate-800">
                        <td className="px-4 py-3 font-semibold text-violet-300">
                          Scenario #{s.index}
                        </td>
                        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{s.timestamp}</td>
                        <td className="px-4 py-3 text-slate-300">
                          {segments.find((seg) => seg.key === s.segment)?.label ?? s.segment}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300 font-mono">{fmtNum(s.users)}</td>
                        <td className="px-4 py-3 text-right text-slate-300 font-mono">${s.price}</td>
                        <td className="px-4 py-3 text-right text-slate-300 font-mono">{s.conversion}%</td>
                        <td className="px-4 py-3 text-right text-slate-300 font-mono">{s.churn}%</td>
                        <td className="px-4 py-3 text-right text-emerald-300 font-mono">{fmtUSD(s.monthly)}</td>
                        <td className="px-4 py-3 text-right text-indigo-300 font-mono">{fmtUSD(s.annual)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card view for quick visual comparison on smaller screens */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {savedScenarios.map((s) => (
                  <div key={s.index} className="rounded-xl border border-slate-700 bg-slate-900 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-violet-300">Scenario #{s.index}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{s.timestamp}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {segments.find((seg) => seg.key === s.segment)?.label ?? s.segment} ·{" "}
                      {fmtNum(s.users)} users · ${s.price}/mo · {s.conversion}% conv · {s.churn}% churn
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                      <div>
                        <span className="text-[11px] text-emerald-400 block">Monthly</span>
                        <span className="text-sm font-bold text-emerald-300">{fmtUSD(s.monthly)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] text-indigo-400 block">Annual</span>
                        <span className="text-sm font-bold text-indigo-300">{fmtUSD(s.annual)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Assumptions & Recommendation ── */}
        <SectionCard title="Mathematical Assumptions, Risks &amp; Recommendation">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wide block mb-2">
              Modeling Risks
            </span>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-900 text-slate-400 uppercase tracking-wide text-xs">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Assumption</th>
                    <th className="px-4 py-3">Risk if Wrong</th>
                    <th className="px-4 py-3 text-center">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {assumptionRisks.map((row, i) => (
                    <tr
                      key={row.id}
                      className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-800" : "bg-slate-800/50"}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-indigo-400 align-top whitespace-nowrap">{row.id}</td>
                      <td className="px-4 py-3 text-slate-300 align-top">{row.assumption}</td>
                      <td className="px-4 py-3 text-slate-400 align-top">{row.risk}</td>
                      <td className="px-4 py-3 text-center align-top">
                        <Badge value={row.severity} color={severityColor(row.severity)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-700 bg-emerald-950/20 p-5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
              📌 Final Recommendation
            </span>
            <p className="text-sm text-slate-200 leading-relaxed">
              We recommend launching with a <strong className="text-white">freemium "Basic" tier at $0</strong>{" "}
              to maximize WhatsApp-driven viral signup among individual users (where price sensitivity is
              highest and trust must be earned first), paired with a{" "}
              <strong className="text-white">"Pro" tier priced near $9/month</strong> targeted at NGOs and
              community organizers. This mirrors our <em>Expected</em> scenario (8,000 users · 5% conversion ·
              7% churn), which projects roughly{" "}
              <strong className="text-indigo-300">{fmtUSD(computeRevenue(8000, 9, 5, 7).monthly)}/mo</strong> and{" "}
              <strong className="text-indigo-300">{fmtUSD(computeRevenue(8000, 9, 5, 7).annual)}/yr</strong> —
              a sustainable middle ground between the Conservative downside and Aggressive upside. Enterprise
              pricing should remain custom-quoted until we have 3–5 reference NGO/municipal accounts to anchor
              our value-based pricing conversation.
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strongest lever to de-risk the model: reducing churn (R-02) compounds non-linearly into annual
              revenue via the cohort multiplier — a drop from 7% to 4% churn raises the annual multiplier from{" "}
              {annualMultiplier(7).toFixed(1)}× to {annualMultiplier(4).toFixed(1)}×, worth prioritizing over
              incremental price increases.
            </p>
          </div>
        </SectionCard>

      </div>
    </div>
  );
}
