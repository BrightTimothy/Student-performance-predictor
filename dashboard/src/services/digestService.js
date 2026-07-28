import { getStudentsByAdvisor } from "./studentsService";
import { daysSince } from "../utils/date";

const DELAY_MS = 150;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

// Weekly digest is scoped to the logged-in advisor's own cohort.
// "Last week" figures are mocked as static comparison points since there
// is no historical data store yet.
export async function getWeeklyDigest(advisorId) {
  const mine = await getStudentsByAdvisor(advisorId);

  const newFlags = mine.filter((s) => daysSince(s.flaggedDate) <= 7).length;
  const contacted = mine.filter(
    (s) =>
      (s.status === "Contacted" || s.status === "Resolved") &&
      s.contactedDate &&
      daysSince(s.contactedDate) <= 7
  ).length;
  const improved = mine.filter(
    (s) => s.status === "Resolved" && s.resolvedDate && daysSince(s.resolvedDate) <= 7
  ).length;

  return delay({
    newFlags,
    contacted,
    improved,
    lastWeek: {
      newFlags: Math.max(0, newFlags - 1),
      contacted: Math.max(0, contacted - 1),
      improved: Math.max(0, improved - 1),
    },
  });
}
