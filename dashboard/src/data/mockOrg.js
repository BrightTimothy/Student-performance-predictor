// The university's real, existing hierarchy: College -> Department -> Level
// -> Advisor -> Students. Nothing here invents a new org structure — it
// mirrors what already exists (one advisor per department+level cohort,
// one HOD overseeing a department).

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

// One advisor per (department, level) cohort — 12 total. A 4-year course
// has 4 advisors (100L/200L/300L/400L); no manual student assignment, the
// cohort IS the assignment.
export const ADVISORS = [
  { id: "adv-cs-100", name: "Grace Ibe", email: "grace.ibe@predicted.demo", departmentId: "cs", level: "100 Level" },
  { id: "adv-cs-200", name: "Maria Chen", email: "maria.chen@predicted.demo", departmentId: "cs", level: "200 Level" },
  { id: "adv-cs-300", name: "Daniel Osei", email: "daniel.osei@predicted.demo", departmentId: "cs", level: "300 Level" },
  { id: "adv-cs-400", name: "Samuel Okoye", email: "samuel.okoye@predicted.demo", departmentId: "cs", level: "400 Level" },

  { id: "adv-phy-100", name: "Priya Nair", email: "priya.nair@predicted.demo", departmentId: "phy", level: "100 Level" },
  { id: "adv-phy-200", name: "Tomiwa Adebayo", email: "tomiwa.adebayo@predicted.demo", departmentId: "phy", level: "200 Level" },
  { id: "adv-phy-300", name: "Karen Fitzgerald", email: "karen.fitzgerald@predicted.demo", departmentId: "phy", level: "300 Level" },
  { id: "adv-phy-400", name: "Ibrahim Musa", email: "ibrahim.musa@predicted.demo", departmentId: "phy", level: "400 Level" },

  { id: "adv-bio-100", name: "Chidinma Eze", email: "chidinma.eze@predicted.demo", departmentId: "bio", level: "100 Level" },
  { id: "adv-bio-200", name: "Robert Klein", email: "robert.klein@predicted.demo", departmentId: "bio", level: "200 Level" },
  { id: "adv-bio-300", name: "Aisha Bello", email: "aisha.bello@predicted.demo", departmentId: "bio", level: "300 Level" },
  { id: "adv-bio-400", name: "Peter Nwosu", email: "peter.nwosu@predicted.demo", departmentId: "bio", level: "400 Level" },
];

// Coordinators are an oversight role. `scope` + `scopeValue` are the
// assignable property the spec calls for: "department" (HOD, the default)
// or "college" (if the university ever creates a wider role). Same screens
// either way — only the set of departments in view changes.
export const COORDINATORS = [
  { id: "hod-cs", name: "Dr. Folake Adeyemi", scope: "department", scopeValue: "cs" },
  { id: "hod-phy", name: "Dr. Michael Obi", scope: "department", scopeValue: "phy" },
  { id: "hod-bio", name: "Dr. Sarah Whitfield", scope: "department", scopeValue: "bio" },
];

export function getDepartmentById(id) {
  return DEPARTMENTS.find((d) => d.id === id);
}

export function getAdvisorById(id) {
  return ADVISORS.find((a) => a.id === id);
}

export function getCoordinatorById(id) {
  return COORDINATORS.find((c) => c.id === id);
}

export function cohortLabel(departmentId, level) {
  return `${getDepartmentById(departmentId)?.name ?? departmentId} · ${level}`;
}

// Departments a coordinator's scope actually covers. Department scope = just
// their one department; college scope = every department (there's one
// college in this dataset, so college-wide means institution-wide).
export function departmentsInScope(coordinator) {
  if (coordinator.scope === "college") {
    return DEPARTMENTS.map((d) => d.id);
  }
  return [coordinator.scopeValue];
}

export function scopeName(coordinator) {
  if (coordinator.scope === "college") {
    return COLLEGE.name;
  }
  return getDepartmentById(coordinator.scopeValue)?.name ?? coordinator.scopeValue;
}
