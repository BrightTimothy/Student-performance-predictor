// The university's real hierarchy: College -> Department -> Level ->
// Advisor -> Students. Only the cohort actually used by a demo account
// exists so far — later phases (Department Overview, Outreach Coverage)
// extend ADVISORS/COORDINATORS to the rest of the college as they need it.
export const COLLEGE = {
  id: "cnas",
  name: "College of Natural and Applied Sciences",
};

export const DEPARTMENTS = [
  { id: "cs", name: "Computer Science", code: "CSC" },
  { id: "phy", name: "Physics", code: "PHY" },
  { id: "bio", name: "Biology", code: "BIO" },
];

export const LEVELS = ["100 Level", "200 Level", "300 Level", "400 Level"];

// A 4-year course has 4 advisors (100L/200L/300L/400L) — Computer
// Science's full roster of levels, since the HOD's department-wide view
// (Phase 7+) needs all of them, not just the one the demo advisor owns.
export const ADVISORS = [
  {
    id: "adv-cs-100",
    name: "Grace Ibe",
    departmentId: "cs",
    level: "100 Level",
    cohortSize: 42,
  },
  {
    id: "adv-cs-200",
    name: "Maria Chen",
    departmentId: "cs",
    level: "200 Level",
    cohortSize: 38,
  },
  {
    id: "adv-cs-300",
    name: "Daniel Osei",
    departmentId: "cs",
    level: "300 Level",
    cohortSize: 40,
  },
  {
    id: "adv-cs-400",
    name: "Samuel Okoye",
    departmentId: "cs",
    level: "400 Level",
    cohortSize: 35,
  },
];

export const COORDINATORS = [
  { id: "hod-cs", name: "Dr. Folake Adeyemi", scope: "department", scopeValue: "cs" },
];

export function getDepartmentById(id) {
  return DEPARTMENTS.find((d) => d.id === id);
}

export function getAdvisorById(id) {
  return ADVISORS.find((a) => a.id === id);
}

export function cohortLabel(departmentId, level) {
  return `${getDepartmentById(departmentId)?.name ?? departmentId} · ${level}`;
}

// Human-readable name for a coordinator's oversight scope — a department
// name for an HOD (the default), or the college name if a college-wide
// role is ever assigned. Same screens either way, just a wider scope.
export function scopeName(coordinator) {
  if (coordinator.scope === "college") {
    return COLLEGE.name;
  }
  return getDepartmentById(coordinator.scopeValue)?.name ?? coordinator.scopeValue;
}
