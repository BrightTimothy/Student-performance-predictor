import { useNavigate } from "react-router-dom";
import RiskDot from "./RiskDot";
import StatusChip from "./StatusChip";
import { OVERDUE_THRESHOLD_DAYS, tierLabel, tierLabelClass } from "../utils/riskHelpers";
import { daysSince } from "../utils/date";
import { initials } from "../utils/text";

function awaitingNote(student) {
  if (student.status === "Flagged") {
    const days = daysSince(student.flaggedDate);
    return {
      text: `awaiting outreach · ${days} day${days === 1 ? "" : "s"}`,
      overdue: days >= OVERDUE_THRESHOLD_DAYS,
    };
  }
  if (student.status === "Contacted") {
    const days = daysSince(student.contactedDate);
    return { text: `reply pending · ${days} day${days === 1 ? "" : "s"}`, overdue: false };
  }
  const days = daysSince(student.resolvedDate);
  return {
    text: days === 0 ? "closed just now" : `closed ${days} day${days === 1 ? "" : "s"} ago`,
    overdue: false,
  };
}

export default function StudentRow({ student }) {
  const navigate = useNavigate();
  const note = awaitingNote(student);
  const levelShort = student.level.replace(" Level", "L");

  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-md px-4 py-3.5 mb-2.5">
      <div className="h-9 w-9 shrink-0 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-xs font-bold">
        {initials(student.name)}
      </div>

      <div className="w-44 shrink-0 min-w-0">
        <div className="text-sm font-bold text-text truncate">{student.name}</div>
        <div className="text-xs text-text-faint truncate">
          {student.course} · {levelShort}
        </div>
      </div>

      <div className="flex items-center gap-2 w-32 shrink-0">
        <RiskDot tier={student.riskTier} />
        <span className={`text-sm font-bold ${tierLabelClass(student.riskTier)}`}>
          {tierLabel(student.riskTier)}
        </span>
      </div>

      <div className="flex-1 min-w-0 text-sm text-text-soft">{student.reason}</div>

      <StatusChip status={student.status} className="shrink-0" />

      <span
        className={`text-xs w-44 shrink-0 whitespace-nowrap ${note.overdue ? "text-risk-high font-semibold" : "text-text-faint"}`}
      >
        {note.text}
      </span>

      <button
        onClick={() => navigate(`/students/${student.id}`)}
        className="shrink-0 rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-text hover:border-accent hover:text-accent-dark transition-colors"
      >
        View
      </button>
    </div>
  );
}
