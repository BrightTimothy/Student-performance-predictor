import { formatDate } from "../utils/date";

const TYPE_LABELS = {
  email: "Email sent",
  meeting: "Meeting held",
  "referred to support service": "Referred to support service",
};

export default function InterventionTimeline({ interventions }) {
  if (!interventions.length) {
    return (
      <p className="text-sm text-ink-muted">
        No interventions logged yet for this student.
      </p>
    );
  }

  return (
    <ol className="space-y-4">
      {interventions.map((entry) => (
        <li key={entry.id} className="flex gap-3">
          <div className="flex flex-col items-center pt-1">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="w-px flex-1 bg-border" />
          </div>
          <div className="pb-1">
            <p className="text-sm font-medium text-ink">
              {TYPE_LABELS[entry.type] ?? entry.type}
            </p>
            <p className="text-xs text-ink-muted mb-1">{formatDate(entry.date)}</p>
            <p className="text-sm text-ink-muted">{entry.notes}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
