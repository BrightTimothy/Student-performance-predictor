import { tierDotClass } from "../utils/riskHelpers";

export default function RiskDot({ tier }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${tierDotClass(tier)}`}
      aria-hidden="true"
    />
  );
}
