import { statusChipClass } from "../utils/riskHelpers";

export default function StatusChip({ status, label, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-24 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${statusChipClass(status)} ${className}`}
    >
      {label ?? status}
    </span>
  );
}
