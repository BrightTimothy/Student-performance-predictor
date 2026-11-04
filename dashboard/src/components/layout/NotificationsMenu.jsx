import { useEffect, useRef, useState } from "react";

// Mock only — there's no notifications service yet, just enough to show
// the panel isn't decorative anymore.
const MOCK_NOTIFICATIONS = [
  { id: "n1", text: "Ibrahim Sule has been awaiting outreach for 8 days" },
  { id: "n2", text: "Tunde Balogun flagged — high risk" },
  { id: "n3", text: "Bayo Yusuf marked resolved" },
];

export default function NotificationsMenu() {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="h-9 w-9 rounded-full bg-[#F5F2EB] text-text-soft flex items-center justify-center shrink-0 hover:bg-border-soft transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px] stroke-current fill-none"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 10a6 6 0 0112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" />
          <path d="M10 19a2 2 0 004 0" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border shadow-soft rounded-md overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-border-soft text-xs font-bold text-text-soft uppercase tracking-wide">
            Notifications
          </div>
          {MOCK_NOTIFICATIONS.map((n, i) => (
            <div
              key={n.id}
              className={`px-4 py-3 text-sm text-text ${i === 0 ? "" : "border-t border-border-soft"}`}
            >
              {n.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
