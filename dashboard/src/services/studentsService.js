import { STUDENTS } from "../data/mockStudents";

const DELAY_MS = 200;

// In-memory mock store. A real backend swap would replace every function
// body here with a fetch() call, keeping the function signatures the same
// so calling components don't need to change.
let students = STUDENTS.map((s) => ({ ...s, interventions: [...s.interventions] }));

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), DELAY_MS));
}

function clone(student) {
  return student
    ? { ...student, interventions: student.interventions.map((i) => ({ ...i })) }
    : student;
}

// The HOD/Coordinator role has full read visibility into students but can
// never act on one — only the advisor who owns the cohort can. This is
// enforced here, not just in the UI, so it can't be bypassed by calling
// these functions directly (e.g. via devtools or a manipulated URL).
function assertCanActOnStudent(role) {
  if (role !== "advisor") {
    throw new Error("Only an advisor can act on a student.");
  }
}

export async function getStudents() {
  return delay(students.map(clone));
}

export async function getStudentsByAdvisor(advisorId) {
  return delay(students.filter((s) => s.advisorId === advisorId).map(clone));
}

export async function getStudentsByDepartments(departmentIds) {
  return delay(students.filter((s) => departmentIds.includes(s.departmentId)).map(clone));
}

export async function getStudentsByCohort(departmentId, level) {
  return delay(
    students.filter((s) => s.departmentId === departmentId && s.level === level).map(clone)
  );
}

export async function getStudentById(id) {
  return delay(clone(students.find((s) => s.id === id)));
}

export async function updateStudentStatus(role, id, status) {
  assertCanActOnStudent(role);
  students = students.map((s) => (s.id === id ? { ...s, status } : s));
  return delay(clone(students.find((s) => s.id === id)));
}

export async function addIntervention(role, id, { type, notes }) {
  assertCanActOnStudent(role);
  const entry = {
    id: `i-${Date.now()}`,
    type,
    notes,
    date: new Date().toISOString(),
  };
  students = students.map((s) =>
    s.id === id
      ? {
          ...s,
          status: "Contacted",
          contactedDate: entry.date,
          interventions: [entry, ...s.interventions],
        }
      : s
  );
  return delay(clone(students.find((s) => s.id === id)));
}
