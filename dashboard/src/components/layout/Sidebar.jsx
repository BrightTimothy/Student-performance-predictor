import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "./UserMenu";
import Logo from "../Logo";
import Avatar from "../Avatar";

const GRID_ICON = (
  <>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </>
);

const SETTINGS_ICON = (
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 00-2-1.2L14 3h-4l-.6 2.6a7 7 0 00-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 005 12a7 7 0 00.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2L10 21h4l.6-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
  </>
);

const ADVISOR_NAV_ITEMS = [
  {
    to: "/",
    label: "Dashboard",
    end: true,
    icon: GRID_ICON,
  },
  {
    to: "/digest",
    label: "Weekly digest",
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
  },
  { to: "/settings", label: "Settings", icon: SETTINGS_ICON },
];

const COORDINATOR_NAV_ITEMS = [
  { to: "/", label: "Overview", end: true, icon: GRID_ICON },
  {
    to: "/coverage",
    label: "Outreach coverage",
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17" cy="9" r="2.3" />
        <path d="M15.5 14.2c2.6.4 4.5 2.4 4.5 5.3" />
      </>
    ),
  },
  {
    to: "/escalations",
    label: "Escalations",
    icon: (
      <>
        <path d="M6 10a6 6 0 0112 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10z" />
        <path d="M10 19a2 2 0 004 0" />
      </>
    ),
  },
  { to: "/settings", label: "Settings", icon: SETTINGS_ICON },
];

export default function Sidebar() {
  const { user } = useAuth();
  const navItems = user.role === "coordinator" ? COORDINATOR_NAV_ITEMS : ADVISOR_NAV_ITEMS;

  return (
    <aside className="w-60 shrink-0 bg-[#FCFBF8] border-r border-border flex flex-col h-screen sticky top-0 px-3.5 py-5">
      <div className="flex items-center px-2 pb-6">
        <Logo size="sm" />
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-accent-soft text-accent-dark font-bold"
                  : "text-text-soft font-medium hover:bg-border-soft"
              }`
            }
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] stroke-current fill-none"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {item.icon}
            </svg>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <UserMenu
        trigger={
          <>
            <Avatar name={user.name} avatarUrl={user.avatarUrl} className="h-8 w-8 text-xs" />
            <div className="min-w-0 text-left">
              <div className="text-sm font-semibold text-text truncate">{user.name}</div>
              <div className="text-xs text-text-faint capitalize">{user.role}</div>
            </div>
          </>
        }
        className="mt-auto"
        triggerClassName="flex items-center gap-2 px-1.5 py-2.5 border-t border-border-soft w-full rounded-md hover:bg-border-soft transition-colors"
        panelClassName="left-0 bottom-full mb-2"
      />
    </aside>
  );
}
