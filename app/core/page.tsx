"use client";

import CoreForm from "../components/CoreForm";
import OutputCard from "../components/OutputCard";
import { useEffect, useState } from "react";

export default function CorePage() {
  const [result, setResult] = useState<any | null>(null);
  const [savedSimulations, setSavedSimulations] = useState<any[]>([]);

  // Load saved simulations on mount
  useEffect(() => {
    const saved = localStorage.getItem("core_simulations");
    if (saved) {
      try {
        setSavedSimulations(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved simulations", e);
      }
    }
  }, []);

  // Sync custom event listener
  useEffect(() => {
    const handler = (e: any) => setResult(e.detail);
    window.addEventListener("core:result", handler as EventListener);
    return () => window.removeEventListener("core:result", handler as EventListener);
  }, []);

  const handleSave = () => {
    if (!result) return;

    // Prevent duplicate entries
    if (savedSimulations.some(sim => sim.id === result.id)) {
      alert("This simulation is already saved!");
      return;
    }

    const updated = [result, ...savedSimulations];
    setSavedSimulations(updated);
    localStorage.setItem("core_simulations", JSON.stringify(updated));
    alert("Simulation saved to local history!");
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all saved history?")) {
      setSavedSimulations([]);
      localStorage.removeItem("core_simulations");
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8 text-white">
      {/* Book Architecture Sections */}
      <section className="mt-6">
        <h2 className="font-semibold text-xl">10‑Chapter Architecture</h2>
        <p className="text-sm text-gray-400 mt-2">(Link to BUILD_PACKET in repo or embed table.)</p>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-xl">Selected Chapter: Data Transparency for Communities</h2>
        <p className="text-sm text-gray-400">Generative Core: plain-language dashboard + evidence packets</p>
      </section>

      {/* Grid Layout */}
      <section className="mt-6 grid md:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-4">Input</h3>
            <CoreForm onResult={(res) => {
              const event = new CustomEvent("core:result", { detail: res });
              window.dispatchEvent(event);
              setResult(res);
            }} />
          </div>

          {/* Saved History List Container */}
          <div className="border-t border-zinc-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Saved Simulations History</h3>
              {savedSimulations.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-400 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
            {savedSimulations.length === 0 ? (
              <p className="text-sm text-gray-500">No saved runs yet. Generate a report and click Save.</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {savedSimulations.map((sim) => (
                  <li
                    key={sim.id}
                    onClick={() => setResult(sim)}
                    className={`p-3 rounded border text-sm cursor-pointer transition ${
                      result?.id === sim.id
                        ? 'bg-blue-950 border-blue-500 text-white'
                        : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-gray-300'
                    }`}
                  >
                    <div className="font-medium truncate">Prompt: "{sim.user_input || "Empty Input"}"</div>
                    <div className="text-xs text-gray-500 mt-1">ID: {sim.id.substring(0,8)}... • Headline: {sim.generated_summary.headline}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-4">Output</h3>
            <OutputCard result={result} />
          </div>

          {result && (
            <button
              onClick={handleSave}
              className="w-full mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition"
            >
              💾 Save This Run to History
            </button>
          )}
        </div>
      </section>

      {/* Required Documentation Section */}
      <section className="mt-12 bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
        <h2 className="font-semibold text-lg text-emerald-400">🗄️ Documented Database Structure (Supabase Target Schema)</h2>
        <p className="text-sm text-gray-400">
          This system uses an interface schema ready to migrate onto a Supabase PostgreSQL table named <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-200">saved_cores</code>:
        </p>
        <pre className="bg-zinc-900 p-4 rounded text-xs text-zinc-300 overflow-x-auto border border-zinc-800 font-mono">
{`CREATE TABLE saved_cores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_input TEXT NOT NULL,
  selected_chapter INT4 DEFAULT 8,
  location JSONB,
  generated_summary JSONB NOT NULL,
  provenance JSONB NOT NULL
);`}
        </pre>
        <p className="text-xs text-gray-500">
          *Note: The frontend architecture utilizes matching nested JSON object schemas to seamlessly switch over to live database triggers during Week 2 scaling.
        </p>
      </section>
    </main>
  );
}
