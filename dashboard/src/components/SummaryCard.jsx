export default function SummaryCard({ label, value, sublabel }) {
  return (
    <div className="bg-surface border border-border rounded-2xl px-5 py-4">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="text-2xl font-semibold text-ink mt-1">{value}</p>
      {sublabel && <p className="text-xs text-ink-muted mt-1">{sublabel}</p>}
    </div>
  );
}
