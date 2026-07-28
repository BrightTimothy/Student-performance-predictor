import { Link } from "react-router-dom";
import RiskDot from "./RiskDot";
import StatusChip from "./StatusChip";
import { tierLabel } from "../utils/riskHelpers";
import { daysSince } from "../utils/date";
import { initials } from "../utils/text";

const AGE_WARNING_THRESHOLD_DAYS = 5;

// Fixed column widths so every row lines up: avatar, name block, risk, reason
// (flexible), status chip, action button.
const ROW_GRID_COLS = "grid-cols-[2.5rem_15rem_9rem_1fr_8rem_7rem]";

export default function StudentRow({ student, onAction, readOnly = false }) {
  const age = daysSince(student.flaggedDate);
  const showAgeIndicator = student.status === "Needs outreach" && age >= AGE_WARNING_THRESHOLD_DAYS;
  const actionLabel =
    readOnly || student.status === "Resolved"
      ? null
      : student.status === "Needs outreach"
        ? "Reach out"
        : "Resolve";

  return (
    <div
      className={`grid ${ROW_GRID_COLS} gap-4 items-stretch bg-surface border border-border rounded-2xl px-4 min-h-[88px]`}
    >
      <div className="flex items-center">
        <div className="h-10 w-10 shrink-0 rounded-full bg-[#EAE6DF] text-ink flex items-center justify-center text-sm font-medium">
          {initials(student.name)}
        </div>
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <Link
          to={`/students/${student.id}`}
          className="font-medium text-ink hover:text-accent transition-colors truncate"
        >
          {student.name}
        </Link>
        <p className="text-xs text-ink-muted mt-0.5 truncate">
          {student.studentId} · {student.level}
          {student.carriedFrom && ` · carrying ${student.carriedFrom} course(s)`}
        </p>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <RiskDot tier={student.riskTier} />
        <span className="text-sm text-ink truncate">{tierLabel(student.riskTier)}</span>
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <p className="text-sm text-ink-muted">{student.reason}</p>
        {showAgeIndicator && (
          <p className="text-xs text-ink-muted/80 mt-0.5">
            Awaiting outreach · {age} days
          </p>
        )}
      </div>

      <div className="flex items-center">
        <StatusChip status={student.status} className="w-full justify-center" />
      </div>

      <div className="flex items-center">
        {actionLabel && (
          <button
            onClick={() => onAction?.(student)}
            className="w-full rounded-lg border border-border px-3 py-1.5 text-sm text-ink hover:border-accent hover:text-accent transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
