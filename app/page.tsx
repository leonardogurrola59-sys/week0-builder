import Link from "next/link";

const FEATURES = [
  {
    icon: "📍",
    title: "Hyper-Local Iztapalapa Tracking",
    description:
      "Real-time PM2.5 and IMECA readings mapped block-by-block across Iztapalapa, sourced directly from SINAICA and SEDEMA monitoring stations.",
  },
  {
    icon: "📋",
    title: "Structured Legal Data Citations",
    description:
      "Every report auto-cites its data source, station ID, and timestamp — the exact formatting SEMARNAT requires to process community complaints.",
  },
  {
    icon: "💬",
    title: "Community WhatsApp Broadcast Tools",
    description:
      "Push plain-language air quality alerts and compliance updates directly into neighborhood WhatsApp groups — no app download required.",
  },
];

const STATS = [
  { value: "187", label: "Members in the pilot Iztapalapa WhatsApp network" },
  { value: "14-Day", label: "Launch calendar generated for every campaign" },
  { value: "10+", label: "Social assets produced per campaign run" },
  { value: "1-Click", label: "From raw sensor data to compliance packet" },
];

const TIMELINE = [
  {
    week: "Week 0",
    title: "Foundations",
    description: "Development environment, design system, and the first mock air-quality dashboard shell.",
  },
  {
    week: "Week 1",
    title: "Core Dashboard",
    description: "Interactive PM2.5 / IMECA simulation engine with saved scenario history for every station.",
  },
  {
    week: "Week 2",
    title: "Research & Validation",
    description: "Competitor benchmarking, Mexico-market localization, and a full project risk map.",
  },
  {
    week: "Week 3",
    title: "Product & Pricing",
    description: "Product architecture docs plus a live revenue and pricing simulator with saved scenarios.",
  },
  {
    week: "Week 4",
    title: "Marketing Engine",
    description: "A full campaign generator — brand system, social posts, video scripts, and a 14-day launch calendar.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* ── Hero ── */}
      <div className="border-b border-slate-700 px-6 py-24 text-center" style={{ backgroundColor: "#0f172a" }}>
        <span className="inline-block rounded-full border border-emerald-700 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300">
          🌬️ AireLimpio CDMX — Iztapalapa Pilot
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Democratizing Air Quality Evidence for Mexico City Communities
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
          We turn raw sensor data and community photos into formal, SEMARNAT-compliant evidence
          packets — giving neighborhood leaders the documentation they need to finally be heard.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/core"
            className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:w-auto"
          >
            🚀 Launch Dashboard
          </Link>
          <Link
            href="/marketing"
            className="w-full rounded-lg border border-indigo-500 bg-indigo-600/10 px-6 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-600/20 hover:text-white sm:w-auto"
          >
            📣 Explore Marketing Engine
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-16 px-6 py-16">
        {/* ── Features / Value Grid ── */}
        <section>
          <h2 className="text-center text-2xl font-bold tracking-tight text-white">
            Built for Frontline Community Leaders
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-400">
            Every feature is designed around one person: a community leader with a phone, a
            WhatsApp group, and evidence that deserves to be taken seriously.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-3">
                <div className="text-3xl">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Social Proof / Stats ── */}
        <section className="rounded-2xl border border-slate-700 bg-slate-800 p-8">
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Designed Around the Iztapalapa Pilot
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-emerald-300 sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs leading-snug text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works — Week 0 to Week 4 ── */}
        <section>
          <h2 className="text-center text-2xl font-bold tracking-tight text-white">
            From Week 0 to a Full Growth Engine
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-400">
            Built incrementally, one milestone at a time — from a blank repo to a complete
            product, pricing, and marketing platform.
          </p>
          <div className="mt-8 space-y-4">
            {TIMELINE.map((t, i) => (
              <div key={t.week} className="flex gap-4 rounded-2xl border border-slate-700 bg-slate-800 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {i}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-400">{t.week}</span>
                    <span className="text-sm font-bold text-white">{t.title}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Closing CTA ── */}
        <section className="rounded-2xl border border-emerald-700 bg-emerald-950/20 p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Ready to see it in action?</h2>
          <p className="mx-auto max-w-xl text-sm text-slate-400">
            Jump into the live air-quality dashboard, or generate a full marketing campaign for
            AireLimpio CDMX in under a minute.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/core"
              className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 sm:w-auto"
            >
              🚀 Launch Dashboard
            </Link>
            <Link
              href="/marketing"
              className="w-full rounded-lg border border-indigo-500 bg-indigo-600/10 px-6 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-600/20 hover:text-white sm:w-auto"
            >
              📣 Explore Marketing Engine
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
