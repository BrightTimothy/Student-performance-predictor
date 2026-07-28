import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/text";

const ADVISOR_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/digest", label: "Weekly digest" },
  { to: "/settings", label: "Settings" },
];

const COORDINATOR_LINKS = [
  { to: "/coordinator", label: "Overview", end: true },
  { to: "/coordinator/cohorts", label: "Cohort risk overview" },
  { to: "/coordinator/escalations", label: "Escalations" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const links = user.role === "coordinator" ? COORDINATOR_LINKS : ADVISOR_LINKS;
  const scopeLine = user.role === "coordinator" ? user.scopeName : user.cohortLabel;

  function handleSignOut() {
    signOut();
    navigate("/login");
  }

  return (
    <aside className="w-60 shrink-0 bg-surface border-r border-border flex flex-col h-screen sticky top-0">
      <div className="px-5 py-5 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-accent text-white flex items-center justify-center text-sm font-semibold">
          P
        </div>
        <span className="font-semibold text-ink">PredictEd</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[#EAF1F6] text-accent font-medium"
                  : "text-ink-muted hover:bg-[#F1EEE8] hover:text-ink"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="h-8 w-8 rounded-full bg-[#EAE6DF] text-ink flex items-center justify-center text-xs font-medium shrink-0">
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-ink truncate">{user.name}</p>
            <p className="text-xs text-ink-muted capitalize truncate">
              {user.role === "coordinator" ? "Coordinator" : "Advisor"} · {scopeLine}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-1 w-full text-left rounded-lg px-2 py-2 text-sm text-ink-muted hover:bg-[#F1EEE8] hover:text-ink transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
