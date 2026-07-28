import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as studentsService from "../services/studentsService";
import { useAuth } from "../context/AuthContext";

const OUTREACH_TYPES = [
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "referred to support service", label: "Referred to support service" },
];

export default function LogIntervention() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [type, setType] = useState("email");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    studentsService.getStudentById(id).then(setStudent);
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    await studentsService.addIntervention(user.role, id, { type, notes });
    navigate(`/students/${id}`);
  }

  if (!student) {
    return <p className="text-ink-muted text-sm">Loading…</p>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <p className="text-sm text-ink-muted">Log intervention for</p>
        <h1 className="text-xl font-semibold text-ink">{student.name}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-ink-muted mb-1">Outreach type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          >
            {OUTREACH_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-ink-muted mb-1">Notes</label>
          <textarea
            required
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you discuss or agree on?"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-accent text-white text-sm font-medium px-4 py-2 hover:bg-accent-hover transition-colors disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save & mark contacted"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-border text-sm font-medium px-4 py-2 text-ink hover:border-accent hover:text-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
