import { tierDotColor } from "../utils/riskHelpers";

const SIZE = 128;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RiskGauge({ score, tier }) {
  const pct = Math.max(0, Math.min(100, score));
  const offset = CIRCUMFERENCE * (1 - pct / 100);
  const color = tierDotColor(tier);

  return (
    <div className="flex flex-col items-center">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="#EDE9E2"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          className="fill-ink"
          style={{ fontSize: 26, fontWeight: 600 }}
        >
          {Math.round(pct)}
        </text>
        <text
          x="50%"
          y="63%"
          textAnchor="middle"
          className="fill-ink-muted"
          style={{ fontSize: 11 }}
        >
          / 100
        </text>
      </svg>
      <p className="mt-2 text-sm font-medium text-ink">{tier}</p>
    </div>
  );
}
