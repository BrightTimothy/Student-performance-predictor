import { levelFlaggedFillClass } from "../utils/riskHelpers";

// Framed explicitly as a stage/cohort lens, never an advisor comparison —
// see the caption below. No ranking, no advisor names in the headline,
// rows always ordered 100L -> 400L (never sorted by flagged rate).
export default function CohortRiskOverviewCard({ levels }) {
  return (
    <div className="bg-card border border-border rounded-md p-5">
      <h3 className="text-base font-bold text-text mb-1">Cohort risk overview</h3>
      <p className="text-xs text-text-faint mb-5 max-w-xl leading-relaxed">
        Flagged % by level — 200L tends to be the harder transition stage of the
        programme, not a reflection of advisor performance.
      </p>

      <div className="space-y-3.5">
        {levels.map((row) => (
          <div key={row.level} className="flex items-center gap-3">
            <span className="text-sm font-bold text-text-soft w-10 shrink-0">{row.levelShort}</span>
            <div className="flex-1 h-2.5 rounded-full bg-border-soft overflow-hidden">
              <div
                className={`h-full rounded-full ${levelFlaggedFillClass(row.flaggedPct)}`}
                style={{ width: `${row.flaggedPct}%` }}
              />
            </div>
            <span className="text-sm text-text-faint w-10 shrink-0 text-right">{row.flaggedPct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
