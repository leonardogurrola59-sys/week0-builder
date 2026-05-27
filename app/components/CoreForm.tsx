"use client";
import { useState } from "react";

export default function CoreForm({ onResult }: { onResult: (res: any) => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userInput: input, location: null }),
    });
    const data = await res.json();
    onResult(data);
    setLoading(false);
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe location or paste data links"
        className="w-full p-2 border rounded text-black"
      />
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate"}
      </button>
    </div>
  );
}
