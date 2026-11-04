// Central place for the reference's risk vocabulary: 3 tiers (High/Medium/
// Low — not 4), each with an exact color from tokens.css. Risk color is
// used only as a dot, label text, or status-chip background — never a
// row/card background wash (see components.css .student-row).

const TIER_ORDER = ["High", "Medium", "Low"];

// The 7-day mark is when PredictEd's automatic advisor reminder fires.
// "Approaching" (5-6 days) is a calm heads-up before that; "overdue" (7+)
// is when a row's note gets a small color emphasis.
export const APPROACHING_THRESHOLD_DAYS = 5;
export const OVERDUE_THRESHOLD_DAYS = 7;

export function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return idx === -1 ? TIER_ORDER.length : idx;
}

export function tierLabel(tier) {
  return `${tier} risk`;
}

// "Tier 3 of 3" style ordinal used on the profile gauge — the label
// ("High risk") is the primary readout; this is the small secondary one.
const TIER_ORDINAL = { High: 3, Medium: 2, Low: 1 };

export function tierOrdinal(tier) {
  return TIER_ORDINAL[tier] ?? 0;
}

const TIER_DOT_CLASSES = {
  High: "bg-risk-high",
  Medium: "bg-risk-med",
  Low: "bg-risk-low",
};

export function tierDotClass(tier) {
  return TIER_DOT_CLASSES[tier] ?? "bg-text-faint";
}

const TIER_LABEL_CLASSES = {
  High: "text-risk-high",
  Medium: "text-risk-med",
  Low: "text-risk-low",
};

export function tierLabelClass(tier) {
  return TIER_LABEL_CLASSES[tier] ?? "text-text-faint";
}

// Solid fill color for the "why flagged" reason bars (components.css
// .reason-fill) — distinct from the muted dot/label colors above.
const TIER_FILL_CLASSES = {
  High: "bg-risk-high",
  Medium: "bg-risk-med",
  Low: "bg-risk-low",
};

export function tierFillClass(tier) {
  return TIER_FILL_CLASSES[tier] ?? "bg-text-faint";
}

// Reason bars pick their own color by how significant that one signal is,
// not by the student's overall tier — a 40%-weight signal reads as medium
// even for a High-risk student.
export function fillClassForPercent(percent) {
  if (percent >= 70) return TIER_FILL_CLASSES.High;
  if (percent >= 40) return TIER_FILL_CLASSES.Medium;
  return TIER_FILL_CLASSES.Low;
}

// A whole cohort's flagged rate runs far lower than any single reason
// bar's weight ever would (a "bad" level might be ~50%; a "bad" reason
// bar is ~90%) — separate thresholds for the Cohort Risk Overview bars.
export function levelFlaggedFillClass(percent) {
  if (percent >= 45) return TIER_FILL_CLASSES.High;
  if (percent >= 20) return TIER_FILL_CLASSES.Medium;
  return TIER_FILL_CLASSES.Low;
}

const STATUS_CHIP_CLASSES = {
  Flagged: "bg-risk-high-bg text-risk-high",
  Contacted: "bg-accent-soft text-accent-dark",
  Resolved: "bg-risk-low-bg text-risk-low",
};

export function statusChipClass(status) {
  return STATUS_CHIP_CLASSES[status] ?? "bg-neutral-bg text-neutral-text";
}
