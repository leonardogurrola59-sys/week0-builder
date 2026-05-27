export default function OutputCard({ result }: { result: any }) {
  if (!result) return null;
  const g = result.generated_summary;

  return (
    <div className="p-6 border rounded-lg shadow bg-white text-black space-y-4">
      <h2 className="text-xl font-bold">{g.headline}</h2>
      <p className="text-gray-700">{g.narrative}</p>

      <div>
        <h3 className="font-semibold text-lg">Findings</h3>
        <ul className="list-disc pl-5 space-y-1">
          {g.findings.map((f: any, i: number) => (
            <li key={i}>
              <span className="font-medium">{f.metric}</span> — {f.value} (source: {f.source})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-lg">Recommendations</h3>
        <ul className="list-disc pl-5 space-y-1">
          {g.recommendations.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
