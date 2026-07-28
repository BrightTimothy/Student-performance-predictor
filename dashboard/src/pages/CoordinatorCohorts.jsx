import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { departmentsInScope } from "../data/mockOrg";
import { getLevelOverview } from "../services/coordinatorService";

const CAPACITY_STYLES = {
  Low: "bg-[#EAF0EC] text-[#4C6B54]",
  Moderate: "bg-[#F7EFDD] text-[#8A6A2A]",
  High: "bg-[#F3E7E4] text-[#8A4C42]",
};

export default function CoordinatorCohorts() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    getLevelOverview(departmentsInScope(user)).then(setRows);
  }, [user]);

  if (!rows) {
    return <p className="text-ink-muted text-sm">Loading cohorts…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Cohort risk overview</h1>
        <p className="text-ink-muted mt-1 max-w-2xl">
          Higher flagged rates often reflect genuinely harder stages of a programme,
          not advisor performance. Use this to see where students need more
          structural support.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.7fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-3 text-xs font-medium text-ink-muted border-b border-border">
          <span>Cohort</span>
          <span>Students</span>
          <span>Flagged</span>
          <span>Outreach rate</span>
          <span>Awaiting outreach</span>
          <span>Capacity</span>
        </div>

        {rows.map((row) => (
          <Link
            key={`${row.departmentId}-${row.level}`}
            to={`/coordinator/cohorts/${row.departmentId}/${encodeURIComponent(row.level)}`}
            className="grid grid-cols-[1.7fr_1fr_1fr_1fr_1fr_1fr] gap-2 px-5 py-3 text-sm items-center border-b border-border last:border-b-0 hover:bg-[#FAF8F5] transition-colors"
          >
            <span>
              <span className="text-ink font-medium">{row.cohortLabel}</span>
              <span className="block text-xs text-ink-muted mt-0.5">
                Advised by {row.advisorName}
              </span>
            </span>
            <span className="text-ink-muted">{row.studentCount}</span>
            <span className="text-ink-muted">{row.flaggedPct}%</span>
            <span className="text-ink-muted">{row.outreachRate}%</span>
            <span className="text-ink-muted">{row.awaitingOutreachCount}</span>
            <span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CAPACITY_STYLES[row.capacity]}`}
              >
                {row.capacity}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <p className="text-xs text-ink-muted max-w-2xl">
        A cohort showing "High" here may mean its advisor is supporting more
        flagged students than usual for this stage — consider offering support,
        not judging performance.
      </p>
    </div>
  );
}
