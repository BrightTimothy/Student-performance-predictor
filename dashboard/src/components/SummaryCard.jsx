export default function SummaryCard({ label, value, valueClassName = "" }) {
  return (
    <div className="flex-1 bg-card border border-border rounded-md px-5 py-4">
      <div className={`text-3xl font-extrabold leading-none mb-1.5 ${valueClassName}`}>
        {value}
      </div>
      <div className="text-sm text-text-soft">{label}</div>
    </div>
  );
}
