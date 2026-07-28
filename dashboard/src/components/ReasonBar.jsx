const DIRECTION_COLOR = {
  "increases risk": "var(--color-risk-critical)",
  "decreases risk": "var(--color-risk-green)",
};

export default function ReasonBar({ feature, impact, rank }) {
  // Purely visual weighting so the top reason reads as the longest bar —
  // the API doesn't return magnitude, only the ranked order and direction.
  const width = 100 - rank * 22;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-ink">{feature}</span>
        <span className="text-ink-muted text-xs">{impact}</span>
      </div>
      <div className="h-2 rounded-full bg-[#EDE9E2] overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            backgroundColor: DIRECTION_COLOR[impact] ?? "var(--color-ink-muted)",
          }}
        />
      </div>
    </div>
  );
}
