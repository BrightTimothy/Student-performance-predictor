import { daysAgo, hoursAgo } from "../utils/date";
import { hashString, mulberry32, pick } from "../utils/rng";
import { getDepartmentById } from "./mockOrg";

// Risk vocabulary matches the reference exactly: 3 tiers (not 4), and a
// 3-value status ("Flagged" / "Contacted" / "Resolved") — see
// docs/predicted-wireframe-reference/tokens.css (--risk-high/-med/-low)
// and components.css (.status-chip.flagged/.contacted/.resolved).

const REASON_POOL = {
  High: [
    "Missed the last 3 assessment deadlines",
    "No LMS login in over a week",
    "Failed the most recent continuous assessment",
  ],
  Medium: [
    "Engagement dropped noticeably in the last 2 weeks",
    "Late submission on 2 assignments",
    "Attendance has been inconsistent this month",
  ],
  Low: [
    "Slight dip in forum activity, since resolved",
    "One late submission, otherwise on track",
    "Brief drop in engagement, now back to normal",
  ],
};

const COURSES = ["CSC201", "CSC205", "CSC210", "CSC220", "CSC230"];

const FIRST_NAMES = [
  "Kunle", "Amaka", "Bisi", "Segun", "Halima", "Chinedu", "Yewande", "Obinna",
  "Fatima", "Tolu", "Ejiro", "Adaeze", "Bayo", "Nkechi", "Suleiman", "Ronke",
];
const LAST_NAMES = [
  "Adeyemi", "Okonkwo", "Bello", "Nwachukwu", "Yusuf", "Okafor", "Lawal",
  "Chukwu", "Abubakar", "Ogundele", "Eze", "Ibrahim", "Afolabi", "Uche",
];

// The 5 named students from the wireframe reference — data matches
// exactly so the wireframe and this build stay directly comparable.
const NAMED_STUDENTS = [
  {
    id: "s-cs-200-tunde",
    name: "Tunde Balogun",
    course: "CSC201",
    riskTier: "High",
    reason: "Missed 2 of 3 quizzes this month",
    status: "Flagged",
    flaggedDate: daysAgo(6),
  },
  {
    id: "s-cs-200-ibrahim",
    name: "Ibrahim Sule",
    course: "CSC210",
    riskTier: "High",
    reason: "No LMS login in 9 days",
    status: "Flagged",
    flaggedDate: daysAgo(8),
  },
  {
    id: "s-cs-200-ngozi",
    name: "Ngozi Adeyemi",
    course: "CSC201",
    riskTier: "Medium",
    reason: "Engagement dropped 40% in 2 weeks",
    status: "Contacted",
    flaggedDate: daysAgo(9),
    contactedDate: daysAgo(2),
    // A follow-up touch more recent than the original contact — gives the
    // Recent activity feed a genuine "hours ago" entry, not just day-old ones.
    lastTouchDate: hoursAgo(2),
  },
  {
    id: "s-cs-200-femi",
    name: "Femi Okoro",
    course: "CSC205",
    riskTier: "Medium",
    reason: "Late submission on 2 assignments",
    status: "Flagged",
    flaggedDate: daysAgo(1),
  },
  {
    id: "s-cs-200-chidinma",
    name: "Chidinma Eze",
    course: "CSC201",
    riskTier: "Low",
    reason: "Slight dip in forum activity, since resolved",
    status: "Resolved",
    flaggedDate: daysAgo(10),
    contactedDate: daysAgo(6),
    resolvedDate: daysAgo(3),
  },
];

// Fills out the rest of the cohort's risk-relevant roster (the other ~17
// of the 38 enrolled students have no active or past flag, so they don't
// need a row here — cohortSize in mockOrg.js carries the full headcount).
const FILL_PLAN = [
  { tier: "Medium", status: "Flagged", days: 5 },
  { tier: "High", status: "Contacted", days: [9, 3] },
  { tier: "High", status: "Contacted", days: [5, 1] },
  { tier: "Medium", status: "Contacted", days: [7, 4] },
  { tier: "Medium", status: "Contacted", days: [6, 2] },
  { tier: "Low", status: "Resolved", days: [20, 15, 1] },
  { tier: "Low", status: "Resolved", days: [22, 17, 2] },
  { tier: "Low", status: "Resolved", days: [18, 13, 4] },
  { tier: "Low", status: "Resolved", days: [25, 19, 5] },
  { tier: "Low", status: "Resolved", days: [16, 11, 6] },
  { tier: "Medium", status: "Resolved", days: [14, 10, 2] },
  { tier: "Medium", status: "Resolved", days: [12, 8, 3] },
  { tier: "Low", status: "Resolved", days: [21, 14, 7] },
  { tier: "Low", status: "Resolved", days: [19, 12, 8] },
  { tier: "Medium", status: "Resolved", days: [15, 9, 9] },
  { tier: "Low", status: "Resolved", days: [23, 16, 10] },
];

function buildFillStudent(slot, index) {
  const rng = mulberry32(hashString(`cs-200-fill-${index}`));
  const name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
  const course = pick(rng, COURSES);
  const reason = pick(rng, REASON_POOL[slot.tier]);

  const record = {
    id: `s-cs-200-fill-${index}`,
    name,
    course,
    riskTier: slot.tier,
    reason,
    status: slot.status,
  };

  if (slot.status === "Flagged") {
    record.flaggedDate = daysAgo(slot.days);
  } else if (slot.status === "Contacted") {
    const [flagged, contacted] = slot.days;
    record.flaggedDate = daysAgo(flagged);
    record.contactedDate = daysAgo(contacted);
  } else {
    const [flagged, contacted, resolved] = slot.days;
    record.flaggedDate = daysAgo(flagged);
    record.contactedDate = daysAgo(contacted);
    record.resolvedDate = daysAgo(resolved);
  }

  return record;
}

const FILL_STUDENTS = FILL_PLAN.map(buildFillStudent);

// Categories for the profile's "why flagged" reason bars. The dashboard's
// existing single `reason` string becomes the primary bar (matched to a
// category by keyword, detail text kept verbatim); two more categories
// round out the 3 bars the profile screen needs.
const REASON_CATEGORIES = [
  {
    label: "Assessment scores",
    keywords: ["quiz", "assessment", "score", "failed"],
    details: [
      "Missed 2 of 3 quizzes",
      "Average score down 15 points",
      "Failed the most recent continuous assessment",
    ],
  },
  {
    label: "LMS engagement",
    keywords: ["lms", "login", "engagement", "forum"],
    details: [
      "Down 45% over 3 weeks",
      "No login in over a week",
      "Fewer logins than usual this month",
    ],
  },
  {
    label: "Deadlines",
    keywords: ["deadline", "submission", "late"],
    details: [
      "2 late submissions",
      "Missed the last 3 deadlines",
      "1 late submission this term",
    ],
  },
  {
    label: "Attendance",
    keywords: ["attendance", "session", "inconsistent"],
    details: ["Attendance down this month", "Missed 2 sessions in a row"],
  },
];

const FALLBACK_CATEGORY = {
  label: "Overall pattern",
  details: ["Combination of smaller signals this term"],
};

function categorizeReason(reasonText) {
  const lower = reasonText.toLowerCase();
  return (
    REASON_CATEGORIES.find((cat) => cat.keywords.some((kw) => lower.includes(kw))) ??
    FALLBACK_CATEGORY
  );
}

const SCORE_BANDS = {
  High: [72, 96],
  Medium: [42, 68],
  Low: [5, 35],
};

const PERCENT_BANDS = {
  High: [
    [78, 92],
    [55, 68],
    [35, 48],
  ],
  Medium: [
    [55, 68],
    [38, 50],
    [22, 34],
  ],
  Low: [
    [30, 42],
    [18, 28],
    [8, 16],
  ],
};

function randomInRange(rng, [min, max]) {
  return Math.round(min + rng() * (max - min));
}

function buildReasonBars(rng, tier, primaryReasonText) {
  const primaryCategory = categorizeReason(primaryReasonText);
  const otherCategories = REASON_CATEGORIES.filter((c) => c.label !== primaryCategory.label);

  // Pick 2 more distinct categories without replacement.
  const pool = [...otherCategories];
  const picked = [];
  for (let i = 0; i < 2 && pool.length > 0; i++) {
    const idx = Math.floor(rng() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }

  const percents = PERCENT_BANDS[tier].map((band) => randomInRange(rng, band));

  return [
    { label: primaryCategory.label, detail: primaryReasonText, percent: percents[0] },
    ...picked.map((cat, i) => ({
      label: cat.label,
      detail: pick(rng, cat.details),
      percent: percents[i + 1],
    })),
  ];
}

// Converts the seed-data contact timestamps into real intervention-log
// entries, so the log has one consistent shape (type + notes + date)
// whether an entry was seeded or logged live through the Log Intervention
// panel — no separate parallel "derived from dates" mechanism needed.
function buildSeedInterventions(s) {
  const entries = [];
  if (s.contactedDate) {
    entries.push({
      id: `${s.id}-seed-contact`,
      type: "email",
      notes: "Initial check-in email sent.",
      date: s.contactedDate,
    });
  }
  if (s.lastTouchDate) {
    entries.push({
      id: `${s.id}-seed-touch`,
      type: "email",
      notes: "Follow-up email sent.",
      date: s.lastTouchDate,
    });
  }
  return entries;
}

function buildStudentId(departmentId, levelNum, cohortIndex) {
  const department = getDepartmentById(departmentId);
  return `${department.code}/${levelNum}/${String(cohortIndex).padStart(4, "0")}`;
}

const CS_200_STUDENTS = [...NAMED_STUDENTS, ...FILL_STUDENTS].map((s, index) => ({
  departmentId: "cs",
  level: "200 Level",
  advisorId: "adv-cs-200",
  ...s,
  studentId: buildStudentId("cs", "200", index + 1),
}));

// Procedural roster for the department's other 3 levels (Phase 7+ needs
// department-wide aggregates, not just the one cohort an advisor owns).
// `flaggedBias` is a stage effect — some levels of the programme are
// structurally harder and flag more, regardless of who the advisor is —
// not a per-student property, so it only shifts the tier draw, never the
// individual reasons/scores below it.
function coursesForLevel(levelNum) {
  const prefix = levelNum[0]; // "1" / "2" / "3" / "4"
  return ["01", "05", "10", "20", "30"].map((suffix) => `CSC${prefix}${suffix}`);
}

function generateLevelRoster({ departmentId, level, advisorId, rosterSize, flaggedBias }) {
  const levelNum = level.split(" ")[0];
  const courses = coursesForLevel(levelNum);
  const students = [];

  for (let i = 1; i <= rosterSize; i++) {
    const rng = mulberry32(hashString(`${departmentId}-${levelNum}-${i}`));
    const tierRoll = rng();
    const tier = tierRoll < 0.22 + flaggedBias ? "High" : tierRoll < 0.5 + flaggedBias ? "Medium" : "Low";

    const name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
    const course = pick(rng, courses);
    const reason = pick(rng, REASON_POOL[tier]);

    let flaggedDaysAgo;
    let contactedDaysAgo;
    let resolvedDaysAgo;
    let status;

    if (tier === "Low") {
      flaggedDaysAgo = 20 + Math.floor(rng() * 35);
      status = rng() < 0.8 ? "Resolved" : "Contacted";
      contactedDaysAgo = Math.max(1, flaggedDaysAgo - 5 - Math.floor(rng() * 8));
      if (status === "Resolved") {
        resolvedDaysAgo = Math.max(0, contactedDaysAgo - 1 - Math.floor(rng() * 8));
      }
    } else {
      flaggedDaysAgo = 1 + Math.floor(rng() * 45);
      const statusRoll = rng();
      status = statusRoll < 0.4 ? "Flagged" : statusRoll < 0.75 ? "Contacted" : "Resolved";
      if (status !== "Flagged") {
        contactedDaysAgo = Math.max(1, flaggedDaysAgo - 1 - Math.floor(rng() * 6));
      }
      if (status === "Resolved") {
        resolvedDaysAgo = Math.max(0, contactedDaysAgo - 1 - Math.floor(rng() * 6));
      }
    }

    students.push({
      id: `s-${departmentId}-${levelNum}-${i}`,
      name,
      course,
      riskTier: tier,
      reason,
      status,
      flaggedDate: daysAgo(flaggedDaysAgo),
      contactedDate: contactedDaysAgo != null ? daysAgo(contactedDaysAgo) : undefined,
      resolvedDate: resolvedDaysAgo != null ? daysAgo(resolvedDaysAgo) : undefined,
      departmentId,
      level,
      advisorId,
      studentId: buildStudentId(departmentId, levelNum, i),
    });
  }

  return students;
}

const OTHER_CS_LEVELS = [
  { departmentId: "cs", level: "100 Level", advisorId: "adv-cs-100", rosterSize: 8, flaggedBias: -0.05 },
  { departmentId: "cs", level: "300 Level", advisorId: "adv-cs-300", rosterSize: 17, flaggedBias: 0.08 },
  { departmentId: "cs", level: "400 Level", advisorId: "adv-cs-400", rosterSize: 7, flaggedBias: -0.05 },
].flatMap(generateLevelRoster);

function finalizeStudent(s) {
  const rng = mulberry32(hashString(`${s.id}-profile`));
  return {
    ...s,
    bursaryCleared: rng() < 0.68,
    riskScore: randomInRange(rng, SCORE_BANDS[s.riskTier]),
    reasons: buildReasonBars(rng, s.riskTier, s.reason),
    interventions: buildSeedInterventions(s),
  };
}

export const STUDENTS = [...CS_200_STUDENTS, ...OTHER_CS_LEVELS].map(finalizeStudent);

export function getStudentById(id) {
  return STUDENTS.find((s) => s.id === id);
}
