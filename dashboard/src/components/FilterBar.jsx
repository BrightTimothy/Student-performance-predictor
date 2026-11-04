const FILTERS = [
  { key: "all", label: "All risk" },
  { key: "High", label: "High" },
  { key: "Medium", label: "Medium" },
  { key: "Low", label: "Low" },
  { key: "awaiting", label: "Awaiting outreach" },
];

export default function FilterBar({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {FILTERS.map((f) => {
        const active = value === f.key;
        return (
          <button
            key={f.key}
            onClick={() => onChange(f.key)}
            className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
              active
                ? "bg-text text-white border-text"
                : "bg-card text-text-soft border-border hover:border-text-faint"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
