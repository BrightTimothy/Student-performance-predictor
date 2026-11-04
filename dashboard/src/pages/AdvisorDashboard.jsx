import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as studentsService from "../services/studentsService";
import SummaryCard from "../components/SummaryCard";
import FilterBar from "../components/FilterBar";
import StudentRow from "../components/StudentRow";
import NeedsAttentionCard from "../components/NeedsAttentionCard";
import RecentActivityCard from "../components/RecentActivityCard";
import { APPROACHING_THRESHOLD_DAYS, OVERDUE_THRESHOLD_DAYS, tierRank } from "../utils/riskHelpers";
import { daysSince } from "../utils/date";

const STATUS_ORDER = { Flagged: 0, Contacted: 1, Resolved: 2 };

function urgencyDays(student) {
  if (student.status === "Flagged") return daysSince(student.flaggedDate);
  if (student.status === "Contacted") return daysSince(student.contactedDate);
  return -daysSince(student.resolvedDate);
}

export default function AdvisorDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    studentsService.getStudentsByAdvisor(user.id).then((data) => {
      setStudents(data);
      setIsLoading(false);
    });
    studentsService.getRecentActivity(user.id).then(setActivity);
  }, [user.id]);

  const counts = useMemo(() => {
    const flagged = students.filter((s) => s.status === "Flagged" || s.status === "Contacted").length;
    const awaitingOutreach = students.filter((s) => s.status === "Flagged").length;
    const resolved = students.filter((s) => s.status === "Resolved").length;
    return { flagged, awaitingOutreach, resolved };
  }, [students]);

  const approachingThreshold = useMemo(() => {
    return students
      .filter(
        (s) =>
          s.status === "Flagged" &&
          daysSince(s.flaggedDate) >= APPROACHING_THRESHOLD_DAYS &&
          daysSince(s.flaggedDate) < OVERDUE_THRESHOLD_DAYS
      )
      .sort((a, b) => daysSince(b.flaggedDate) - daysSince(a.flaggedDate));
  }, [students]);

  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        if (filter === "all") return true;
        if (filter === "awaiting") return s.status === "Flagged";
        return s.riskTier === filter;
      })
      .sort((a, b) => {
        const rankDiff = tierRank(a.riskTier) - tierRank(b.riskTier);
        if (rankDiff !== 0) return rankDiff;
        const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
        if (statusDiff !== 0) return statusDiff;
        return urgencyDays(b) - urgencyDays(a);
      });
  }, [students, filter]);

  if (isLoading) {
    return <p className="text-text-soft text-sm">Loading your cohort…</p>;
  }

  return (
    <div className="flex flex-col min-[1600px]:flex-row gap-8 items-start">
      <div className="flex-1 min-w-0 w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-text mb-0.5">{user.cohortLabel}</h1>
          <p className="text-sm text-text-soft">{user.cohortSize} students · your cohort</p>
        </div>

        <div className="flex gap-4 mb-5">
          <SummaryCard label="Flagged" value={counts.flagged} valueClassName="text-risk-high" />
          <SummaryCard
            label="Awaiting outreach"
            value={counts.awaitingOutreach}
            valueClassName="text-risk-med"
          />
          <SummaryCard
            label="Resolved this term"
            value={counts.resolved}
            valueClassName="text-risk-low"
          />
        </div>

        <FilterBar value={filter} onChange={setFilter} />

        <div className="flex items-center justify-between mt-5 mb-2.5">
          <h2 className="text-sm font-bold text-text-soft uppercase tracking-wide">Ranked by risk</h2>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-text-soft py-8 text-center">
            No students match this filter.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[860px]">
              {filtered.map((student) => (
                <StudentRow key={student.id} student={student} />
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="w-full grid grid-cols-2 gap-5 min-[1600px]:flex min-[1600px]:flex-col min-[1600px]:w-[400px] min-[1600px]:shrink-0 min-[1600px]:sticky min-[1600px]:top-7">
        <NeedsAttentionCard students={approachingThreshold} />
        <RecentActivityCard events={activity} />
      </aside>
    </div>
  );
}
