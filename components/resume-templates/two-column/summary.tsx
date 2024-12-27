export function TwoColumnSummary({ summary }: { summary: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold border-b pb-1">Professional Summary</h2>
      <p className="text-sm">{summary}</p>
    </div>
  );
} 