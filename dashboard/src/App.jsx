import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/Login";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import StudentProfile from "./pages/StudentProfile";
import LogIntervention from "./pages/LogIntervention";
import WeeklyDigest from "./pages/WeeklyDigest";
import Settings from "./pages/Settings";
import CoordinatorOverview from "./pages/CoordinatorOverview";
import CoordinatorCohorts from "./pages/CoordinatorCohorts";
import CohortDrilldown from "./pages/CohortDrilldown";
import CoordinatorEscalations from "./pages/CoordinatorEscalations";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "coordinator" ? "/coordinator" : "/dashboard"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={["advisor", "coordinator"]} />}>
        <Route element={<AppLayout />}>
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Advisor-only: acting on a student is never reachable by a
              coordinator, even by navigating straight to the URL. */}
          <Route element={<ProtectedRoute allowedRoles={["advisor"]} />}>
            <Route path="/dashboard" element={<AdvisorDashboard />} />
            <Route path="/digest" element={<WeeklyDigest />} />
            <Route path="/students/:id/intervention" element={<LogIntervention />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["coordinator"]} />}>
            <Route path="/coordinator" element={<CoordinatorOverview />} />
            <Route path="/coordinator/cohorts" element={<CoordinatorCohorts />} />
            <Route path="/coordinator/cohorts/:departmentId/:level" element={<CohortDrilldown />} />
            <Route path="/coordinator/escalations" element={<CoordinatorEscalations />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
