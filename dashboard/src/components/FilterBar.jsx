const selectClasses =
  "rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent";

export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3">
      <select
        className={selectClasses}
        value={filters.risk}
        onChange={(e) => onChange({ ...filters, risk: e.target.value })}
      >
        <option value="all">All risk levels</option>
        <option value="attention">Needs attention</option>
        <option value="watch">Keep an eye on</option>
        <option value="safe">Doing well</option>
      </select>

      <select
        className={selectClasses}
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="all">All statuses</option>
        <option value="Needs outreach">Needs outreach</option>
        <option value="Contacted">Contacted</option>
        <option value="Resolved">Resolved</option>
      </select>

      <button
        onClick={onReset}
        className="ml-auto text-sm text-ink-muted hover:text-ink transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
