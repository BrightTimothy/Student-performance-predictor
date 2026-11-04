// Deliberately quiet and neutral — same visual weight as a metadata
// label, never a status alert. Never risk-colored, regardless of value.
export default function BursaryChip({ cleared }) {
  return (
    <span className="inline-flex items-center bg-neutral-bg text-neutral-text text-xs font-bold px-3 py-1.5 rounded-full">
      Bursary: {cleared ? "Cleared" : "Not cleared"}
    </span>
  );
}
