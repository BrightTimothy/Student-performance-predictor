// Login directory. Each entry just points at the real org record (an
// advisor's cohort or a coordinator's oversight scope) — the account
// itself doesn't carry any role-specific data.
export const USERS = [
  {
    email: "advisor@predicted.demo",
    role: "advisor",
    advisorId: "adv-cs-200",
  },
  {
    email: "hod@predicted.demo",
    role: "coordinator",
    coordinatorId: "hod-cs",
  },
];
