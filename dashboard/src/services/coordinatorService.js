import { STUDENTS } from "../data/mockStudents";
import { ADVISORS, LEVELS, getAdvisorById, getDepartmentById } from "../data/mockOrg";
import { daysSince } from "../utils/date";
import { OVERDUE_THRESHOLD_DAYS } from "../utils/riskHelpers";

// PredictEd reminds the advisor automatically at day 7 (that reminder is
// a backend concern, not built here). A flag only surfaces to the HOD
// once it's gone unactioned this long — the coordinator never sees it
// any earlier, and never triggers the escalation manually.
const ESCALATION_THRESHOLD_DAYS = 14;

const DELAY_MS = 200;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

const TREND_WEEKS = 6;

// Department Overview is read-only oversight — every function here only
// ever aggregates/reads STUDENTS, never mutates it. There is no
// coordinator-facing mutator anywhere in this file, on purpose: the HOD
// sees everything and acts on nothing (Message advisor, Phase 9, is the
// one exception, and that doesn't touch a student record either).
export async function getDepartmentOverview(departmentId) {
  const department = getDepartmentById(departmentId);
  const advisors = ADVISORS.filter((a) => a.departmentId === departmentId);
  const students = STUDENTS.filter((s) => s.departmentId === departmentId);

  const studentCount = advisors.reduce((sum, a) => sum + a.cohortSize, 0);
  // "Flagged" here matches the same definition the Advisor Dashboard uses
  // for its own Flagged card: currently open cases (not yet resolved),
  // not a raw risk-tier count.
  const totalFlagged = students.filter((s) => s.status === "Flagged" || s.status === "Contacted").length;
  const awaitingOutreach = students.filter((s) => s.status === "Flagged").length;

  const responseTimes = students
    .filter((s) => s.contactedDate)
    .map((s) => daysSince(s.flaggedDate) - daysSince(s.contactedDate))
    .filter((days) => days >= 0);
  const avgResponseDays = responseTimes.length
    ? responseTimes.reduce((sum, d) => sum + d, 0) / responseTimes.length
    : 0;

  // Real data, bucketed by week — not an invented series. Each student's
  // actual flaggedDate lands in exactly one "weeks ago" bucket.
  const trend = Array.from({ length: TREND_WEEKS }, (_, i) => {
    const weeksAgo = TREND_WEEKS - 1 - i;
    const flagged = students.filter((s) => {
      const days = daysSince(s.flaggedDate);
      return days >= weeksAgo * 7 && days < (weeksAgo + 1) * 7;
    }).length;
    return { week: `W${i + 1}`, flagged };
  });

  // "Cohort Risk Overview" — one row per level, ordered 100L to 400L,
  // never by advisor name or a ranking score (see the framing caption on
  // the page itself: this is a stage effect, not advisor performance).
  const levelBreakdown = LEVELS.map((level) => {
    const advisor = advisors.find((a) => a.level === level);
    if (!advisor) return null;
    const cohort = students.filter((s) => s.level === level);
    return {
      level,
      levelShort: level.replace(" Level", "L"),
      advisorName: advisor.name,
      flaggedCount: cohort.length,
      flaggedPct: advisor.cohortSize ? Math.round((cohort.length / advisor.cohortSize) * 100) : 0,
    };
  }).filter(Boolean);

  return delay({
    departmentName: department.name,
    levelCount: advisors.length,
    advisorCount: advisors.length,
    studentCount,
    totalFlagged,
    awaitingOutreach,
    avgResponseDays,
    trend,
    levelBreakdown,
  });
}

// A cohort with several long-unactioned flags may mean the advisor is
// overloaded, not underperforming — this is the only signal the "May
// need support" label is based on, and it's never shown as a number,
// rank, or red flag on the advisor's name itself.
const SUPPORT_THRESHOLD_AWAITING = 4;

// "Outreach coverage" — one row per advisor, ordered 100L to 400L (same
// rule as the Cohort Risk Overview: never sorted by flagged count or any
// other metric, so the table itself can't read as a leaderboard).
export async function getOutreachCoverage(departmentId) {
  const department = getDepartmentById(departmentId);
  const advisors = ADVISORS.filter((a) => a.departmentId === departmentId).sort(
    (a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level)
  );

  return delay(
    advisors.map((advisor) => {
      const cohort = STUDENTS.filter((s) => s.advisorId === advisor.id);
      const flaggedCount = cohort.filter((s) => s.status === "Flagged" || s.status === "Contacted").length;
      const awaitingOver7 = cohort.filter(
        (s) => s.status === "Flagged" && daysSince(s.flaggedDate) >= OVERDUE_THRESHOLD_DAYS
      ).length;

      return {
        advisorId: advisor.id,
        advisorName: advisor.name,
        cohortLabel: `${department.code} · ${advisor.level.replace(" Level", "L")}`,
        cohortSize: advisor.cohortSize,
        flaggedCount,
        awaitingOver7,
        status: awaitingOver7 >= SUPPORT_THRESHOLD_AWAITING ? "May need support" : "On track",
      };
    })
  );
}

// Escalations — students still unactioned 14+ days after being flagged.
// Read-only: this only reads STUDENTS to build the list. The one action
// this screen has (Message advisor) is handled entirely client-side by
// the page itself and never touches a student or advisor record.
export async function getEscalations(departmentId) {
  const department = getDepartmentById(departmentId);
  const students = STUDENTS.filter((s) => s.departmentId === departmentId);

  const escalated = students
    .filter((s) => s.status === "Flagged" && daysSince(s.flaggedDate) >= ESCALATION_THRESHOLD_DAYS)
    .map((s) => ({
      studentId: s.id,
      name: s.name,
      cohortLabel: `${department.code} · ${s.level.replace(" Level", "L")}`,
      advisorId: s.advisorId,
      advisorName: getAdvisorById(s.advisorId)?.name ?? "Unassigned",
      daysUnactioned: daysSince(s.flaggedDate),
    }))
    .sort((a, b) => b.daysUnactioned - a.daysUnactioned);

  return delay(escalated);
}
