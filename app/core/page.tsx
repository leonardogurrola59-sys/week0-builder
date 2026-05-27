"use client";

import CoreForm from "../components/CoreForm";
import OutputCard from "../components/OutputCard";
import { useEffect, useState } from "react";

export default function CorePage() {
  const [result, setResult] = useState<any | null>(null);

  useEffect(() => {
    const handler = (e: any) => setResult(e.detail);
    window.addEventListener("core:result", handler as EventListener);
    return () => window.removeEventListener("core:result", handler as EventListener);
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8 text-white">
      <section className="mt-6">
        <h2 className="font-semibold text-xl">10‑Chapter Architecture</h2>
        <p className="text-sm text-gray-400 mt-2">(Link to BUILD_PACKET in repo or embed table.)</p>
      </section>

      <section className="mt-6">
        <h2 className="font-semibold text-xl">Selected Chapter: Data Transparency for Communities</h2>
        <p className="text-sm text-gray-400">Generative Core: plain-language dashboard + evidence packets</p>
      </section>

      <section className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="font-semibold text-lg mb-4">Input</h3>
          <CoreForm onResult={(res) => {
            const event = new CustomEvent("core:result", { detail: res });
            window.dispatchEvent(event);
            setResult(res);
          }} />
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h3 className="font-semibold text-lg mb-4">Output</h3>
          <OutputCard result={result} />
        </div>
      </section>
    </main>
  );
}
