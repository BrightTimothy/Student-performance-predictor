import { tierDotColor } from "../utils/riskHelpers";

export default function RiskDot({ tier, className = "" }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${className}`}
      style={{ backgroundColor: tierDotColor(tier) }}
      aria-hidden="true"
    />
  );
}
