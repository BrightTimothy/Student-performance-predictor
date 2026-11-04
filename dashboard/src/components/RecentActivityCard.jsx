import { formatRelativeTime } from "../utils/date";

export default function RecentActivityCard({ events }) {
  return (
    <div className="bg-card border border-border rounded-md p-5">
      <h3 className="text-sm font-bold text-text mb-3">Recent activity</h3>

      {events.length === 0 ? (
        <p className="text-xs text-text-soft">No activity logged yet this term.</p>
      ) : (
        <ul className="space-y-3.5">
          {events.map((e) => (
            <li key={e.id} className="flex gap-2.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent mt-[7px] shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-sm text-text leading-snug">{e.text}</p>
                <p className="text-xs text-text-faint mt-0.5">{formatRelativeTime(e.date)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
