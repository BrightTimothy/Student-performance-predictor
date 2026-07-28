import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { departmentsInScope } from "../data/mockOrg";
import { getDepartmentOverview } from "../services/coordinatorService";
import SummaryCard from "../components/SummaryCard";
import TrendChart from "../components/TrendChart";

export default function CoordinatorOverview() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getDepartmentOverview(departmentsInScope(user)).then(setOverview);
  }, [user]);

  if (!overview) {
    return <p className="text-ink-muted text-sm">Loading overview…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{user.scopeName}</h1>
        <p className="text-ink-muted mt-1">
          Visibility into student support across every level in this{" "}
          {user.scope === "college" ? "college" : "department"}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Students flagged this term" value={overview.flaggedThisTerm} />
        <SummaryCard label="Outreach rate" value={`${overview.outreachRate}%`} />
        <SummaryCard label="Students improved after outreach" value={overview.improved} />
        <SummaryCard label="Awaiting outreach 14+ days" value={overview.awaiting14Plus} />
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-medium text-ink mb-4">
          Flags raised vs. contacted vs. improved
        </h2>
        <TrendChart data={overview.trend} />
      </div>
    </div>
  );
}
