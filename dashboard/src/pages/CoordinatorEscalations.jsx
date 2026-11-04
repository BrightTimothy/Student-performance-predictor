import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as coordinatorService from "../services/coordinatorService";
import Toast from "../components/Toast";
import { initials } from "../utils/text";

const TOAST_DURATION_MS = 3000;

export default function CoordinatorEscalations() {
  const { user } = useAuth();
  const [escalations, setEscalations] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    coordinatorService.getEscalations(user.departmentId).then(setEscalations);
  }, [user.departmentId]);

  function handleMessageAdvisor(advisorName) {
    setToastMessage(`Message sent to ${advisorName}`);
    setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  }

  if (!escalations) {
    return <p className="text-text-soft text-sm">Loading escalations…</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-text mb-0.5">Escalations</h1>
        <p className="text-sm text-text-soft">Unactioned 14+ days · reminded advisor at day 7</p>
      </div>

      {escalations.length === 0 ? (
        <p className="text-sm text-text-soft py-8 text-center">
          Nothing has gone unactioned 14+ days right now.
        </p>
      ) : (
        <div className="space-y-2.5">
          {escalations.map((item) => (
            <div
              key={item.studentId}
              className="flex items-center gap-4 bg-card border border-border rounded-md px-4 py-3.5"
            >
              <div className="h-9 w-9 shrink-0 rounded-full bg-accent-soft text-accent-dark flex items-center justify-center text-xs font-bold">
                {initials(item.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-text truncate">{item.name}</div>
                <div className="text-xs text-text-faint truncate">
                  {item.cohortLabel} · Advisor: {item.advisorName}
                </div>
              </div>

              <span className="shrink-0 rounded-full bg-risk-high-bg text-risk-high text-xs font-bold px-3 py-1 whitespace-nowrap">
                {item.daysUnactioned} days unactioned
              </span>

              <button
                onClick={() => handleMessageAdvisor(item.advisorName)}
                className="shrink-0 rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-text hover:border-accent hover:text-accent-dark transition-colors"
              >
                Message advisor
              </button>
            </div>
          ))}
        </div>
      )}

      <Toast message={toastMessage} />
    </div>
  );
}
