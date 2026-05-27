import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const summary = {
    id: crypto.randomUUID(),
    selected_chapter: 8,
    user_input: body.userInput || "",
    location: body.location || null,
    generated_summary: {
      headline: "Localized data shows elevated PM2.5 last 24h",
      narrative: "Plain-language narrative generated from public feeds and uploads.",
      findings: [
        {
          time: new Date().toISOString(),
          metric: "PM2.5",
          value: 42,
          source: "public_feed_url",
          confidence: 0.78
        },
      ],
      recommendations: ["Avoid outdoor exercise during peak hours", "Collect photos for evidence"],
      evidence_packet_url: null,
    },
    provenance: [{ source: "public_feed_url", type: "regulatory", retrieved_at: new Date().toISOString() }],
    created_at: new Date().toISOString(),
  };

  return NextResponse.json(summary);
}
