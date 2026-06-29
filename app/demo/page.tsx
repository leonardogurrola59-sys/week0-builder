"use client";

import { Fragment, useState } from "react";
import Link from "next/link";

// ── Stage data ─────────────────────────────────────────────────────────────────

interface Stage {
  title: string;
  icon: string;
  route: string | null;
  routeLabel: string;
  description: string;
}

const STAGES: Stage[] = [
  {
    title: "Community Ingestion",
    icon: "📱",
    route: "/chat",
    routeLabel: "/chat",
    description: "Citizen records raw pollution observations.",
  },
  {
    title: "Safety Screening & Guardrails",
    icon: "🛡️",
    route: null,
    routeLabel: "internal logic",
    description: "Dra. Aire regex scanner filters and validates data scope.",
  },
  {
    title: "Regulatory Compliance Structuring",
    icon: "📋",
    route: "/dashboard",
    routeLabel: "/dashboard",
    description: "Formats variables into formal SEMARNAT/SINAICA compliance standards.",
  },
  {
    title: "Campaign Outreach Dissemination",
    icon: "📣",
    route: "/marketing",
    routeLabel: "/marketing",
    description: "Generates 10 social posts, 3 video scripts, and custom WhatsApp broadcast assets.",
  },
];

// ── Small reusable primitives ─────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-white tracking-wide">{title}</h2>
      {children}
    </div>
  );
}

function StageCard({
  stage,
  stepNum,
  isActive,
  isComplete,
}: {
  stage: Stage;
  stepNum: number;
  isActive: boolean;
  isComplete: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 space-y-2 transition-all duration-300 ${
        isActive
          ? "border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500/60 shadow-lg shadow-emerald-900/40"
          : isComplete
          ? "border-indigo-700 bg-indigo-950/20"
          : "border-slate-700 bg-slate-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{stage.icon}</span>
        {isComplete && !isActive && <span className="text-xs text-indigo-300">✅ Done</span>}
        {isActive && <span className="text-xs font-semibold text-emerald-300">● Active</span>}
      </div>
      <div>
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Stage {stepNum}
        </span>
        <h3 className="text-sm font-bold text-white leading-snug">{stage.title}</h3>
      </div>
      <p className="text-xs leading-relaxed text-slate-400">{stage.description}</p>
      {stage.route ? (
        <Link
          href={stage.route}
          className="inline-block rounded border border-slate-600 bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-indigo-300 hover:border-indigo-500 hover:text-white"
        >
          {stage.routeLabel}
        </Link>
      ) : (
        <span className="inline-block rounded border border-slate-600 bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-500">
          {stage.routeLabel}
        </span>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  function handleSimulateNext() {
    if (isFinished) return;
    const stage = STAGES[currentStep - 1];
    setSimulationLog((prev) => [...prev, `✅ Stage ${currentStep} — ${stage.title} complete.`]);
    if (currentStep === STAGES.length) {
      setIsFinished(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handleRestart() {
    setCurrentStep(1);
    setIsFinished(false);
    setSimulationLog([]);
  }

  const activeStage = STAGES[currentStep - 1];

  return (
    <div className="min-h-screen pb-16 text-slate-200" style={{ backgroundColor: "#0f172a" }}>
      {/* Header */}
      <div className="border-b border-slate-700 px-6 py-6" style={{ backgroundColor: "#0f172a" }}>
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-white tracking-tight">Final Demo &amp; Agent Map</h1>
          <p className="mt-1 text-sm text-slate-400">
            Week 6 — End-to-end walkthrough of the AireLimpio CDMX platform
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        {/* ── Interactive Simulator Timeline ── */}
        <SectionCard title="Interactive Simulator Timeline">
          <p className="text-xs leading-relaxed text-slate-400">
            Click through the platform&apos;s end-to-end pipeline, one stage at a time — from a
            citizen&apos;s first message to a finished outreach campaign.
          </p>

          <div className="rounded-xl border border-slate-600 bg-slate-900 p-4">
            {isFinished ? (
              <>
                <span className="text-sm font-semibold text-emerald-300">🎉 Simulation Complete</span>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  All four stages have run — from raw citizen ingestion through compliance
                  structuring to campaign dissemination.
                </p>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold text-white">
                  {activeStage.icon} Currently Active — Stage {currentStep}: {activeStage.title}
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{activeStage.description}</p>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSimulateNext}
              disabled={isFinished}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-600"
            >
              {isFinished ? "✅ Simulation Complete" : "▶ Simulate Next Action"}
            </button>
            {(currentStep > 1 || isFinished) && (
              <button
                onClick={handleRestart}
                className="rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-400 hover:text-white"
              >
                🔄 Restart Simulation
              </button>
            )}
          </div>

          {simulationLog.length > 0 && (
            <div className="space-y-1.5 rounded-xl border border-slate-700 bg-slate-950 p-3">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Simulation Log
              </span>
              {simulationLog.map((line, i) => (
                <p key={i} className="font-mono text-xs leading-relaxed text-emerald-300">
                  {line}
                </p>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ── Visual Connected Agent Map Grid ── */}
        <SectionCard title="Connected Agent Map">
          <p className="text-xs leading-relaxed text-slate-400">
            The same four stages, mapped as a connected pipeline. The active stage glows emerald;
            completed stages settle into indigo.
          </p>

          {/* Desktop: horizontal connected row */}
          <div className="hidden grid-cols-7 items-center gap-2 lg:grid">
            {STAGES.map((stage, i) => {
              const stepNum = i + 1;
              return (
                <Fragment key={stage.title}>
                  <StageCard
                    stage={stage}
                    stepNum={stepNum}
                    isActive={!isFinished && currentStep === stepNum}
                    isComplete={isFinished || currentStep > stepNum}
                  />
                  {i < STAGES.length - 1 && (
                    <div className="flex items-center justify-center text-2xl text-slate-600">→</div>
                  )}
                </Fragment>
              );
            })}
          </div>

          {/* Mobile/tablet: vertical connected stack */}
          <div className="grid gap-2 lg:hidden">
            {STAGES.map((stage, i) => {
              const stepNum = i + 1;
              return (
                <Fragment key={stage.title}>
                  <StageCard
                    stage={stage}
                    stepNum={stepNum}
                    isActive={!isFinished && currentStep === stepNum}
                    isComplete={isFinished || currentStep > stepNum}
                  />
                  {i < STAGES.length - 1 && (
                    <div className="flex justify-center text-xl text-slate-600">↓</div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </SectionCard>

        {/* ── Impact, Risk, and V2 Roadmap Summary Panels ── */}
        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="A — Practical Impact Check">
            <p className="text-xs leading-relaxed text-slate-300">
              A phone photo of brick-kiln smoke, on its own, is easy for a regulator to dismiss as
              anecdotal. This system directly addresses the data-credibility gap faced by
              under-served neighborhoods like Rosa Elena&apos;s in Iztapalapa — routing that same
              observation through Dra. Aire&apos;s intake flow timestamps it, geolocates it, tags
              its source, and reformats it into a SEMARNAT-compliant evidence packet. The net
              effect: invisible, easily-ignored smoke becomes formal civic leverage a community
              can act on, share, and escalate.
            </p>
          </SectionCard>

          <SectionCard title="B — Risks &amp; Guardrails">
            <p className="text-xs leading-relaxed text-slate-300">
              The biggest operational risk in any complaint-intake tool is scope drift — people
              will ask about anything, in either language, and a system that engages with medical,
              electoral, or unrelated municipal questions both dilutes its credibility and exposes
              it to liability. The bilingual (English/Spanish) keyword guardrail engine — plus a
              dedicated Human Checkpoint escalation path for severe incidents like illegal dumping
              or corruption — holds that scope line: every out-of-scope or dangerous input is
              intercepted before it reaches the intake loop, protecting platform integrity from
              false flags and off-topic clutter while still routing genuinely urgent reports to a
              human channel.
            </p>
          </SectionCard>

          <SectionCard title="C — Version 2 Engineering Roadmap">
            <ul className="space-y-2.5 text-xs leading-relaxed text-slate-300">
              <li className="flex gap-2">
                <span className="text-indigo-400">1.</span>
                <span>
                  Migrate client-side <code className="text-slate-200">localStorage</code> state
                  (chat logs, marketing specs, pricing scenarios) to a persistent production
                  database for durability, cross-device sync, and real audit trails.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">2.</span>
                <span>
                  Stand up a centralized vector database indexing Mexican environmental law and
                  SEMARNAT precedent, enabling automated legal citation lookup inside generated
                  compliance packets.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-400">3.</span>
                <span>
                  Wire a direct, automated email dispatch handler from the compliance summary
                  straight to official PROFEPA/SEMARNAT submission endpoints, removing the manual
                  copy-paste step between evidence generation and formal filing.
                </span>
              </li>
            </ul>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
