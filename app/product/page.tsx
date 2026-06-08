import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Architecture — Week 0 Builder Setup",
  description: "Customer segments, package tiers, and risk mitigation for the CivicAir product.",
};

// ── Reusable primitives (mirrors /research aesthetic) ──────────────────────────

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

// ── Data ────────────────────────────────────────────────────────────────────────

const segments = [
  {
    label: "Individual / Starter",
    icon: "🧍",
    color: "border-l-indigo-500",
    description:
      "Community members, parents, and local advocates who want plain-language environmental data for their own neighborhood.",
    traits: [
      "Mobile-first (Android), low data plans",
      "Needs es-MX, low-reading-level narratives",
      "Shares findings via WhatsApp, not email",
      "Price-sensitive — free or near-free tier required",
    ],
    needs: ["Daily air quality summary", "Health-impact context", "One-tap sharing"],
  },
  {
    label: "Business / Enterprise",
    icon: "🏢",
    color: "border-l-violet-500",
    description:
      "NGOs, municipal regulators, journalists, and research institutions that need aggregated data, exports, and audit-ready evidence.",
    traits: [
      "Desktop + mobile workflows",
      "Needs CSV / PDF exports and API access",
      "Requires provenance & chain-of-custody logging",
      "Budget for paid seats and SLAs",
    ],
    needs: ["Evidence packet generation", "Multi-region dashboards", "Team accounts & roles"],
  },
];

const tiers = [
  {
    name: "Basic",
    price: "Free",
    tagline: "For individuals exploring local air quality",
    highlight: false,
    features: {
      "Plain-language daily summaries": true,
      "es-MX localized narratives": true,
      "WhatsApp-ready share links": true,
      "Saved simulation history (local)": true,
      "Evidence packet generation": false,
      "CSV / PDF data export": false,
      "Multi-region dashboards": false,
      "API access": false,
      "Team seats & roles": false,
      "Priority support / SLA": false,
    },
  },
  {
    name: "Pro",
    price: "$9 / mo",
    tagline: "For organizers and small NGOs running campaigns",
    highlight: true,
    features: {
      "Plain-language daily summaries": true,
      "es-MX localized narratives": true,
      "WhatsApp-ready share links": true,
      "Saved simulation history (local)": true,
      "Evidence packet generation": true,
      "CSV / PDF data export": true,
      "Multi-region dashboards": "Up to 3",
      "API access": false,
      "Team seats & roles": "Up to 5 seats",
      "Priority support / SLA": false,
    },
  },
  {
    name: "Custom / Enterprise",
    price: "Contact us",
    tagline: "For municipalities, agencies, and research institutions",
    highlight: false,
    features: {
      "Plain-language daily summaries": true,
      "es-MX localized narratives": true,
      "WhatsApp-ready share links": true,
      "Saved simulation history (local)": true,
      "Evidence packet generation": true,
      "CSV / PDF data export": true,
      "Multi-region dashboards": "Unlimited",
      "API access": true,
      "Team seats & roles": "Unlimited + SSO",
      "Priority support / SLA": true,
    },
  },
];

const featureRows = [
  "Plain-language daily summaries",
  "es-MX localized narratives",
  "WhatsApp-ready share links",
  "Saved simulation history (local)",
  "Evidence packet generation",
  "CSV / PDF data export",
  "Multi-region dashboards",
  "API access",
  "Team seats & roles",
  "Priority support / SLA",
] as const;

const risks = [
  {
    risk_id: "BR-01",
    category: "Data Misinterpretation",
    description:
      "Users may treat AI-generated narratives as definitive medical or legal advice rather than directional guidance, leading to poor health decisions or baseless complaints.",
    likelihood: "Medium",
    impact: "High",
    mitigation:
      "Attach explicit 'directional guidance, not medical advice' disclaimers to every narrative block; cite raw source data alongside every generated summary; route health-specific questions to verified public health resources.",
  },
  {
    risk_id: "BR-02",
    category: "Bad-Faith Use of Evidence Packets",
    description:
      "Evidence packets could be selectively edited, misattributed, or weaponized to make unsubstantiated claims against businesses or individuals, exposing the platform to liability.",
    likelihood: "Medium",
    impact: "High",
    mitigation:
      "Embed cryptographic provenance hashes and timestamps in every exported packet; watermark exports with generation metadata; maintain an audit trail of packet creation and downloads; publish a misuse reporting channel.",
  },
  {
    risk_id: "BR-03",
    category: "Perverse Incentive to Inflate Alarm",
    description:
      "If engagement or upgrade conversion is tied to 'severity' framing, the product could be incentivized to systematically overstate risk to drive usage — eroding trust and causing alarm fatigue.",
    likelihood: "Low",
    impact: "High",
    mitigation:
      "Decouple monetization from alert frequency or severity scores; calibrate narrative tone against independently verified regulatory thresholds (IMECA/EPA); commission periodic third-party audits of generated content for tone drift.",
  },
  {
    risk_id: "BR-04",
    category: "Operational Dependency on Public Feeds",
    description:
      "The product's core value depends on third-party data sources (SINAICA, SEDEMA, OpenAQ) that may go offline, change formats, or restrict access without notice.",
    likelihood: "High",
    impact: "Medium",
    mitigation:
      "Maintain redundant data-source integrations with automatic failover; cache last-known-good readings with visible staleness indicators; formalize data-sharing agreements with regulatory bodies where possible.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  return (
    <div className="min-h-screen text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-6" style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">Product Architecture</h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 3 — Customer segments, package tiers, and business risk mitigation
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">

        {/* ── Customer Segments ── */}
        <SectionCard title="Customer Segments">
          <div className="grid gap-4 sm:grid-cols-2">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className={`rounded-xl border-l-4 ${seg.color} border border-slate-600 bg-slate-900 p-5 space-y-3`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{seg.icon}</span>
                  <h3 className="font-semibold text-white">{seg.label}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{seg.description}</p>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1.5">
                    Key Traits
                  </span>
                  <ul className="space-y-1.5">
                    {seg.traits.map((t, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1.5">
                    Core Needs
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {seg.needs.map((n) => (
                      <Badge key={n} value={n} color="blue" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── Feature Comparison Table ── */}
        <SectionCard title="Package Comparison">
          <div className="grid gap-4 sm:grid-cols-3 mb-2">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-4 space-y-1 ${
                  tier.highlight
                    ? "border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500/40"
                    : "border-slate-600 bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{tier.name}</h3>
                  {tier.highlight && <Badge value="Most Popular" color="green" />}
                </div>
                <p className="text-xl font-bold text-indigo-300">{tier.price}</p>
                <p className="text-xs text-slate-400">{tier.tagline}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wide text-xs">
                <tr>
                  <th className="px-4 py-3">Feature</th>
                  {tiers.map((t) => (
                    <th key={t.name} className="px-4 py-3 text-center whitespace-nowrap">
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((feature, i) => (
                  <tr
                    key={feature}
                    className={`border-t border-slate-700 ${i % 2 === 0 ? "bg-slate-800" : "bg-slate-800/50"}`}
                  >
                    <td className="px-4 py-3 text-slate-300">{feature}</td>
                    {tiers.map((tier) => {
                      const val = tier.features[feature];
                      return (
                        <td key={tier.name} className="px-4 py-3 text-center">
                          {val === true ? (
                            <span className="text-emerald-400">✓</span>
                          ) : val === false ? (
                            <span className="text-slate-600">—</span>
                          ) : (
                            <span className="text-xs text-indigo-300">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ── Business Risks & Misuse Mitigation ── */}
        <SectionCard title="Business Risks &amp; Misuse Mitigation">
          <p className="text-sm text-slate-400 leading-relaxed">
            Honest accounting of where this product could create bad incentives, be misused, or
            depend on fragile external systems — paired with concrete mitigations for each.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {risks.map((risk) => (
              <div
                key={risk.risk_id}
                className="rounded-xl border border-slate-600 bg-slate-900 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-indigo-400">{risk.risk_id}</span>
                  <span className="text-xs font-medium text-slate-300">{risk.category}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{risk.description}</p>
                <div className="flex flex-wrap gap-4">
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

      </div>
    </div>
  );
}
