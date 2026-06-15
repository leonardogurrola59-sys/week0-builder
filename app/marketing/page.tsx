"use client";

import { useEffect, useMemo, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

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

interface SocialPost {
  channel: string;
  index: number;
  text: string;
}

interface VideoScript {
  title: string;
  hook: string;
  problem: string;
  cta: string;
}

interface CalendarDay {
  day: number;
  activity: string;
  channel: string;
  objective: string;
}

interface ABVariant {
  label: string;
  headline: string;
  cta: string;
  baseRate: number;
}

interface GeneratedAssets {
  brandSystem: {
    name: string;
    tagline: string;
    valuePromise: string;
    toneRules: string[];
  };
  persona: {
    name: string;
    role: string;
    goals: string[];
    frustrations: string[];
    techHabits: string[];
    motivations: string[];
  };
  landing: {
    heroTitle: string;
    heroSubheadline: string;
    benefits: string[];
    faq: { q: string; a: string }[];
  };
  socialPosts: SocialPost[];
  videoScripts: VideoScript[];
  calendar: CalendarDay[];
  visualPrompts: string[];
  abTest: {
    versionA: ABVariant;
    versionB: ABVariant;
  };
}

interface SavedMarketingSpec {
  id: string;
  saved_at: string;
  label: string;
  formState: MarketingFormState;
  generatedAssets?: GeneratedAssets;
}

const DEFAULT_FORM_STATE: MarketingFormState = {
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
};

const HISTORY_KEY = "saved_marketing_history";

// ── Small reusable primitives ─────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function CopyButton({ text, label = "📋 Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        copied
          ? "border-emerald-600 bg-emerald-600/20 text-emerald-300"
          : "border-slate-600 bg-slate-900 text-slate-300 hover:border-indigo-500 hover:text-white"
      }`}
    >
      {copied ? "✅ Copied!" : label}
    </button>
  );
}

function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
          >
            <span className="text-sm font-medium text-white">{item.q}</span>
            <span className="text-lg leading-none text-slate-400">{openIndex === i ? "−" : "+"}</span>
          </button>
          {openIndex === i && (
            <div className="border-t border-slate-800 px-4 py-3 text-sm leading-relaxed text-slate-400">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function channelColor(channel: string): string {
  if (channel.includes("X") || channel.includes("Twitter")) return "border-sky-700 bg-sky-950/40 text-sky-300";
  if (channel.includes("LinkedIn")) return "border-blue-700 bg-blue-950/40 text-blue-300";
  if (channel.includes("Facebook")) return "border-indigo-700 bg-indigo-950/40 text-indigo-300";
  return "border-slate-600 bg-slate-900 text-slate-300";
}

// ── Form field configuration ──────────────────────────────────────────────────

const FORM_FIELDS: {
  key: keyof MarketingFormState;
  label: string;
  type: "input" | "textarea";
}[] = [
  { key: "productName", label: "Product Name", type: "input" },
  { key: "targetUser", label: "Target User", type: "textarea" },
  { key: "problemSolved", label: "Problem Solved", type: "textarea" },
  { key: "valueProposition", label: "Value Proposition", type: "textarea" },
  { key: "toneOfVoice", label: "Tone of Voice", type: "input" },
  { key: "callToAction", label: "Call to Action", type: "input" },
  { key: "marketingChannel", label: "Marketing Channel", type: "input" },
  { key: "campaignObjective", label: "Campaign Objective", type: "textarea" },
];

// ── Generated asset builder ───────────────────────────────────────────────────
// Pure function: takes the campaign engine inputs and produces a full,
// hyper-realistic asset pack for the AireLimpio CDMX campaign.

function buildGeneratedAssets(form: MarketingFormState): GeneratedAssets {
  const { productName, callToAction, valueProposition } = form;

  return {
    brandSystem: {
      name: productName,
      tagline: "Tu evidencia. Tu salud. Tu ciudad — documentada y lista para ser escuchada.",
      valuePromise: valueProposition,
      toneRules: [
        "Lead with empathy: acknowledge the community's lived experience before presenting any data.",
        'Translate technical IMECA / PM2.5 figures into plain-language health impacts — the way a trusted doctor explains a diagnosis.',
        "Stay calm and evidence-based — never alarmist. Authority is built through consistency, not urgency.",
        "Always cite the data source (SINAICA station ID, SEDEMA feed, or timestamp) alongside every claim.",
        "Default to Spanish (es-MX), WhatsApp-friendly formatting: short paragraphs, bullet points, zero jargon.",
      ],
    },

    persona: {
      name: "Rosa Elena Martínez",
      role: "Community Leader — Iztapalapa, Sector 8 (CDMX)",
      goals: [
        "Get SEMARNAT/SEDEMA to formally acknowledge pollution levels near the Iztapalapa industrial corridor.",
        "Protect children at the neighborhood primary school from high-PM2.5 days.",
        "Build a credible, organized record her 187-family WhatsApp group can rally behind.",
      ],
      frustrations: [
        "Her last report to SEMARNAT was rejected for 'lacking proper citation format and timestamps.'",
        "She has dozens of phone photos and screenshots but no way to turn them into one coherent document.",
        "She does not have time after her full work day to learn complex software or government portals.",
      ],
      techHabits: [
        "Uses a mid-range Android phone (Samsung Galaxy A-series) as her only computing device.",
        "Lives inside WhatsApp — broadcasts updates to a 'Vecinos Unidos Iztapalapa' group of 187 members.",
        "Distrusts apps that request excessive permissions or personal data upfront.",
      ],
      motivations: [
        "Respect and trust from her neighbors — she is the one people turn to when something feels wrong.",
        "Tangible proof that her community's complaints are finally being taken seriously.",
        "Protecting elders and children, who suffer most on high-pollution days.",
      ],
    },

    landing: {
      heroTitle: "Convierte la evidencia de tu comunidad en un reporte que SEMARNAT no puede ignorar",
      heroSubheadline: `${valueProposition} Diseñado para líderes vecinales — sin software complicado ni conocimientos técnicos.`,
      benefits: [
        "Reportes PDF de cumplimiento con citas automáticas de estaciones SINAICA / SEDEMA",
        "Traducción del IMECA a lenguaje claro — sin necesidad de conocimientos técnicos",
        "Resúmenes listos para WhatsApp que puedes compartir directo con tu comunidad",
        "Funciona en celulares Android básicos y con datos móviles limitados",
        "Empaquetado de evidencia fotográfica con fecha, hora y ubicación — listo para uso legal",
        "Exportación bilingüe (es-MX / inglés) para compartir con prensa y organizaciones aliadas",
      ],
      faq: [
        {
          q: "¿Es segura la información de mi comunidad?",
          a: "Sí. Nunca compartimos datos personales de vecinos sin su consentimiento explícito. Toda la evidencia se almacena de forma privada y tú decides qué se incluye en el reporte final.",
        },
        {
          q: "¿SEMARNAT realmente acepta este tipo de reportes?",
          a: `Los reportes generados por ${productName} siguen el formato y las citas (fuente, estación, fecha y hora) que las dependencias ambientales requieren para procesar quejas formales — la principal causa de rechazo en reportes comunitarios hasta ahora.`,
        },
        {
          q: "¿Tengo que compartir datos personales de mis vecinos?",
          a: "No. Puedes generar reportes usando solo tu información de contacto como representante comunitario, o de forma anónima a nombre del grupo vecinal.",
        },
        {
          q: "¿Qué pasa si no hay una estación SINAICA cerca de mi colonia?",
          a: `${productName} utiliza la estación de monitoreo más cercana disponible y lo indica claramente en el reporte, junto con la distancia aproximada, para mantener la transparencia de los datos.`,
        },
        {
          q: "¿Puedo usar estos reportes como evidencia legal?",
          a: "Los reportes incluyen metadatos (fecha, hora, ubicación y fuente de datos) en un formato pensado para documentación de evidencia. Recomendamos acompañarlos de asesoría legal si se usarán en un proceso formal.",
        },
      ],
    },

    socialPosts: [
      {
        channel: "X / Twitter",
        index: 1,
        text: `🌬️ Tired of pollution reports getting ignored? ${productName} turns your phone photos + air sensor data into a SEMARNAT-ready compliance packet — in one click. Your evidence, finally formatted to be heard. #AireLimpioCDMX #Iztapalapa #CalidadDelAire`,
      },
      {
        channel: "X / Twitter",
        index: 2,
        text: `📊 Did you know? Iztapalapa regularly registers IMECA levels in the "Mala" (Bad) range — but most community reports get rejected for formatting, not facts. ${productName} fixes that. Real data. Real citations. Real impact. #SINAICA #PM2.5`,
      },
      {
        channel: "X / Twitter",
        index: 3,
        text: `"Llevaba 3 meses intentando que SEMARNAT revisara mis reportes. Con ${productName} generé el paquete completo en minutos — y por fin me respondieron." — Rosa Elena, líder vecinal, Iztapalapa. #VecinosUnidos`,
      },
      {
        channel: "X / Twitter",
        index: 4,
        text: `🧵 1/ Your community already has the evidence. You just need the format. Here's how ${productName} converts raw air quality data + photos into a report SEMARNAT can't dismiss → ${callToAction} now. #CDMX #EnvironmentalJustice`,
      },
      {
        channel: "LinkedIn",
        index: 1,
        text: `Community-led environmental monitoring is only as powerful as the documentation behind it. ${productName} helps grassroots leaders across Mexico City — starting with Iztapalapa — transform raw air quality readings and photographic evidence into formally cited compliance packets that meet SEMARNAT/SINAICA standards. We're inviting NGO partners and local press to explore a pilot. #EnvironmentalJustice #CivicTech #MexicoCity`,
      },
      {
        channel: "LinkedIn",
        index: 2,
        text: `Case study: a 187-member WhatsApp community group in Iztapalapa used ${productName} to convert two months of informal pollution complaints into a single, citation-backed evidence packet. Result: their first acknowledged response from a municipal environmental office in over a year. This is what happens when community evidence meets the right format. #DataForGood #AirQuality`,
      },
      {
        channel: "LinkedIn",
        index: 3,
        text: `We're building the bridge between lived community experience and formal environmental compliance — and we're looking for partners. If your organization works on air quality, environmental justice, or civic tech in Latin America, let's talk about how ${productName} can extend your impact. ${callToAction}. #Partnerships #SEMARNAT #OpenData`,
      },
      {
        channel: "Facebook Community Hub",
        index: 1,
        text: `¡Buenas vecinos! 👋 Sabemos que muchos de ustedes han tomado fotos y notado el mal olor y el smog en nuestra colonia. Ahora hay una forma fácil de convertir todo eso en un reporte oficial que SEMARNAT tiene que revisar. Se llama ${productName} y funciona directo desde WhatsApp. Quien quiera que le ayudemos a armar su primer reporte, que me escriba por privado. 💪🌱`,
      },
      {
        channel: "Facebook Community Hub",
        index: 2,
        text: `📅 TALLER GRATUITO — Sábado 10am en el Centro Comunitario: aprende a usar ${productName} para documentar la calidad del aire en tu cuadra y generar tu primer reporte de cumplimiento ambiental. Trae tu celular cargado. ¡Te esperamos, Iztapalapa! 🌬️📲`,
      },
      {
        channel: "Facebook Community Hub",
        index: 3,
        text: `🎉 ¡Buenas noticias! Gracias a los reportes que generamos con ${productName}, la oficina de SEDEMA por fin programó una visita a nuestra zona para medir los niveles de PM2.5. Esto es lo que pasa cuando documentamos bien nuestra evidencia. Sigamos juntos. 🙌 #VecinosUnidosIztapalapa`,
      },
    ],

    videoScripts: [
      {
        title: 'Script 1 — "From Photos to Proof"',
        hook: "[0:00 - Hook] (Close-up of a phone gallery full of smog photos) ¿Cuántas fotos del cielo gris tienes guardadas... y nunca llegaron a ningún lado? 📱💨",
        problem: `[0:15 - Core Problem & Value] SEMARNAT recibe miles de quejas, pero la mayoría se rechaza por falta de formato y citas. ${productName} toma tus fotos, tus fechas y los datos de las estaciones SINAICA cercanas — y los convierte en un paquete de cumplimiento ambiental, listo para presentar. Sin software complicado. Solo tu teléfono.`,
        cta: `[0:45 - Call to Action] Abre WhatsApp, manda tu primera foto a nuestro asistente, y en menos de 5 minutos tendrás tu primer reporte. ${callToAction} hoy mismo. Link en la descripción. 👇`,
      },
      {
        title: 'Script 2 — "The IMECA Translator"',
        hook: "[0:00 - Hook] (Animación de una gráfica de IMECA confusa) ¿Sabes qué significa \"151 IMECA\" para la salud de tus hijos? La mayoría tampoco.",
        problem: `[0:15 - Core Problem & Value] Los datos oficiales de calidad del aire existen — pero están en números que nadie te explica. ${productName} traduce esos números a lenguaje simple: ¿es seguro que mis hijos jueguen afuera hoy? Y guarda esa información con fecha y fuente, lista para usarse como evidencia después.`,
        cta: `[0:45 - Call to Action] No necesitas ser ingeniero ambiental para proteger a tu familia. ${callToAction} y empieza a entender — y documentar — el aire que respiras. Toca el enlace. 🌬️`,
      },
      {
        title: 'Script 3 — "WhatsApp Group Success Story"',
        hook: "[0:00 - Hook] (Grabación de pantalla de un grupo de WhatsApp con 187 miembros) Este grupo de vecinos logró algo que ninguna queja individual pudo.",
        problem: `[0:15 - Core Problem & Value] Durante meses, los vecinos de esta colonia mandaban fotos del smog al grupo — pero nada cambiaba. Cuando empezaron a usar ${productName} para juntar esa evidencia en un solo reporte formal, todo cambió: SEDEMA por fin respondió y programó una visita.`,
        cta: `[0:45 - Call to Action] Tu grupo de vecinos también puede hacerlo. ${callToAction} — es gratis para empezar. Comparte este video con tu comunidad. 🤝`,
      },
    ],

    calendar: [
      { day: 1, activity: "Soft launch announcement to existing network", channel: "WhatsApp Community Groups", objective: "Introduce AireLimpio CDMX to the 187-member Iztapalapa group" },
      { day: 2, activity: "Cross-post launch announcement to neighboring hubs", channel: "Facebook Local Hubs", objective: "Build initial awareness among adjacent colonia groups" },
      { day: 3, activity: "Educational post: \"What is IMECA, really?\"", channel: "X / Twitter", objective: "Establish the trusted-doctor authority voice early" },
      { day: 4, activity: "Tutorial broadcast: \"How to take your first compliance photo\"", channel: "WhatsApp Broadcast List", objective: "Drive first-time feature usage among existing leads" },
      { day: 5, activity: "Partner outreach to NGOs and environmental press", channel: "LinkedIn", objective: "Secure 2-3 amplification partners for week 2" },
      { day: 6, activity: "Distribute bilingual flyers near Iztapalapa metro stations", channel: "Local Flyer Distribution", objective: "Reach offline-first residents and drive WhatsApp signups" },
      { day: 7, activity: "Weekly recap + first testimonial post", channel: "Facebook Community Hub", objective: "Build social proof and sustain mid-week momentum" },
      { day: 8, activity: "Create and promote a free Saturday workshop event", channel: "Facebook Event", objective: "Drive 25+ signups for the in-person workshop" },
      { day: 9, activity: "Educational thread: \"5 things SEMARNAT looks for in a report\"", channel: "X / Twitter", objective: "Increase authority and organic visibility" },
      { day: 10, activity: "Daily live IMECA snapshot for Iztapalapa", channel: "WhatsApp Status", objective: "Form a daily-check habit and demonstrate live utility" },
      { day: 11, activity: "Press outreach to local CDMX outlets", channel: "Email / Press Outreach", objective: "Earn local media coverage ahead of the workshop" },
      { day: 12, activity: "Host in-person workshop at the Community Center", channel: "In-Person Workshop", objective: "Generate 25+ first compliance reports live, on the spot" },
      { day: 13, activity: "Publish workshop recap video and photos", channel: "Facebook + WhatsApp Status", objective: "Extend reach of the in-person event to non-attendees" },
      { day: 14, activity: "Share campaign milestone report with the community", channel: "WhatsApp Broadcast + Facebook Hub", objective: "Celebrate the 50-lead goal and recruit volunteer \"data captains\"" },
    ],

    visualPrompts: [
      "A close-up photo of a Mexican community leader holding a mobile device displaying a clear green air quality graph, background of Iztapalapa rooftops at golden hour, high-detail, realistic lighting, documentary photography style --ar 16:9",
      "Wide-angle shot of a WhatsApp group chat interface overlaid on a hazy Mexico City skyline, smog visible over distant volcanoes, warm color grading, photojournalistic style --ar 16:9",
      "Portrait of a confident middle-aged Mexican woman in a community center, smiling while holding printed environmental report papers, soft natural window light, shallow depth of field --ar 4:5",
      "Infographic-style illustration of an IMECA air quality scale translated into simple emoji faces (happy, neutral, worried, sick) with Spanish labels, flat vector design, green-to-red gradient --ar 1:1",
      "Top-down flat lay of a smartphone showing a generated compliance report PDF, surrounded by handwritten notes, a SINAICA data printout, and a small potted plant, minimalist styling, soft daylight --ar 1:1",
      "Street-level photo of a community flyer taped to a lamppost in Iztapalapa advertising a free air quality workshop, Spanish text visible, slightly worn texture, candid urban photography --ar 9:16",
      "Flat illustration of diverse Mexico City neighbors standing together holding up phones with green checkmarks above their heads, symbolizing verified environmental reports, vibrant but trustworthy color palette --ar 16:9",
      "Realistic photo of a small home air quality sensor on a windowsill overlooking an industrial corridor in Iztapalapa, soft morning haze visible through the glass, cinematic lighting, shallow depth of field --ar 3:2",
    ],

    abTest: {
      versionA: {
        label: "Version A — Data-Driven",
        headline: "Real-Time PM2.5 & IMECA Data for Every Block in Iztapalapa",
        cta: "View Live Air Quality Map",
        baseRate: 3.2,
      },
      versionB: {
        label: "Version B — Community-Driven",
        headline: "Join 500+ Neighbors Already Demanding Clean Air in Iztapalapa",
        cta: callToAction,
        baseRate: 4.8,
      },
    },
  };
}

// ── A/B tester state shape ────────────────────────────────────────────────────

interface ABStat {
  votes: number;
  impressions: number;
  conversions: number;
}

const INITIAL_AB_STATS: Record<"A" | "B", ABStat> = {
  A: { votes: 0, impressions: 1000, conversions: 32 },
  B: { votes: 0, impressions: 1000, conversions: 48 },
};

// ── Main page ──────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  // Controlled form inputs — pre-filled with the AireLimpio CDMX context
  const [form, setForm] = useState<MarketingFormState>(DEFAULT_FORM_STATE);

  // Snapshot of the form used to produce the currently-rendered workspace
  const [generatedForm, setGeneratedForm] = useState<MarketingFormState>(DEFAULT_FORM_STATE);

  // Loading & submission state
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // History (local state, mirrored to localStorage)
  const [history, setHistory] = useState<SavedMarketingSpec[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  // A/B headline & CTA tester
  const [abStats, setAbStats] = useState<Record<"A" | "B", ABStat>>(INITIAL_AB_STATS);

  // ── Load saved engine specs from localStorage on mount ──────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      console.error("Failed to load saved marketing history");
    }
  }, []);

  // ── Generated campaign workspace (derived from the last-generated form) ──
  const assets = useMemo(() => buildGeneratedAssets(generatedForm), [generatedForm]);

  // ── Form field updates ───────────────────────────────────────────────────
  function updateField<K extends keyof MarketingFormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Editing inputs invalidates the previously generated workspace
    setHasGenerated(false);
  }

  // ── Generate campaign assets (simulated AI engine spin-up) ──────────────
  function handleGenerate() {
    setIsGenerating(true);
    setHasGenerated(false);
    const snapshot = form;
    setTimeout(() => {
      setGeneratedForm(snapshot);
      setAbStats(INITIAL_AB_STATS);
      setIsGenerating(false);
      setHasGenerated(true);
    }, 1000);
  }

  // ── Saved engine specs (history) ─────────────────────────────────────────
  function handleSaveSpec() {
    const entry: SavedMarketingSpec = {
      id: crypto.randomUUID(),
      saved_at: new Date().toISOString(),
      label: form.productName || "Untitled Spec",
      formState: form,
      ...(hasGenerated ? { generatedAssets: assets } : {}),
    };
    setHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  }

  function handleLoadTemplate(entry: SavedMarketingSpec) {
    setForm(entry.formState);
    setGeneratedForm(entry.formState);
    setHasGenerated(!!entry.generatedAssets);
    if (entry.generatedAssets) setAbStats(INITIAL_AB_STATS);
  }

  function handleRemoveEntry(id: string) {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }

  function handleClearHistory() {
    if (!confirm("Clear all saved marketing engine specs?")) return;
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }

  // ── A/B tester handlers ──────────────────────────────────────────────────
  function handleVote(variant: "A" | "B") {
    setAbStats((prev) => ({
      ...prev,
      [variant]: { ...prev[variant], votes: prev[variant].votes + 1 },
    }));
  }

  function handleSimulate(variant: "A" | "B") {
    setAbStats((prev) => {
      const baseRate =
        variant === "A" ? assets.abTest.versionA.baseRate : assets.abTest.versionB.baseRate;
      const newImpressions = 200 + Math.floor(Math.random() * 300);
      const noise = (Math.random() - 0.5) * 1.5; // +/- 0.75 percentage points
      const rate = Math.max(0.2, baseRate + noise);
      const newConversions = Math.round((newImpressions * rate) / 100);
      return {
        ...prev,
        [variant]: {
          votes: prev[variant].votes,
          impressions: prev[variant].impressions + newImpressions,
          conversions: prev[variant].conversions + newConversions,
        },
      };
    });
  }

  const rateA = (abStats.A.conversions / abStats.A.impressions) * 100;
  const rateB = (abStats.B.conversions / abStats.B.impressions) * 100;
  const leader = rateA === rateB ? null : rateA > rateB ? "A" : "B";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-32 text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-6" style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Marketing &amp; Growth Engine
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 4 — Campaign asset generation for AireLimpio CDMX
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-8">
        {/* ── Input form + saved-specs sidebar ── */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Form */}
          <div className="md:col-span-2 rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-4">
            <h2 className="font-semibold text-white">Campaign Engine Inputs</h2>

            {FORM_FIELDS.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs text-slate-400 mb-1">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    rows={2}
                    className="w-full resize-none rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={form[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                )}
              </div>
            ))}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Spinning up AI engine… (~1s)
                </span>
              ) : (
                "Generate Campaign Assets"
              )}
            </button>

            {hasGenerated && !isGenerating && (
              <p className="rounded bg-emerald-900/30 border border-emerald-700 px-3 py-2 text-xs text-emerald-300">
                ✅ Campaign assets generated. Scroll down to explore the full workspace.
              </p>
            )}
          </div>

          {/* Saved engine specs sidebar */}
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-4 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Saved Engine Specs</h2>
              {history.length > 0 && (
                <button onClick={handleClearHistory} className="text-xs text-red-400 hover:underline">
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={handleSaveSpec}
              className="w-full rounded-lg border border-violet-600 bg-violet-600/20 px-3 py-2 text-xs font-semibold text-violet-200 transition-colors hover:bg-violet-600/30 hover:text-white"
            >
              {justSaved ? "✅ Saved!" : "💾 Save Current Spec"}
            </button>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 flex-1">No engine specs saved yet.</p>
            ) : (
              <ul className="space-y-2 overflow-y-auto max-h-96 flex-1 pr-1">
                {history.map((h) => (
                  <li
                    key={h.id}
                    className="rounded-lg border border-slate-600 bg-slate-900 p-2.5 text-xs text-slate-300 transition hover:bg-slate-700"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-medium text-white truncate">{h.label}</div>
                      {h.generatedAssets && (
                        <span className="shrink-0 rounded border border-emerald-700 bg-emerald-900/40 px-1.5 py-0.5 text-[10px] text-emerald-300">
                          full campaign
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 truncate text-slate-500">
                      {new Date(h.saved_at).toLocaleString()}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleLoadTemplate(h)}
                        className="rounded border border-indigo-600 px-2 py-1 text-[11px] text-indigo-300 hover:bg-indigo-600/20"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleRemoveEntry(h.id)}
                        className="rounded border border-red-600 px-2 py-1 text-[11px] text-red-300 hover:bg-red-600/20"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Generated Campaign Workspace ── */}
        {hasGenerated && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white tracking-tight">Generated Campaign Workspace</h2>
              <span className="rounded-full border border-indigo-700 bg-indigo-950/40 px-3 py-1 text-xs font-medium text-indigo-300">
                {assets.brandSystem.name}
              </span>
            </div>

            {/* ── Section A: Brand System & Target Persona ── */}
            <div className="grid gap-6 lg:grid-cols-2">
              <SectionCard title="A — Brand System">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Name</span>
                  <span className="text-xl font-bold text-white">{assets.brandSystem.name}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Tagline</span>
                  <span className="text-sm font-semibold text-emerald-300">{assets.brandSystem.tagline}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide block mb-1">Value Promise</span>
                  <p className="text-sm text-slate-300 leading-relaxed">{assets.brandSystem.valuePromise}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wide block mb-2">
                    Tone of Voice Rules — &quot;Trusted Doctor&quot;
                  </span>
                  <ul className="space-y-1.5">
                    {assets.brandSystem.toneRules.map((rule, i) => (
                      <li key={i} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-indigo-400">{i + 1}.</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionCard>

              <SectionCard title="A — Target Persona">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-900/50 text-xl">
                    👩🏽
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{assets.persona.name}</div>
                    <div className="text-xs text-slate-400">{assets.persona.role}</div>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-emerald-400 uppercase tracking-wide block mb-1.5">Goals</span>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {assets.persona.goals.map((g, i) => (
                      <li key={i} className="flex gap-2">
                        <span>🎯</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs text-red-400 uppercase tracking-wide block mb-1.5">Frustrations</span>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {assets.persona.frustrations.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span>⚠️</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs text-indigo-400 uppercase tracking-wide block mb-1.5">Tech Habits</span>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {assets.persona.techHabits.map((t, i) => (
                      <li key={i} className="flex gap-2">
                        <span>📱</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-xs text-violet-400 uppercase tracking-wide block mb-1.5">Motivations</span>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {assets.persona.motivations.map((m, i) => (
                      <li key={i} className="flex gap-2">
                        <span>💪</span>
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionCard>
            </div>

            {/* ── Section B: Landing Page Copy ── */}
            <SectionCard title="B — Landing Page Copy">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-indigo-700 bg-indigo-950/30 p-4 space-y-2 lg:col-span-2">
                  <span className="text-xs text-indigo-400 uppercase tracking-wide block">Hero Title &amp; Subheadline</span>
                  <h3 className="text-2xl font-bold text-white leading-tight">{assets.landing.heroTitle}</h3>
                  <p className="text-sm text-slate-300">{assets.landing.heroSubheadline}</p>
                </div>

                <div className="rounded-xl border border-slate-600 bg-slate-900 p-4 space-y-2">
                  <span className="text-xs text-emerald-400 uppercase tracking-wide block">Core Benefits</span>
                  <ul className="space-y-1.5 text-sm text-slate-300">
                    {assets.landing.benefits.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-emerald-400">✅</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-600 bg-slate-900 p-4 space-y-2">
                  <span className="text-xs text-amber-400 uppercase tracking-wide block">
                    FAQ — Privacy &amp; SEMARNAT Compliance
                  </span>
                  <FaqAccordion items={assets.landing.faq} />
                </div>
              </div>
            </SectionCard>

            {/* ── Section C: Social Post Display ── */}
            <SectionCard title="C — Social Post Display (10 posts)">
              <div className="grid gap-3 sm:grid-cols-2">
                {assets.socialPosts.map((post) => (
                  <div
                    key={`${post.channel}-${post.index}`}
                    className="flex flex-col gap-3 rounded-xl border border-slate-600 bg-slate-900 p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${channelColor(post.channel)}`}>
                        [{post.channel} Post #{post.index}]
                      </span>
                      <CopyButton text={post.text} label="📋 Copy Post" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">{post.text}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Section D: Video Script Generator ── */}
            <SectionCard title="D — Video Script Generator (3 scripts)">
              <div className="grid gap-4 lg:grid-cols-3">
                {assets.videoScripts.map((script, i) => {
                  const fullScript = `${script.title}\n\n${script.hook}\n\n${script.problem}\n\n${script.cta}`;
                  return (
                    <div key={i} className="flex flex-col gap-3 rounded-xl border border-slate-600 bg-slate-900 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-white">{script.title}</span>
                        <CopyButton text={fullScript} label="📋 Copy Script" />
                      </div>
                      <div className="space-y-2 text-xs leading-relaxed text-slate-300">
                        <p className="rounded-lg border border-sky-800 bg-sky-950/30 p-2">{script.hook}</p>
                        <p className="rounded-lg border border-indigo-800 bg-indigo-950/30 p-2">{script.problem}</p>
                        <p className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-2">{script.cta}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* ── Section E: 14-Day Campaign Calendar ── */}
            <SectionCard title="E — 14-Day Campaign Calendar">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
                {assets.calendar.map((d) => (
                  <div key={d.day} className="flex flex-col gap-2 rounded-xl border border-slate-600 bg-slate-900 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Day {d.day}</span>
                      {d.day === 7 || d.day === 14 ? (
                        <span className="rounded border border-violet-700 bg-violet-900/40 px-1.5 py-0.5 text-[10px] text-violet-300">
                          milestone
                        </span>
                      ) : null}
                    </div>
                    <p className="text-xs leading-snug text-slate-300">{d.activity}</p>
                    <span className="inline-block rounded border border-indigo-700 bg-indigo-950/40 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                      {d.channel}
                    </span>
                    <p className="text-[11px] leading-snug text-slate-500">🎯 {d.objective}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Section F: Visual Prompt Pack ── */}
            <SectionCard title="F — Visual Prompt Pack (8 prompts)">
              <div className="grid gap-3 sm:grid-cols-2">
                {assets.visualPrompts.map((prompt, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 rounded-xl border border-slate-600 bg-slate-900 p-4">
                    <div>
                      <span className="text-xs text-violet-400 uppercase tracking-wide block mb-1">Prompt #{i + 1}</span>
                      <p className="text-xs leading-relaxed text-slate-300 font-mono">{prompt}</p>
                    </div>
                    <CopyButton text={prompt} label="📋 Copy Prompt" />
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Section G: A/B Headline & CTA Tester ── */}
            <SectionCard title="G — A/B Headline & CTA Tester">
              <div className="grid gap-4 lg:grid-cols-2">
                {(["A", "B"] as const).map((variant) => {
                  const v = variant === "A" ? assets.abTest.versionA : assets.abTest.versionB;
                  const stats = abStats[variant];
                  const rate = variant === "A" ? rateA : rateB;
                  const isLeader = leader === variant;
                  return (
                    <div
                      key={variant}
                      className={`rounded-xl border p-4 space-y-3 ${
                        isLeader ? "border-emerald-600 bg-emerald-950/20" : "border-slate-600 bg-slate-900"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white">{v.label}</span>
                        {isLeader && (
                          <span className="rounded border border-emerald-600 bg-emerald-900/40 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                            🏆 Leading
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold leading-snug text-white">{v.headline}</h3>
                      <div className="inline-block rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white">
                        {v.cta}
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-center">
                          <span className="block text-[10px] text-slate-400">Impressions</span>
                          <span className="block text-sm font-bold text-white">{stats.impressions.toLocaleString()}</span>
                        </div>
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-center">
                          <span className="block text-[10px] text-slate-400">Conversions</span>
                          <span className="block text-sm font-bold text-white">{stats.conversions.toLocaleString()}</span>
                        </div>
                        <div className="rounded-lg border border-slate-700 bg-slate-950 p-2 text-center">
                          <span className="block text-[10px] text-slate-400">Conv. Rate</span>
                          <span className="block text-sm font-bold text-emerald-300">{rate.toFixed(2)}%</span>
                        </div>
                      </div>

                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                        <div
                          className={`h-full rounded-full ${variant === "A" ? "bg-indigo-500" : "bg-emerald-500"}`}
                          style={{ width: `${Math.min(rate * 10, 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          onClick={() => handleVote(variant)}
                          className="flex-1 rounded-lg border border-violet-600 bg-violet-600/20 px-3 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-600/30 hover:text-white"
                        >
                          🗳️ Vote for Variant ({stats.votes})
                        </button>
                        <button
                          onClick={() => handleSimulate(variant)}
                          className="flex-1 rounded-lg border border-indigo-600 bg-indigo-600/20 px-3 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-600/30 hover:text-white"
                        >
                          ▶️ Simulate Conversion Test
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500">
                Simulations add randomized impressions/conversions around each variant&apos;s baseline rate.
                Votes and simulated stats are local to this session.
              </p>
            </SectionCard>

            {/* ── Global Save Button ── */}
            <div className="rounded-2xl border border-violet-700 bg-violet-950/20 p-6 flex flex-col items-center gap-3 text-center">
              <p className="text-sm text-slate-300">
                Save this entire generated campaign — brand system, persona, landing copy, social posts,
                video scripts, calendar, visual prompts, and A/B test setup — to your local history.
              </p>
              <button
                onClick={handleSaveSpec}
                className="rounded-lg border border-violet-500 bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/50 transition hover:bg-violet-500"
              >
                {justSaved ? "✅ Campaign Saved to History!" : "💾 Save Campaign to History"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
