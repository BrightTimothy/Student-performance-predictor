import { USERS } from "../data/mockUsers";
import {
  cohortLabel,
  getAdvisorById,
  getCoordinatorById,
  getDepartmentById,
  scopeName,
} from "../data/mockOrg";

const DELAY_MS = 250;

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

// Merges the login record with the real org record it points at (an
// advisor's cohort, or a coordinator's oversight scope) into the single
// session-user shape the rest of the app reads from.
function hydrate(user) {
  if (user.role === "advisor") {
    const advisor = getAdvisorById(user.advisorId);
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
    };
  }

  const coordinator = getCoordinatorById(user.coordinatorId);
  return {
    id: coordinator.id,
    email: user.email,
    role: "coordinator",
    name: coordinator.name,
    scope: coordinator.scope,
    scopeValue: coordinator.scopeValue,
    scopeName: scopeName(coordinator),
  };
}

// Mock login: any non-empty password is accepted. A real backend swap
// would replace this with a call to POST /auth/login.
export async function login(email, password) {
  if (!password) {
    throw new Error("Password is required.");
  }
  const user = USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase()
  );
  if (!user) {
    throw new Error("We couldn't find an account with that email.");
  }
  return delay(hydrate(user));
}
