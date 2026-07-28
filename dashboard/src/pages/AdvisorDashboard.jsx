import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as studentsService from "../services/studentsService";
import SummaryCard from "../components/SummaryCard";
import FilterBar from "../components/FilterBar";
import StudentRow from "../components/StudentRow";
import { tierRank, needsAttention } from "../utils/riskHelpers";
import { daysSince } from "../utils/date";

const DEFAULT_FILTERS = { risk: "all", status: "all" };

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  async function refresh() {
    const data = await studentsService.getStudentsByAdvisor(user.id);
    setStudents(data);
    setIsLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        if (filters.risk === "all") return true;
        if (filters.risk === "attention") return needsAttention(s.riskTier);
        if (filters.risk === "watch") return s.riskTier === "Watch";
        if (filters.risk === "safe") return s.riskTier === "Safe";
        return true;
      })
      .filter((s) => filters.status === "all" || s.status === filters.status)
      .sort((a, b) => {
        const rankDiff = tierRank(a.riskTier) - tierRank(b.riskTier);
        if (rankDiff !== 0) return rankDiff;
        if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
        return daysSince(b.flaggedDate) - daysSince(a.flaggedDate);
      });
  }, [students, filters]);

  const summary = useMemo(() => {
    const needingAttention = students.filter(
      (s) => needsAttention(s.riskTier) && s.status !== "Resolved"
    ).length;
    const newThisWeek = students.filter((s) => daysSince(s.flaggedDate) <= 7).length;
    const reachedOut = students.filter(
      (s) => s.status === "Contacted" || s.status === "Resolved"
    ).length;
    return { needingAttention, newThisWeek, reachedOut };
  }, [students]);

  async function handleAction(student) {
    if (student.status === "Needs outreach") {
      navigate(`/students/${student.id}/intervention`);
      return;
    }
    if (student.status === "Contacted") {
      await studentsService.updateStudentStatus(user.role, student.id, "Resolved");
      refresh();
    }
  }

  if (isLoading) {
    return <p className="text-ink-muted text-sm">Loading your cohort…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">
          {greeting()}, {user.name.split(" ")[0]}
        </h1>
        <p className="text-ink-muted mt-1">{user.cohortLabel}</p>
        <p className="text-sm text-ink-muted mt-2">
          {students.length} students in your cohort · {summary.needingAttention} need attention
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Students needing attention" value={summary.needingAttention} />
        <SummaryCard label="New this week" value={summary.newThisWeek} />
        <SummaryCard label="Reached out to" value={summary.reachedOut} />
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-sm text-ink-muted py-8 text-center">
            No students match these filters.
          </p>
        )}
        {filtered.map((student) => (
          <StudentRow key={student.id} student={student} onAction={handleAction} />
        ))}
      </div>
    </div>
  );
}
