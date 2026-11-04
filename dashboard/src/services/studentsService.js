import { STUDENTS } from "../data/mockStudents";
import { hashString, mulberry32 } from "../utils/rng";
import { daysSince } from "../utils/date";

const DELAY_MS = 200;

const TREND_BASE_BY_TIER = { High: 70, Medium: 55, Low: 35 };
const TREND_SLOPE_BY_TIER = { High: -6, Medium: -3, Low: 2 };

const OUTREACH_TYPE_TEXT = {
  email: "Email sent",
  call: "Call made",
  "in-person": "In-person meeting logged",
  message: "Message sent",
};

function activityTextForType(type, name) {
  switch (type) {
    case "call":
      return `Call made to ${name}`;
    case "in-person":
      return `In-person meeting logged for ${name}`;
    case "message":
      return `Message sent to ${name}`;
    default:
      return `Email sent to ${name}`;
  }
}

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

export async function getStudentsByAdvisor(advisorId) {
  return delay(STUDENTS.filter((s) => s.advisorId === advisorId));
}

export async function getStudentById(id) {
  return delay(STUDENTS.find((s) => s.id === id));
}

// Derives a reverse-chronological activity feed straight from each
// student's real intervention/flagged/resolved records — same
// `interventions` array the per-student log reads, just phrased "to
// {student}" for this cohort-wide view instead of "by {advisor}".
export async function getRecentActivity(advisorId, limit = 6) {
  const cohort = STUDENTS.filter((s) => s.advisorId === advisorId);
  const events = [];

  for (const s of cohort) {
    if (s.flaggedDate) {
      events.push({
        id: `${s.id}-flagged`,
        text: `${s.name} flagged — ${s.riskTier.toLowerCase()} risk`,
        date: s.flaggedDate,
      });
    }
    for (const entry of s.interventions ?? []) {
      events.push({
        id: `${s.id}-activity-${entry.id}`,
        text: activityTextForType(entry.type, s.name),
        date: entry.date,
      });
    }
    if (s.resolvedDate) {
      events.push({
        id: `${s.id}-resolved`,
        text: `${s.name} marked resolved`,
        date: s.resolvedDate,
      });
    }
  }

  events.sort((a, b) => new Date(b.date) - new Date(a.date));
  return delay(events.slice(0, limit));
}

// Per-student intervention log. Human-logged entries (seeded, or added
// live via the Log Intervention panel) all live on `student.interventions`
// in one consistent shape — plus the two system-generated entries
// (flagged/resolved) that aren't really "logged" by anyone.
export async function getStudentLog(id, advisorName) {
  const s = STUDENTS.find((student) => student.id === id);
  if (!s) return delay([]);

  const entries = [];

  for (const entry of s.interventions ?? []) {
    entries.push({
      id: entry.id,
      text: `${OUTREACH_TYPE_TEXT[entry.type] ?? "Outreach"} by ${advisorName}`,
      sub: entry.notes?.trim() ? entry.notes : "No notes added",
      date: entry.date,
      muted: false,
    });
  }
  if (s.resolvedDate) {
    entries.push({
      id: `${s.id}-log-resolved`,
      text: `Marked resolved by ${advisorName}`,
      sub: "Case closed",
      date: s.resolvedDate,
      muted: false,
    });
  }
  if (s.flaggedDate) {
    entries.push({
      id: `${s.id}-log-flagged`,
      text: `Flagged — ${s.riskTier.toLowerCase()} risk`,
      sub: "Generated automatically",
      date: s.flaggedDate,
      muted: true,
    });
  }

  entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  return delay(entries);
}

// Logs a new intervention against the in-memory mock store and marks the
// student Contacted. Mutates the shared STUDENTS records directly, so any
// page that re-fetches afterwards (e.g. navigating back to the Dashboard)
// sees the change — no separate global store needed for this mock layer.
export async function addIntervention(id, { type, notes }) {
  const student = STUDENTS.find((s) => s.id === id);
  if (!student) return delay(null);

  const entry = {
    id: `${id}-manual-${Date.now()}`,
    type,
    notes,
    date: new Date().toISOString(),
  };

  student.interventions = [entry, ...(student.interventions ?? [])];
  student.status = "Contacted";
  student.contactedDate = entry.date;

  return delay({ ...student });
}

// Marks a student Resolved directly (no intervention entry needed —
// getStudentLog already renders a "Marked resolved by {advisor}" line
// straight from resolvedDate, same as it does for flaggedDate).
export async function markResolved(id) {
  const student = STUDENTS.find((s) => s.id === id);
  if (!student) return delay(null);

  student.status = "Resolved";
  student.resolvedDate = new Date().toISOString();

  return delay({ ...student });
}

// Mock 6-week LMS engagement chart data, shaped by risk tier (declining
// for flagged students, flat/rising for resolved/low-risk). Each point
// carries a real week-of label so hovering the chart shows something
// meaningful, not just a bare number.
export async function getEngagementTrend(id) {
  const s = STUDENTS.find((student) => student.id === id);
  if (!s) return delay([]);

  const rng = mulberry32(hashString(`${id}-trend`));
  const base = TREND_BASE_BY_TIER[s.riskTier] ?? 50;
  const slope = TREND_SLOPE_BY_TIER[s.riskTier] ?? 0;

  const today = new Date();
  const points = Array.from({ length: 6 }, (_, i) => {
    const weeksAgo = 5 - i;
    const wobble = Math.round((rng() - 0.5) * 10);
    const value = Math.max(0, Math.min(100, Math.round(base + slope * i + wobble)));

    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weeksAgo * 7);

    return {
      week: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      value,
    };
  });

  return delay(points);
}

const WEEK_DAYS = 7;

function inWindow(dateStr, minDays, maxDays) {
  if (!dateStr) return false;
  const days = daysSince(dateStr);
  return days >= minDays && days <= maxDays;
}

function contactedInWindow(student, minDays, maxDays) {
  return (student.interventions ?? []).some((entry) => {
    const days = daysSince(entry.date);
    return days >= minDays && days <= maxDays;
  });
}

// Rolling 7-day windows (not calendar Mon-Sun weeks) — "this week" is the
// last 7 days, "last week" is the 7 days before that. Computed straight
// from the same student records the Dashboard and Profile pages use, so
// the digest is never a separate, driftable dataset.
export async function getWeeklyDigest(advisorId) {
  const cohort = STUDENTS.filter((s) => s.advisorId === advisorId);

  const newFlags = {
    thisWeek: cohort.filter((s) => inWindow(s.flaggedDate, 0, WEEK_DAYS)).length,
    lastWeek: cohort.filter((s) => inWindow(s.flaggedDate, WEEK_DAYS + 1, WEEK_DAYS * 2)).length,
  };

  const contacted = {
    thisWeek: cohort.filter((s) => contactedInWindow(s, 0, WEEK_DAYS)).length,
    lastWeek: cohort.filter((s) => contactedInWindow(s, WEEK_DAYS + 1, WEEK_DAYS * 2)).length,
  };

  const improved = {
    thisWeek: cohort.filter((s) => s.status === "Resolved" && inWindow(s.resolvedDate, 0, WEEK_DAYS)).length,
    lastWeek: cohort.filter(
      (s) => s.status === "Resolved" && inWindow(s.resolvedDate, WEEK_DAYS + 1, WEEK_DAYS * 2)
    ).length,
  };

  const newHighRiskFlags = cohort.filter(
    (s) => s.riskTier === "High" && inWindow(s.flaggedDate, 0, WEEK_DAYS)
  );
  const improvedThisWeek = cohort.filter(
    (s) => s.status === "Resolved" && inWindow(s.resolvedDate, 0, WEEK_DAYS)
  );

  const worthALook = [
    ...newHighRiskFlags.map((s) => ({
      id: s.id,
      name: s.name,
      meta: "New high-risk flag",
      chipStatus: s.status,
    })),
    ...improvedThisWeek.slice(0, 3).map((s) => ({
      id: s.id,
      name: s.name,
      meta: "Engagement trending back up",
      chipStatus: "Resolved",
      chipLabel: "Improved",
    })),
  ].slice(0, 4);

  return delay({ newFlags, contacted, improved, worthALook });
}
