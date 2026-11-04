import RiskDot from "./RiskDot";
import { daysSince } from "../utils/date";

export default function NeedsAttentionCard({ students }) {
  return (
    <div className="bg-card border border-border rounded-md p-5">
      <h3 className="text-sm font-bold text-text mb-0.5">Needs attention soon</h3>
      <p className="text-xs text-text-faint mb-3 leading-snug">
        Approaching the 7-day outreach reminder — nothing urgent yet.
      </p>

      {students.length === 0 ? (
        <p className="text-xs text-text-soft">
          Nobody's approaching the reminder threshold right now.
        </p>
      ) : (
        <ul className="space-y-2.5">
          {students.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              <RiskDot tier={s.riskTier} />
              <span className="text-sm font-semibold text-text flex-1 truncate">{s.name}</span>
              <span className="text-xs text-text-faint whitespace-nowrap">
                {daysSince(s.flaggedDate)} days waiting
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
