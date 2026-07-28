import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { departmentsInScope, getAdvisorById } from "../data/mockOrg";
import { getEscalations } from "../services/coordinatorService";
import RiskDot from "../components/RiskDot";
import { tierLabel } from "../utils/riskHelpers";

export default function CoordinatorEscalations() {
  const { user } = useAuth();
  const [escalations, setEscalations] = useState(null);

  useEffect(() => {
    getEscalations(departmentsInScope(user)).then(setEscalations);
  }, [user]);

  function handleReassign(row) {
    // Reassignment is a human decision — no automated action here.
    window.alert(`Reassigning ${row.studentName} is a manual step for now.`);
  }

  function contactAdvisorHref(row) {
    const advisor = getAdvisorById(row.advisorId);
    const subject = encodeURIComponent(`${row.studentName} — flagged ${row.daysSinceFlagged} days`);
    const body = encodeURIComponent(
      `Hi ${advisor?.name.split(" ")[0] ?? "there"},\n\nCould you give me an update on ${row.studentName}? This flag has been open for ${row.daysSinceFlagged} days.\n\nThanks,\n${user.name}`
    );
    return `mailto:${advisor?.email ?? ""}?subject=${subject}&body=${body}`;
  }

  if (!escalations) {
    return <p className="text-ink-muted text-sm">Loading escalations…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Escalations</h1>
        <p className="text-ink-muted mt-1 max-w-2xl">
          PredictEd reminds the advisor automatically at 7 days. Flags appear here only
          after 14 days — the Coordinator decides whether to act, never automated.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] gap-2 px-5 py-3 text-xs font-medium text-ink-muted border-b border-border">
          <span>Student</span>
          <span>Days flagged</span>
          <span>Cohort advisor</span>
          <span>Risk level</span>
          <span>Actions</span>
        </div>

        {escalations.length === 0 && (
          <p className="px-5 py-6 text-sm text-ink-muted">
            No flags have gone unactioned for 14+ days.
          </p>
        )}

        {escalations.map((row) => (
          <div
            key={row.studentId}
            className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1.2fr] gap-2 px-5 py-3 text-sm items-center border-b border-border last:border-b-0"
          >
            <span>
              <Link
                to={`/students/${row.studentId}`}
                className="text-ink font-medium hover:text-accent transition-colors"
              >
                {row.studentName}
              </Link>
              <span className="block text-xs text-ink-muted mt-0.5">{row.cohortLabel}</span>
            </span>
            <span className="text-ink-muted">{row.daysSinceFlagged} days</span>
            <span className="text-ink-muted">{row.advisorName}</span>
            <span className="flex items-center gap-2">
              <RiskDot tier={row.riskTier} />
              <span className="text-ink-muted">{tierLabel(row.riskTier)}</span>
            </span>
            <span className="flex gap-2">
              <button
                onClick={() => handleReassign(row)}
                className="rounded-lg border border-border px-2.5 py-1 text-xs text-ink hover:border-accent hover:text-accent transition-colors"
              >
                Reassign advisor
              </button>
              <a
                href={contactAdvisorHref(row)}
                className="rounded-lg border border-border px-2.5 py-1 text-xs text-ink hover:border-accent hover:text-accent transition-colors"
              >
                Contact advisor
              </a>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
