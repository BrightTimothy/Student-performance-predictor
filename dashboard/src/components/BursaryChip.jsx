// Deliberately quiet and neutral — never styled as a risk indicator.
export default function BursaryChip({ cleared }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#EFEDE8] text-ink-muted px-3 py-1 text-xs font-medium">
      Bursary: {cleared ? "Cleared" : "Not cleared"}
    </span>
  );
}
