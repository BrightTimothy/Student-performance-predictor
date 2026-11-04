import { tierLabel, tierLabelClass, tierOrdinal } from "../utils/riskHelpers";

const CX = 50;
const CY = 54;
const R = 42;
const NEEDLE_LEN = 32;

function toXY(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy - r * Math.sin(rad)];
}

function arcPath(cx, cy, r, startDeg, endDeg) {
  const [x1, y1] = toXY(cx, cy, r, startDeg);
  const [x2, y2] = toXY(cx, cy, r, endDeg);
  return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
}

export default function RiskGauge({ tier, score }) {
  // Three equal 60° segments (low/medium/high); the needle position is
  // driven by the numeric score, but the tier label is what actually
  // matters — the number is secondary, shown small underneath.
  const needleDeg = 180 - (Math.max(0, Math.min(100, score)) / 100) * 180;
  const [nx, ny] = toXY(CX, CY, NEEDLE_LEN, needleDeg);

  return (
    <div className="bg-card border border-border rounded-md p-5 flex items-center gap-6">
      <svg viewBox="0 0 100 62" className="w-40 shrink-0">
        <path d={arcPath(CX, CY, R, 180, 120)} className="stroke-risk-low-bg" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d={arcPath(CX, CY, R, 120, 60)} className="stroke-risk-med-bg" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d={arcPath(CX, CY, R, 60, 0)} className="stroke-risk-high-bg" strokeWidth="10" fill="none" strokeLinecap="round" />
        <line x1={CX} y1={CY} x2={nx} y2={ny} className="stroke-text" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={CX} cy={CY} r="3.5" className="fill-text" />
      </svg>
      <div>
        <div className={`text-2xl font-extrabold ${tierLabelClass(tier)}`}>{tierLabel(tier)}</div>
        <div className="text-xs text-text-faint mt-1.5">
          Tier {tierOrdinal(tier)} of 3 · reviewed today
        </div>
      </div>
    </div>
  );
}
