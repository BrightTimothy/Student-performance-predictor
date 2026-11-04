import { fillClassForPercent } from "../utils/riskHelpers";

export default function ReasonBarsCard({ reasons }) {
  return (
    <div className="bg-card border border-border rounded-md p-5">
      <h3 className="text-base font-bold text-text mb-4">Why flagged — academic signals only</h3>
      <div className="space-y-4">
        {reasons.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between text-sm mb-1.5 gap-3">
              <span className="font-semibold text-text">{r.label}</span>
              <span className="text-text-soft text-right">{r.detail}</span>
            </div>
            <div className="h-2 rounded-full bg-border-soft overflow-hidden">
              <div
                className={`h-full rounded-full ${fillClassForPercent(r.percent)}`}
                style={{ width: `${r.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
