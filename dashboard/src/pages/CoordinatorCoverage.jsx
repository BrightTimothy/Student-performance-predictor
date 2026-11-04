import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as coordinatorService from "../services/coordinatorService";

const STATUS_CLASSES = {
  "On track": "bg-risk-low-bg text-risk-low",
  "May need support": "bg-risk-med-bg text-risk-med",
};

function StatusPill({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASSES[status]}`}>
      {status}
    </span>
  );
}

export default function CoordinatorCoverage() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    coordinatorService.getOutreachCoverage(user.departmentId).then(setRows);
  }, [user.departmentId]);

  if (!rows) {
    return <p className="text-text-soft text-sm">Loading outreach coverage…</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-text mb-0.5">Outreach coverage</h1>
        <p className="text-sm text-text-soft">
          Capacity across your department's advisors — not a leaderboard.
        </p>
      </div>

      <div className="bg-card border border-border rounded-md p-5 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              {["Advisor", "Cohort", "Size", "Flagged", "Awaiting >7 days", "Status"].map((h) => (
                <th
                  key={h}
                  className="text-xs font-bold uppercase tracking-wide text-text-faint text-left pb-3 px-2 first:pl-0"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.advisorId} className="border-t border-border-soft">
                <td className="py-3.5 px-2 pl-0 text-sm font-semibold text-text whitespace-nowrap">
                  {row.advisorName}
                </td>
                <td className="py-3.5 px-2 text-sm text-text-soft whitespace-nowrap">{row.cohortLabel}</td>
                <td className="py-3.5 px-2 text-sm text-text-soft">{row.cohortSize}</td>
                <td className="py-3.5 px-2 text-sm text-text-soft">{row.flaggedCount}</td>
                <td className="py-3.5 px-2 text-sm text-text-soft">{row.awaitingOver7}</td>
                <td className="py-3.5 px-2">
                  <StatusPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
