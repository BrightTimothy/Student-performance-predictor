// goodDirection: "up" (Contacted/Improved — more is good) or "down"
// (New flags — fewer is good). Delta color follows that, not the raw
// arrow direction: an increase in flags reads as a muted amber/red
// warning, an increase in contacted/improved reads as muted green.
export default function DigestStat({ label, value, lastWeek, goodDirection }) {
  const diff = value - lastWeek;
  const isIncrease = diff > 0;
  const isGood = diff === 0 ? null : goodDirection === "up" ? isIncrease : !isIncrease;
  const colorClass = isGood === null ? "text-text-faint" : isGood ? "text-risk-low" : "text-risk-high";
  const deltaText =
    diff === 0
      ? "No change vs last week"
      : `${isIncrease ? "↑" : "↓"} ${Math.abs(diff)} vs last week`;

  return (
    <div className="flex-1 bg-card border border-border rounded-md px-5 py-4">
      <div className="text-3xl font-extrabold text-text leading-none mb-1.5">{value}</div>
      <div className="text-sm text-text-soft mb-1.5">{label}</div>
      <div className={`text-xs font-bold ${colorClass}`}>{deltaText}</div>
    </div>
  );
}
