import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as studentsService from "../services/studentsService";
import StudentRow from "../components/StudentRow";
import { ADVISORS, cohortLabel } from "../data/mockOrg";
import { needsAttention } from "../utils/riskHelpers";

export default function CohortDrilldown() {
  const { departmentId, level: encodedLevel } = useParams();
  const level = decodeURIComponent(encodedLevel);
  const [students, setStudents] = useState(null);

  useEffect(() => {
    studentsService.getStudentsByCohort(departmentId, level).then(setStudents);
  }, [departmentId, level]);

  const advisor = ADVISORS.find((a) => a.departmentId === departmentId && a.level === level);

  if (!students) {
    return <p className="text-ink-muted text-sm">Loading cohort…</p>;
  }

  const needingAttention = students.filter((s) => needsAttention(s.riskTier)).length;

  return (
    <div className="space-y-6">
      <div>
        <Link to="/coordinator/cohorts" className="text-sm text-accent hover:underline">
          ← Cohort risk overview
        </Link>
        <h1 className="text-2xl font-semibold text-ink mt-2">
          {cohortLabel(departmentId, level)}
        </h1>
        <p className="text-ink-muted mt-1">
          Advised by {advisor?.name ?? "Unassigned"} · {students.length} students ·{" "}
          {needingAttention} need attention
        </p>
      </div>

      <div className="space-y-2">
        {students.length === 0 && (
          <p className="text-sm text-ink-muted py-8 text-center">
            No students in this cohort yet.
          </p>
        )}
        {students.map((student) => (
          <StudentRow key={student.id} student={student} readOnly />
        ))}
      </div>
    </div>
  );
}
