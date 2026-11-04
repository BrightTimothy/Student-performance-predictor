import { USERS } from "../data/mockUsers";
import { ADVISORS, COORDINATORS, cohortLabel, getDepartmentById, scopeName } from "../data/mockOrg";

const DELAY_MS = 250;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

// Merges the login record with the real org record it points at (an
// advisor's cohort, or a coordinator's oversight scope) into the single
// session-user shape the rest of the app reads from.
function hydrate(user) {
  if (user.role === "advisor") {
    const advisor = ADVISORS.find((a) => a.id === user.advisorId);
    const department = getDepartmentById(advisor.departmentId);
    return {
      id: advisor.id,
      email: user.email,
      role: "advisor",
      name: advisor.name,
      departmentId: advisor.departmentId,
      departmentName: department.name,
      level: advisor.level,
      cohortLabel: cohortLabel(advisor.departmentId, advisor.level),
      cohortSize: advisor.cohortSize,
    };
  }

  const coordinator = COORDINATORS.find((c) => c.id === user.coordinatorId);
  return {
    id: coordinator.id,
    email: user.email,
    role: "coordinator",
    name: coordinator.name,
    scope: coordinator.scope,
    scopeValue: coordinator.scopeValue,
    // For department scope (the default/HOD case), scopeValue IS the
    // departmentId — surfaced under its own name so pages don't need to
    // know about the scope/scopeValue distinction to query by department.
    departmentId: coordinator.scope === "department" ? coordinator.scopeValue : null,
    scopeName: scopeName(coordinator),
  };
}

// Mock login against the demo directory. A real backend swap would replace
// this with a call to POST /auth/login.
export async function login(email, password) {
  const user = USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!user || user.password !== password) {
    throw new Error("That email and password don't match a PredictEd account.");
  }
  return delay(hydrate(user));
}
