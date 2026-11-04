import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as coordinatorService from "../services/coordinatorService";
import SummaryCard from "../components/SummaryCard";
import FlagsOverTimeCard from "../components/FlagsOverTimeCard";
import CohortRiskOverviewCard from "../components/CohortRiskOverviewCard";

export default function CoordinatorOverview() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    coordinatorService.getDepartmentOverview(user.departmentId).then(setOverview);
  }, [user.departmentId]);

  if (!overview) {
    return <p className="text-text-soft text-sm">Loading department overview…</p>;
  }

  const avgResponseLabel = `${overview.avgResponseDays.toFixed(1)}d`;

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-text mb-0.5">{overview.departmentName} Department</h1>
        <p className="text-sm text-text-soft">
          {overview.levelCount} levels · {overview.advisorCount} advisors · {overview.studentCount} students
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <SummaryCard label="Total flagged" value={overview.totalFlagged} valueClassName="text-risk-high" />
        <SummaryCard
          label="Awaiting outreach"
          value={overview.awaitingOutreach}
          valueClassName="text-risk-med"
        />
        <SummaryCard label="Avg. response time" value={avgResponseLabel} />
      </div>

      <div className="flex flex-col gap-5">
        <FlagsOverTimeCard points={overview.trend} />
        <CohortRiskOverviewCard levels={overview.levelBreakdown} />
      </div>
    </div>
  );
}
