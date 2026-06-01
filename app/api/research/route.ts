import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();

  const ventureIdea: string  = body.ventureIdea  || "Community data transparency platform";
  const targetUser: string   = body.targetUser   || "Residents in underserved urban communities";
  const problem: string      = body.problem      || "Lack of accessible, plain-language environmental data";
  const context: string      = body.context      || "Latin America / Mexico urban environment";
  const assumptions: string  = body.assumptions  || "Users have smartphones; public data feeds exist";

  // Simulate AI inference latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const slug = (s: string) =>
    s.replace(/\s+/g, "_").toLowerCase().substring(0, 20);

  const pmBase = Math.min(10 + (problem.length % 90), 160);
  const ideaTag = ventureIdea.substring(0, 20);

  const payload = {
    id: crypto.randomUUID(),
    generated_at: new Date().toISOString(),
    venture_idea: ventureIdea,

    // ── Validated problem statement ────────────────────────────────────────
    validated_problem: {
      original: problem,
      refined: `Verified civic need: "${problem}" — confirmed present in ${context}.`,
      severity_score: parseFloat((0.55 + (problem.length % 5) * 0.08).toFixed(2)),
      is_validated: true,
    },

    // ── Target user profile (3 bullets) ───────────────────────────────────
    target_user_profile: [
      `Primary: ${targetUser} — seeks clear, actionable environmental alerts.`,
      `Secondary: Local NGOs and community organizers requiring shareable evidence packets.`,
      `Tertiary: Municipal regulators who need consolidated public-data dashboards.`,
    ],

    // ── Global benchmarks (5 items, real URLs) ─────────────────────────────
    global_benchmarks: [
      {
        rank: 1,
        name: "PurpleAir",
        region: "USA / Global",
        description: "Crowdsourced real-time PM2.5 sensor network with public map.",
        url: "https://www.purpleair.com/map",
        relevance: "Direct benchmark — community-owned air quality data at hyper-local scale.",
      },
      {
        rank: 2,
        name: "IQAir AirVisual",
        region: "Global",
        description: "Aggregated regulatory + satellite AQI data, consumer and API tiers.",
        url: "https://www.iqair.com/world-air-quality",
        relevance: "Gold standard for AQI presentation; useful UX reference for data cards.",
      },
      {
        rank: 3,
        name: "OpenAQ",
        region: "Global (open data)",
        description: "Open-source aggregator of government air quality data APIs worldwide.",
        url: "https://openaq.org",
        relevance: "Primary data-source candidate — free, standardized, covers Mexico SINAICA feeds.",
      },
      {
        rank: 4,
        name: "Plume Labs Flow",
        region: "Europe / USA",
        description: "Wearable personal air-quality monitor paired with citizen-science app.",
        url: "https://plumelabs.com/en/flow/",
        relevance: "Evidence-packet model — personal exposure tracking with export functionality.",
      },
      {
        rank: 5,
        name: "SEDEMA CDMX Air Quality",
        region: "Mexico City",
        description: "Official Mexico City environmental monitoring network (RAMA/REDMET).",
        url: "https://www.aire.cdmx.gob.mx",
        relevance: "Closest local institutional benchmark; open station data via SINAICA.",
      },
    ],

    // ── Mexico local context ───────────────────────────────────────────────
    mexico_local_notes: {
      regulatory_body: "SEMARNAT / SINAICA (Sistema Nacional de Información de la Calidad del Aire)",
      data_portal: "https://sinaica.inecc.gob.mx",
      primary_language: "Spanish (es-MX)",
      localization_notes: [
        "AQI scale in Mexico follows IMECA (Índice Metropolitano de la Calidad del Aire) — not US EPA AQI; convert or display both.",
        "WhatsApp is the dominant community communication channel — share links and alerts via WhatsApp-friendly formats.",
        "CDMX has 34 RAMA monitoring stations; Monterrey and Guadalajara have secondary networks via SINAICA.",
        `Translate all user-facing copy to es-MX; avoid Castilian Spanish (vosotros, etc.) for ${context}.`,
      ],
      key_open_feeds: [
        { name: "SINAICA API", url: "https://sinaica.inecc.gob.mx/pags/datosHorarios.php" },
        { name: "SEDEMA historical data", url: "https://www.aire.cdmx.gob.mx/default.php?opc=%27aKBi%27" },
      ],
    },

    // ── Competitor matrix (8 records) ─────────────────────────────────────
    competitor_matrix: [
      {
        id: 1,
        name: "PurpleAir",
        type: "Hardware + SaaS",
        open_data: true,
        mobile_app: true,
        spanish_ui: false,
        evidence_packets: false,
        mexico_coverage: "Sparse (user-deployed sensors only)",
        pricing: "Sensor ~$250 USD; data free",
        gap: "No es-MX UI; no narrative generation; hardware dependency.",
      },
      {
        id: 2,
        name: "IQAir AirVisual",
        type: "SaaS / Mobile",
        open_data: false,
        mobile_app: true,
        spanish_ui: true,
        evidence_packets: false,
        mexico_coverage: "Major cities only",
        pricing: "Free tier; Pro ~$7/mo",
        gap: "No community evidence export; no plain-language narrative layer.",
      },
      {
        id: 3,
        name: "OpenAQ Platform",
        type: "Open-source API",
        open_data: true,
        mobile_app: false,
        spanish_ui: false,
        evidence_packets: false,
        mexico_coverage: "SINAICA stations included",
        pricing: "Free / open source",
        gap: "Developer-only; no consumer UI; no narrative layer.",
      },
      {
        id: 4,
        name: "SEDEMA App CDMX",
        type: "Government App",
        open_data: true,
        mobile_app: true,
        spanish_ui: true,
        evidence_packets: false,
        mexico_coverage: "Mexico City only",
        pricing: "Free",
        gap: "CDMX-only; no evidence packets; no community advocacy tooling.",
      },
      {
        id: 5,
        name: "Plume Labs Flow",
        type: "Hardware + App",
        open_data: false,
        mobile_app: true,
        spanish_ui: false,
        evidence_packets: true,
        mexico_coverage: "None",
        pricing: "Device ~$200 USD",
        gap: "No Latin America market; hardware cost prohibitive; English-only.",
      },
      {
        id: 6,
        name: "BreezoMeter",
        type: "B2B API",
        open_data: false,
        mobile_app: false,
        spanish_ui: false,
        mexico_coverage: "API-available",
        evidence_packets: false,
        pricing: "Enterprise licensing",
        gap: "B2B only; no community-facing tooling; no advocacy layer.",
      },
      {
        id: 7,
        name: "Clarity Movement",
        type: "Hardware + Dashboard",
        open_data: false,
        mobile_app: false,
        spanish_ui: false,
        mexico_coverage: "Limited pilot deployments",
        evidence_packets: false,
        pricing: "Sensor lease model",
        gap: "Enterprise/NGO focus; not consumer-accessible; no narrative generation.",
      },
      {
        id: 8,
        name: `${ideaTag} (This Project)`,
        type: "Web App / API",
        open_data: true,
        mobile_app: false,
        spanish_ui: true,
        evidence_packets: true,
        mexico_coverage: "SINAICA + SEDEMA integration planned",
        pricing: "Free (Week 0 build)",
        gap: "Differentiator: plain-language narrative + evidence packets + es-MX first.",
      },
    ],

    // ── Risk map (3 items) ─────────────────────────────────────────────────
    project_risk_map: [
      {
        risk_id: "R-01",
        category: "Data Availability",
        description: "SINAICA and SEDEMA APIs have inconsistent uptime and undocumented rate limits.",
        likelihood: "High",
        impact: "High",
        mitigation: "Cache last-known-good readings with TTL; fall back to OpenAQ for continuity; display data-staleness warnings to users.",
      },
      {
        risk_id: "R-02",
        category: "User Trust & Literacy",
        description: `Target audience (${targetUser}) may distrust algorithmically generated summaries without citing primary sources.`,
        likelihood: "Medium",
        impact: "High",
        mitigation: "Attach provenance citations to every narrative block; include one-tap access to raw station data; co-design copy with community partners.",
      },
      {
        risk_id: "R-03",
        category: "Scope Creep",
        description: "Evidence-packet feature (PDF generation, photo uploads, chain-of-custody logging) expands rapidly beyond Week 0 scope.",
        likelihood: "High",
        impact: "Medium",
        mitigation: `Freeze Week 0 scope to mock API + dashboard shell. Gate evidence-packet work behind a Week 2 milestone flag keyed to assumption: "${assumptions.substring(0, 60)}".`,
      },
    ],

    // ── Next-step feature recommendations ─────────────────────────────────
    next_steps: {
      immediate: [
        `Connect /core page to live SINAICA feed for ${context} — replace mock PM2.5 with real station data.`,
        "Add es-MX locale toggle to Navbar; route all user-facing strings through a translations object.",
        "Build /evidence route: accept photo uploads + location pin → generate shareable PDF evidence packet.",
      ],
      week_1_features: [
        "Supabase auth (magic link, no-password) — store saved simulations server-side in saved_cores table.",
        "Real-time AQI chart component (Recharts) fed by /api/research polling interval.",
        `Onboarding flow targeting "${targetUser}" — 3-screen explainer before first Generate call.`,
      ],
      week_2_scaling: [
        "Replace mock findings array with LLM-generated narrative via Anthropic Claude API (streaming).",
        "Scheduled cron job: pull SINAICA data every 15 min → upsert into Supabase → push alerts via WhatsApp Business API.",
        `Open API key system so NGO partners can POST to /api/research with their own ${slug(ventureIdea)} context.`,
      ],
    },

    // ── Input echo for client-side deduplication ───────────────────────────
    request_echo: {
      venture_idea: ventureIdea,
      target_user: targetUser,
      problem,
      context,
      assumptions,
    },
  };

  return NextResponse.json(payload);
}
