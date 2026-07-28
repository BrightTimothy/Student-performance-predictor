import { getStudentsByDepartments } from "./studentsService";
import { ADVISORS, LEVELS, cohortLabel, getAdvisorById } from "../data/mockOrg";
import { daysSince } from "../utils/date";
import { needsAttention } from "../utils/riskHelpers";

const DELAY_MS = 150;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

const ESCALATION_THRESHOLD_DAYS = 14;

// Aggregate metrics across whatever departments are in the coordinator's
// scope (one department for an HOD, all of them for a college-wide role).
export async function getDepartmentOverview(departmentIds) {
  const students = await getStudentsByDepartments(departmentIds);

  const flaggedThisTerm = students.filter((s) => needsAttention(s.riskTier)).length;
  const contactedOrResolved = students.filter(
    (s) => s.status === "Contacted" || s.status === "Resolved"
  ).length;
  const outreachRate = students.length
    ? Math.round((contactedOrResolved / students.length) * 100)
    : 0;
  const improved = students.filter((s) => s.status === "Resolved").length;
  const awaiting14Plus = students.filter(
    (s) => s.status === "Needs outreach" && daysSince(s.flaggedDate) >= ESCALATION_THRESHOLD_DAYS
  ).length;

  // Mocked term-long trend (no historical time-series store yet).
  const trend = Array.from({ length: 10 }, (_, i) => {
    const week = i + 1;
    const flagged = Math.round(2 + week * (flaggedThisTerm / 12));
    const contacted = Math.round(flagged * 0.7);
    const improvedWeek = Math.round(contacted * 0.5);
    return { week: `W${week}`, flagged, contacted, improved: improvedWeek };
  });

  return delay({
    studentCount: students.length,
    flaggedThisTerm,
    outreachRate,
    improved,
    awaiting14Plus,
    trend,
  });
}

function capacityLevel(awaitingOutreach) {
  if (awaitingOutreach >= 5) return "High";
  if (awaitingOutreach >= 3) return "Moderate";
  return "Low";
}

// "Cohort risk overview" — one row per (department, level) cohort in
// scope. This is a stage/cohort lens, not an advisor leaderboard: rows are
// ordered by department then level, never by advisor name or a ranking
// score, and capacity is framed as load, not performance.
export async function getLevelOverview(departmentIds) {
  const students = await getStudentsByDepartments(departmentIds);

  const rows = [];
  for (const departmentId of departmentIds) {
    for (const level of LEVELS) {
      const advisor = ADVISORS.find((a) => a.departmentId === departmentId && a.level === level);
      const cohort = students.filter((s) => s.departmentId === departmentId && s.level === level);
      const flagged = cohort.filter((s) => needsAttention(s.riskTier));
      const awaitingOutreach = cohort.filter((s) => s.status === "Needs outreach");
      const contactedOrResolved = cohort.filter(
        (s) => s.status === "Contacted" || s.status === "Resolved"
      );

      rows.push({
        departmentId,
        level,
        cohortLabel: cohortLabel(departmentId, level),
        advisorId: advisor?.id,
        advisorName: advisor?.name ?? "Unassigned",
        studentCount: cohort.length,
        flaggedCount: flagged.length,
        flaggedPct: cohort.length ? Math.round((flagged.length / cohort.length) * 100) : 0,
        outreachRate: cohort.length
          ? Math.round((contactedOrResolved.length / cohort.length) * 100)
          : 0,
        awaitingOutreachCount: awaitingOutreach.length,
        capacity: capacityLevel(awaitingOutreach.length),
      });
    }
  }

  return delay(rows);
}

export async function getEscalations(departmentIds) {
  const students = await getStudentsByDepartments(departmentIds);

  const escalations = students
    .filter(
      (s) => s.status === "Needs outreach" && daysSince(s.flaggedDate) >= ESCALATION_THRESHOLD_DAYS
    )
    .map((s) => ({
      studentId: s.id,
      studentName: s.name,
      cohortLabel: cohortLabel(s.departmentId, s.level),
      daysSinceFlagged: daysSince(s.flaggedDate),
      advisorName: getAdvisorById(s.advisorId)?.name ?? "Unassigned",
      advisorId: s.advisorId,
      riskTier: s.riskTier,
    }))
    .sort((a, b) => b.daysSinceFlagged - a.daysSinceFlagged);

  return delay(escalations);
}
