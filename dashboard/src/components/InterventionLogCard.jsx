import { formatRelativeTime } from "../utils/date";

export default function InterventionLogCard({ entries }) {
  return (
    <div className="bg-card border border-border rounded-md p-5">
      <h3 className="text-base font-bold text-text mb-4">Intervention log</h3>

      {entries.length === 0 ? (
        <p className="text-sm text-text-soft">No interventions logged yet for this student.</p>
      ) : (
        <ul className="space-y-4">
          {entries.map((e) => (
            <li key={e.id} className="flex gap-3 items-start">
              <span
                className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${e.muted ? "bg-text-faint" : "bg-accent"}`}
                aria-hidden="true"
              />
              <span className="text-xs text-text-faint w-24 shrink-0 pt-0.5">
                {formatRelativeTime(e.date)}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-text font-medium">{e.text}</p>
                <p className="text-xs text-text-faint mt-0.5">{e.sub}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
