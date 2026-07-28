import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as studentsService from "../services/studentsService";
import { predictRisk } from "../services/api";
import { useAuth } from "../context/AuthContext";
import BursaryChip from "../components/BursaryChip";
import RiskGauge from "../components/RiskGauge";
import ReasonBar from "../components/ReasonBar";
import EngagementChart from "../components/EngagementChart";
import InterventionTimeline from "../components/InterventionTimeline";
import { initials } from "../utils/text";
import { ADVISORS, cohortLabel } from "../data/mockOrg";

export default function StudentProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const isAdvisor = user.role === "advisor";
  const [student, setStudent] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refresh() {
    const data = await studentsService.getStudentById(id);
    setStudent(data);
    setIsLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!student) return;
    let cancelled = false;
    setPredictionError(null);
    setPrediction(null);
    predictRisk(student.features)
      .then((result) => {
        if (!cancelled) setPrediction(result);
      })
      .catch((err) => {
        if (!cancelled) setPredictionError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [student]);

  async function handleResolve() {
    await studentsService.updateStudentStatus(user.role, id, "Resolved");
    refresh();
  }

  if (isLoading) {
    return <p className="text-ink-muted text-sm">Loading student…</p>;
  }

  if (!student) {
    return <p className="text-ink-muted text-sm">Student not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-[#EAE6DF] text-ink flex items-center justify-center text-lg font-medium shrink-0">
            {initials(student.name)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">{student.name}</h1>
            <p className="text-sm text-ink-muted mt-0.5">
              {student.studentId} · {cohortLabel(student.departmentId, student.level)}
            </p>
            {student.carriedFrom && (
              <p className="text-xs text-ink-muted/80 mt-0.5">
                Registered {student.level} · carrying course(s) from {student.carriedFrom}
              </p>
            )}
          </div>
        </div>
        <div>
          <BursaryChip cleared={student.bursaryCleared} />
          {!student.bursaryCleared && (
            <p className="text-xs text-ink-muted mt-1 max-w-[16rem] text-right">
              Consider referring to bursary support.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {isAdvisor ? (
          <>
            <Link
              to={`/students/${student.id}/intervention`}
              className="rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent-hover transition-colors"
            >
              Log intervention
            </Link>
            <a
              href={`mailto:?subject=Checking in&body=Hi ${student.name.split(" ")[0]},`}
              className="rounded-lg border border-border text-sm font-medium px-4 py-2 text-ink hover:border-accent hover:text-accent transition-colors"
            >
              Send email
            </a>
            {student.status !== "Resolved" && (
              <button
                onClick={handleResolve}
                className="rounded-lg border border-border text-sm font-medium px-4 py-2 text-ink hover:border-accent hover:text-accent transition-colors"
              >
                Mark resolved
              </button>
            )}
          </>
        ) : (
          (() => {
            const advisor = ADVISORS.find((a) => a.id === student.advisorId);
            const subject = encodeURIComponent(`Following up on ${student.name}`);
            const body = encodeURIComponent(
              `Hi ${advisor?.name.split(" ")[0] ?? "there"},\n\nCould you give me an update on ${student.name} (${student.studentId})? I saw they're flagged and wanted to check how things are going.\n\nThanks,\n${user.name}`
            );
            return (
              <a
                href={`mailto:${advisor?.email ?? ""}?subject=${subject}&body=${body}`}
                className="rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent-hover transition-colors"
              >
                Message advisor
              </a>
            );
          })()
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="text-sm font-medium text-ink-muted mb-4">Risk</h2>
          {predictionError && (
            <p className="text-sm text-risk-critical">
              Couldn't reach the prediction service: {predictionError}
            </p>
          )}
          {!predictionError && !prediction && (
            <p className="text-sm text-ink-muted">Scoring student…</p>
          )}
          {prediction && (
            <div className="flex items-center gap-6">
              <RiskGauge score={prediction.risk_score} tier={prediction.risk_tier} />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-6">
                  <span className="text-ink-muted">Days since last login</span>
                  <span className="text-ink font-medium">{student.lastLoginDaysAgo}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-ink-muted">Active days this term</span>
                  <span className="text-ink font-medium">{student.features.num_active_days}</span>
                </div>
                <div className="flex justify-between gap-6">
                  <span className="text-ink-muted">Submissions</span>
                  <span className="text-ink font-medium">{student.features.number_of_takes}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="text-sm font-medium text-ink-muted mb-4">Engagement this term</h2>
          <EngagementChart data={student.engagementTrend} />
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="text-sm font-medium text-ink mb-0.5">Why flagged</h2>
          <p className="text-xs text-ink-muted mb-4">Based on academic signals only</p>
          {predictionError && (
            <p className="text-sm text-ink-muted">Unavailable right now.</p>
          )}
          {!predictionError && !prediction && (
            <p className="text-sm text-ink-muted">Loading reasons…</p>
          )}
          {prediction && (
            <div className="space-y-3">
              {prediction.top_reasons.map((reason, i) => (
                <ReasonBar
                  key={reason.feature}
                  feature={reason.feature}
                  impact={reason.impact}
                  rank={i}
                />
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <h2 className="text-sm font-medium text-ink mb-4">Intervention log</h2>
          <InterventionTimeline interventions={student.interventions} />
        </div>
      </div>
    </div>
  );
}
