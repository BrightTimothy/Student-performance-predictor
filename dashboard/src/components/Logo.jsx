// Single source of truth for the PredictEd wordmark — used on the Login
// page and in the Sidebar. Text-only, with a graduation cap resting on
// top of the "P" (same idea as Moodle's cap over the "m").
const SIZES = {
  sm: { text: "text-lg", cap: "w-6 h-4", capOffset: "-top-3" },
  lg: { text: "text-3xl", cap: "w-11 h-[29.3px]", capOffset: "-top-6" },
};

export default function Logo({ size = "sm", className = "" }) {
  const { text, cap, capOffset } = SIZES[size];

  return (
    <span className={`inline-flex items-baseline font-extrabold text-text ${text} ${className}`}>
      <span className="relative inline-block">
        <svg
          viewBox="0 0 24 16"
          className={`absolute left-1/2 -translate-x-1/2 -rotate-[10deg] ${capOffset} ${cap} text-accent`}
          fill="currentColor"
        >
          <path d="M12 0L24 5.5L12 11L0 5.5Z" />
          <path d="M8 8V12.5C8 14 9.8 15 12 15s4-1 4-2.5V8L12 11Z" />
          <path
            d="M22 6.2V11.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="22" cy="12.6" r="1.2" />
        </svg>
        P
      </span>
      redictEd
    </span>
  );
}
