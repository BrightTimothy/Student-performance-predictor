// Central place for translating the model's risk_tier vocabulary
// ("Safe" | "Watch" | "At-Risk" | "Critical") into calm, plain-English UI.

const TIER_ORDER = ["Critical", "At-Risk", "Watch", "Safe"];

const TIER_LABELS = {
  Critical: "Needs attention",
  "At-Risk": "Needs attention",
  Watch: "Keep an eye on",
  Safe: "Doing well",
};

// Muted dot colors only — never used as row/background washes.
const TIER_DOT_COLORS = {
  Critical: "var(--color-risk-critical)",
  "At-Risk": "var(--color-risk-critical)",
  Watch: "var(--color-risk-amber)",
  Safe: "var(--color-risk-green)",
};

export function tierRank(tier) {
  const idx = TIER_ORDER.indexOf(tier);
  return idx === -1 ? TIER_ORDER.length : idx;
}

export function tierLabel(tier) {
  return TIER_LABELS[tier] ?? tier;
}

export function tierDotColor(tier) {
  return TIER_DOT_COLORS[tier] ?? "var(--color-ink-muted)";
}

export function needsAttention(tier) {
  return tier === "Critical" || tier === "At-Risk";
}
