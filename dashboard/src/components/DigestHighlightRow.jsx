import { Link } from "react-router-dom";
import StatusChip from "./StatusChip";
import { initials } from "../utils/text";

export default function DigestHighlightRow({ item }) {
  return (
    <div className="flex items-center gap-4 bg-card border border-border rounded-md px-4 py-3.5 mb-2.5">
      <div className="h-9 w-9 shrink-0 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-xs font-bold">
        {initials(item.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold text-text truncate">{item.name}</div>
        <div className="text-xs text-text-faint truncate">{item.meta}</div>
      </div>

      <StatusChip status={item.chipStatus} label={item.chipLabel} className="shrink-0" />

      <Link
        to={`/students/${item.id}`}
        className="shrink-0 rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-text hover:border-accent hover:text-accent-dark transition-colors"
      >
        View
      </Link>
    </div>
  );
}
