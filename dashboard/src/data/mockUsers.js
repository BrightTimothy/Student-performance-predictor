// Login directory. Each entry points at the real org record (an advisor's
// cohort, or a coordinator's oversight scope) — name/department/level all
// come from mockOrg.js so there's one source of truth, not two.
export const USERS = [
  {
    email: "advisor@predicted.demo",
    password: "demo1234",
    role: "advisor",
    advisorId: "adv-cs-200",
  },
  {
    email: "hod@predicted.demo",
    password: "demo1234",
    role: "coordinator",
    coordinatorId: "hod-cs",
  },
];
