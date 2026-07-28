import { daysAgo } from "../utils/date";
import { hashString, mulberry32, pick } from "../utils/rng";
import { ADVISORS, DEPARTMENTS, LEVELS } from "./mockOrg";

// The 13 one-hot region fields expected by the API, exactly as the backend
// declares them (note the spaces in the alias names).
const REGION_FIELDS = [
  "region_East Anglian Region",
  "region_East Midlands Region",
  "region_Ireland",
  "region_London Region",
  "region_North Region",
  "region_North Western Region",
  "region_Scotland",
  "region_South East Region",
  "region_South Region",
  "region_South West Region",
  "region_Wales",
  "region_West Midlands Region",
  "region_Yorkshire Region",
];
const REGIONS = REGION_FIELDS.map((f) => f.replace("region_", ""));

function oneHotRegion(region) {
  const key = `region_${region}`;
  const out = {};
  for (const field of REGION_FIELDS) {
    out[field] = field === key ? 1 : 0;
  }
  return out;
}

// Baseline academic-signal profiles per risk tier, jittered per student so
// the model sees varied (if illustrative) payloads rather than identical
// ones for every student in a tier.
const TIER_PRESETS = {
  Critical: {
    num_of_prev_attempts: 2,
    mean_score: 28,
    max_score: 42,
    min_score: 8,
    number_of_takes: 1,
    mean_weight: 12,
    total_clicks: 35,
    num_active_days: 4,
    avg_daily_clicks: 8,
  },
  "At-Risk": {
    num_of_prev_attempts: 1,
    mean_score: 42,
    max_score: 55,
    min_score: 18,
    number_of_takes: 2,
    mean_weight: 14,
    total_clicks: 95,
    num_active_days: 8,
    avg_daily_clicks: 12,
  },
  Watch: {
    num_of_prev_attempts: 0,
    mean_score: 58,
    max_score: 70,
    min_score: 35,
    number_of_takes: 3,
    mean_weight: 16,
    total_clicks: 180,
    num_active_days: 15,
    avg_daily_clicks: 14,
  },
  Safe: {
    num_of_prev_attempts: 0,
    mean_score: 78,
    max_score: 92,
    min_score: 55,
    number_of_takes: 4,
    mean_weight: 18,
    total_clicks: 340,
    num_active_days: 40,
    avg_daily_clicks: 18,
  },
};

const JITTER = {
  mean_score: 8,
  max_score: 8,
  min_score: 8,
  total_clicks: 25,
  num_active_days: 4,
  avg_daily_clicks: 4,
  mean_weight: 3,
};

function buildFeatures({ tier, region, highest_education, imd_band, age_band, studied_credits, rng }) {
  const preset = TIER_PRESETS[tier];
  const jittered = {};
  for (const [key, value] of Object.entries(preset)) {
    const spread = JITTER[key] ?? 0;
    const delta = Math.round((rng() - 0.5) * 2 * spread);
    jittered[key] = Math.max(0, value + delta);
  }
  return {
    highest_education,
    imd_band,
    age_band,
    studied_credits,
    ...oneHotRegion(region),
    ...jittered,
  };
}

function engagementTrend(seed, trend) {
  // 12 weeks of LMS click activity. `trend` nudges the shape.
  const base = { declining: 60, flat: 30, rising: 10 }[trend];
  const slope = { declining: -4, flat: 0, rising: 4 }[trend];
  return Array.from({ length: 12 }, (_, i) => {
    const wobble = ((seed + i * 7) % 9) - 4;
    const clicks = Math.max(0, Math.round(base + slope * i + wobble));
    return { week: i + 1, clicks };
  });
}

const REASON_POOL = {
  Critical: [
    "Has not submitted any assessments this term",
    "Assessment scores have dropped sharply over the last month",
    "Missed the last two assessment submissions",
    "Multiple previous attempts at this course",
  ],
  "At-Risk": [
    "Engagement with course materials has dropped off",
    "Lowest assessment score is well below the cohort average",
    "Average assessment score has fallen below the pass threshold",
    "Number of active days this term is below the cohort average",
  ],
  Watch: [
    "Platform engagement is lower than most peers this term",
    "A recent assessment score was noticeably lower than usual",
    "Number of active days this term is trending down",
  ],
  Safe: [
    "Consistently strong scores and steady engagement",
    "Scores and engagement have stayed strong all term",
  ],
};

const TREND_BY_TIER = {
  Critical: "declining",
  "At-Risk": "declining",
  Watch: "flat",
  Safe: "rising",
};

const OUTREACH_TYPES = ["email", "meeting", "referred to support service"];

const FIRST_NAMES = [
  "Aaliyah", "Marcus", "Priya", "Tom", "Grace", "Daniel", "Isabella", "Ethan",
  "Sofia", "Liam", "Chloe", "Noah", "Amara", "Ben", "Zainab", "Oliver",
  "Fatima", "Lucas", "Ngozi", "Henry", "Adaeze", "Jack", "Yusuf", "Emily",
  "Kelechi", "Ryan", "Bisi", "Michael", "Funke", "Adam",
];
const LAST_NAMES = [
  "Brooks", "Webb", "Shah", "Ashford", "Lin", "Osei", "Reyes", "Walsh",
  "Marchetti", "O'Connor", "Bennett", "Kim", "Adeyemi", "Carter", "Bello",
  "Fitzgerald", "Musa", "Klein", "Nwosu", "Eze", "Adebayo", "Okafor",
  "Whitfield", "Obi", "Ibe", "Chukwu", "Nair", "Chen", "Okoye", "Hassan",
];

// Stage effect, not a department or advisor effect: some levels of a
// programme are structurally harder and flag more students, regardless of
// department or who the advisor is. Small per-cohort jitter is added on
// top so it isn't perfectly uniform.
const LEVEL_RISK_BIAS = {
  "100 Level": 0,
  "200 Level": 0.12,
  "300 Level": 0.18,
  "400 Level": 0.05,
};

const MIN_COHORT_SIZE = 8;
const MAX_COHORT_SIZE = 12;

function buildCohortStudents(department, level, advisorId) {
  const rng = mulberry32(hashString(`${department.id}-${level}`));
  const count = MIN_COHORT_SIZE + Math.floor(rng() * (MAX_COHORT_SIZE - MIN_COHORT_SIZE + 1));
  const levelNum = level.split(" ")[0];
  const flaggedProb = 0.35 + (LEVEL_RISK_BIAS[level] ?? 0) + (rng() - 0.5) * 0.06;

  const students = [];

  for (let i = 1; i <= count; i++) {
    const roll = rng();
    let tier;
    if (roll < flaggedProb * 0.28) tier = "Critical";
    else if (roll < flaggedProb * 0.62) tier = "At-Risk";
    else if (roll < flaggedProb + 0.22) tier = "Watch";
    else tier = "Safe";

    const studentId = `${department.code}/${levelNum}/${String(i).padStart(3, "0")}`;
    const name = `${pick(rng, FIRST_NAMES)} ${pick(rng, LAST_NAMES)}`;
    const region = pick(rng, REGIONS);

    let flaggedDaysAgo;
    let contactedDaysAgo;
    let resolvedDaysAgo;
    let status;

    if (tier === "Safe") {
      // A "Doing well" student has no active concern, so it never sits in
      // "Needs outreach" — that status implies something still unactioned.
      flaggedDaysAgo = 20 + Math.floor(rng() * 20);
      status = rng() < 0.8 ? "Resolved" : "Contacted";
      contactedDaysAgo = Math.max(1, flaggedDaysAgo - 5);
      if (status === "Resolved") {
        resolvedDaysAgo = Math.max(0, Math.floor(contactedDaysAgo * 0.4));
      }
    } else {
      const isCritical = tier === "Critical";
      // Widen the window enough that some At-Risk/Watch flags — not just
      // Critical ones — can plausibly cross the 14-day escalation line.
      flaggedDaysAgo = 1 + Math.floor(rng() * (isCritical ? 25 : tier === "At-Risk" ? 20 : 17));
      const statusRoll = rng();
      status = statusRoll < 0.5 ? "Needs outreach" : statusRoll < 0.85 ? "Contacted" : "Resolved";
      if (status !== "Needs outreach") {
        contactedDaysAgo = Math.max(1, flaggedDaysAgo - 1 - Math.floor(rng() * 4));
      }
      if (status === "Resolved") {
        resolvedDaysAgo = Math.max(0, contactedDaysAgo - 1 - Math.floor(rng() * 4));
      }
    }

    const interventions = [];
    if (status !== "Needs outreach") {
      interventions.push({
        id: `${studentId.replace(/\//g, "-")}-i1`,
        type: pick(rng, OUTREACH_TYPES),
        notes: "Logged after an initial check-in with the student.",
        date: daysAgo(contactedDaysAgo ?? 1),
      });
    }

    // Carryover flavor: a small share of upper-level students are retaking
    // a course from a lower level, but ownership still follows their
    // REGISTERED level, never the carried course.
    const carriedFrom =
      level !== "100 Level" && i === count && rng() < 0.5
        ? LEVELS[LEVELS.indexOf(level) - 1]
        : undefined;

    students.push({
      id: `s-${department.id}-${levelNum}-${i}`,
      name,
      studentId,
      departmentId: department.id,
      level,
      advisorId,
      carriedFrom,
      status,
      flaggedDate: daysAgo(flaggedDaysAgo),
      contactedDate: contactedDaysAgo != null ? daysAgo(contactedDaysAgo) : undefined,
      resolvedDate: resolvedDaysAgo != null ? daysAgo(resolvedDaysAgo) : undefined,
      bursaryCleared: rng() < 0.7,
      reason: pick(rng, REASON_POOL[tier]),
      riskTier: tier,
      riskScore:
        Math.round(
          (tier === "Critical"
            ? 80 + rng() * 19
            : tier === "At-Risk"
              ? 55 + rng() * 24
              : tier === "Watch"
                ? 30 + rng() * 24
                : 2 + rng() * 20) * 10
        ) / 10,
      lastLoginDaysAgo: Math.floor(rng() * 14),
      interventions,
      engagementTrend: engagementTrend(hashString(studentId) % 97, TREND_BY_TIER[tier]),
      features: buildFeatures({
        tier,
        region,
        rng,
        highest_education: Math.floor(rng() * 4),
        imd_band: Math.floor(rng() * 9),
        age_band: Math.floor(rng() * 3),
        studied_credits: pick(rng, [60, 90, 120]),
      }),
    });
  }

  return students;
}

export const STUDENTS = DEPARTMENTS.flatMap((department) =>
  LEVELS.flatMap((level) => {
    const advisor = ADVISORS.find((a) => a.departmentId === department.id && a.level === level);
    return buildCohortStudents(department, level, advisor.id);
  })
);

export function getStudentById(id) {
  return STUDENTS.find((s) => s.id === id);
}
