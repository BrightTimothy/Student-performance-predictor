import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import StudentSearch from "./StudentSearch";
import NotificationsMenu from "./NotificationsMenu";
import UserMenu from "./UserMenu";
import Avatar from "../Avatar";

// The student search bar only makes sense where students are the
// subject — the cohort list and an individual profile. Settings, the
// digest, etc. get a quiet header instead of a search box that has
// nothing to search.
function isStudentContextPage(pathname) {
  return pathname === "/" || pathname.startsWith("/students/");
}

export default function AppLayout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  // Search is scoped to an advisor's own cohort — a coordinator's session
  // isn't an advisor id, so there's nothing for it to search yet.
  const showSearch = user.role === "advisor" && isStudentContextPage(pathname);

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-3.5 px-6 py-3.5 border-b border-border bg-card">
          {showSearch ? <StudentSearch /> : <div className="flex-1" />}

          <NotificationsMenu />

          <UserMenu
            trigger={<Avatar name={user.name} avatarUrl={user.avatarUrl} className="h-9 w-9 text-xs" />}
            panelClassName="right-0 top-full mt-2"
          />
        </div>

        <main className="flex-1 px-8 py-7">
          <div className="max-w-[1700px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
