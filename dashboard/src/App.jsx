import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import StudentProfile from "./pages/StudentProfile";
import WeeklyDigest from "./pages/WeeklyDigest";
import Settings from "./pages/Settings";
import CoordinatorOverview from "./pages/CoordinatorOverview";
import CoordinatorCoverage from "./pages/CoordinatorCoverage";
import CoordinatorEscalations from "./pages/CoordinatorEscalations";

function Home() {
  const { user } = useAuth();
  return user.role === "advisor" ? <AdvisorDashboard /> : <CoordinatorOverview />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/digest" element={<WeeklyDigest />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/students/:id" element={<StudentProfile />} />
          <Route path="/coverage" element={<CoordinatorCoverage />} />
          <Route path="/escalations" element={<CoordinatorEscalations />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
