const STYLES = {
  "Needs outreach": "bg-[#F1ECE4] text-ink-muted",
  Contacted: "bg-[#EAF0EC] text-[#4C6B54]",
  Resolved: "bg-[#E9EEF3] text-[#39597A]",
};

export default function StatusChip({ status, className = "" }) {
  const style = STYLES[status] ?? "bg-[#F1ECE4] text-ink-muted";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${style} ${className}`}
    >
      {status}
    </span>
  );
}
