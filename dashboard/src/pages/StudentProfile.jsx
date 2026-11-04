import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as studentsService from "../services/studentsService";
import { getDepartmentById } from "../data/mockOrg";
import BursaryChip from "../components/BursaryChip";
import RiskGauge from "../components/RiskGauge";
import ReasonBarsCard from "../components/ReasonBarsCard";
import EngagementTrendCard from "../components/EngagementTrendCard";
import InterventionLogCard from "../components/InterventionLogCard";
import LogInterventionPanel from "../components/LogInterventionPanel";
import Toast from "../components/Toast";
import { initials } from "../utils/text";

const TOAST_DURATION_MS = 3000;

export default function StudentProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [log, setLog] = useState([]);
  const [trend, setTrend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogPanel, setShowLogPanel] = useState(false);
  const [isSavingIntervention, setIsSavingIntervention] = useState(false);
  const [isMarkingResolved, setIsMarkingResolved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  function refreshStudent() {
    return studentsService.getStudentById(id).then(setStudent);
  }

  function refreshLog() {
    return studentsService.getStudentLog(id, user.name).then(setLog);
  }

  useEffect(() => {
    setIsLoading(true);
    studentsService.getStudentById(id).then((data) => {
      setStudent(data);
      setIsLoading(false);
    });
    refreshLog();
    studentsService.getEngagementTrend(id).then(setTrend);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user.name]);

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  }

  async function handleSaveIntervention({ type, notes }) {
    setIsSavingIntervention(true);
    await studentsService.addIntervention(id, { type, notes });
    await Promise.all([refreshStudent(), refreshLog()]);
    setIsSavingIntervention(false);
    setShowLogPanel(false);
    showToast("Saved — marked as contacted");
  }

  async function handleMarkResolved() {
    setIsMarkingResolved(true);
    await studentsService.markResolved(id);
    await Promise.all([refreshStudent(), refreshLog()]);
    setIsMarkingResolved(false);
    showToast("Marked as resolved");
  }

  function handleSendEmail() {
    showToast(`Email drafted to ${student.name.split(" ")[0]}`);
  }

  if (isLoading) {
    return <p className="text-text-soft text-sm">Loading student…</p>;
  }

  if (!student) {
    return <p className="text-text-soft text-sm">Student not found.</p>;
  }

  const levelShort = student.level.replace(" Level", "L");
  const departmentName = getDepartmentById(student.departmentId)?.name ?? "";

  return (
    <div>
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-sm font-bold text-text mb-6 hover:text-accent-dark transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 stroke-current fill-none"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Back to dashboard
      </button>

      <div className="flex gap-8 items-start">
        <div className="w-64 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-base font-bold shrink-0">
              {initials(student.name)}
            </div>
            <div className="min-w-0">
              <div className="text-lg font-extrabold text-text truncate">{student.name}</div>
              <div className="text-xs text-text-faint truncate">{student.studentId}</div>
            </div>
          </div>
          <p className="text-xs text-text-soft mb-4">
            {departmentName}, {levelShort}
          </p>

          <BursaryChip cleared={student.bursaryCleared} />

          {/* Coordinators see everything on this page but act on nothing —
              these actions are advisor-only. This guard is the actual
              enforcement point; don't rely on there being no link to this
              page for the HOD role, since that's incidental, not a guarantee. */}
          {user.role === "advisor" && (
            <div className="mt-6">
              <div className="text-xs font-bold text-text-soft uppercase tracking-wide mb-2.5">
                Actions
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => setShowLogPanel(true)}
                  className="rounded-md border border-border bg-card px-4 py-2.5 text-sm font-bold text-text hover:border-accent hover:text-accent-dark transition-colors"
                >
                  Log intervention
                </button>

                <button
                  onClick={handleSendEmail}
                  className="rounded-md border border-border bg-card px-4 py-2.5 text-sm font-bold text-text hover:border-accent hover:text-accent-dark transition-colors"
                >
                  Send email
                </button>

                <button
                  onClick={handleMarkResolved}
                  disabled={isMarkingResolved || student.status === "Resolved"}
                  className="rounded-md bg-accent text-white px-4 py-2.5 text-sm font-bold hover:bg-accent-dark transition-colors disabled:opacity-60"
                >
                  {isMarkingResolved
                    ? "Marking resolved…"
                    : student.status === "Resolved"
                      ? "Resolved"
                      : "Mark resolved"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <RiskGauge tier={student.riskTier} score={student.riskScore} />
          <ReasonBarsCard reasons={student.reasons} />
          <EngagementTrendCard points={trend} />
          <InterventionLogCard entries={log} />
        </div>
      </div>

      {showLogPanel && (
        <LogInterventionPanel
          student={student}
          isSaving={isSavingIntervention}
          onCancel={() => setShowLogPanel(false)}
          onSave={handleSaveIntervention}
        />
      )}

      <Toast message={toastMessage} />
    </div>
  );
}
