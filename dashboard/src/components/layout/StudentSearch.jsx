import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import * as studentsService from "../../services/studentsService";

const MAX_RESULTS = 6;

export default function StudentSearch() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    studentsService.getStudentsByAdvisor(user.id).then(setStudents);
  }, [user.id]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();
  const matches = trimmed
    ? students.filter((s) => s.name.toLowerCase().includes(trimmed)).slice(0, MAX_RESULTS)
    : [];

  function handleSelect(student) {
    setQuery("");
    setIsOpen(false);
    navigate(`/students/${student.id}`);
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="flex items-center gap-2 bg-[#F5F2EB] rounded-full px-4 py-2 text-text-faint text-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 stroke-current fill-none shrink-0"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search students…"
          className="flex-1 bg-transparent outline-none text-text placeholder:text-text-faint"
        />
      </div>

      {isOpen && trimmed && (
        <div className="absolute left-0 right-0 mt-2 bg-card border border-border shadow-soft rounded-md overflow-hidden z-50">
          {matches.length === 0 ? (
            <p className="px-4 py-3 text-sm text-text-soft">No students match "{query.trim()}"</p>
          ) : (
            matches.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-border-soft transition-colors"
              >
                <span className="text-sm font-semibold text-text">{s.name}</span>
                <span className="text-xs text-text-faint whitespace-nowrap">
                  {s.course} · {s.level.replace(" Level", "L")}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
