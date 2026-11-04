import { useState } from "react";

const OUTREACH_OPTIONS = [
  { key: "email", label: "Email" },
  { key: "call", label: "Call" },
  { key: "in-person", label: "In person" },
  { key: "message", label: "Message" },
];

export default function LogInterventionPanel({ student, onCancel, onSave, isSaving }) {
  const [type, setType] = useState("email");
  const [notes, setNotes] = useState("");
  const levelShort = student.level.replace(" Level", "L");

  function handleSave() {
    onSave({ type, notes });
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        className="absolute inset-0 bg-text/35 cursor-default"
        onClick={onCancel}
        aria-label="Close"
      />
      <div className="relative w-[400px] max-w-full h-full bg-card border-l border-border shadow-soft p-6 flex flex-col">
        <h2 className="text-lg font-extrabold text-text mb-0.5">Log intervention</h2>
        <p className="text-sm text-text-soft mb-6">
          {student.name} · {student.course} · {levelShort}
        </p>

        <label className="block text-sm font-bold text-text-soft mb-2">Outreach type</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {OUTREACH_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setType(opt.key)}
              className={`text-sm font-semibold px-3.5 py-2 rounded-md border transition-colors ${
                type === opt.key
                  ? "bg-accent border-accent text-white"
                  : "bg-card border-border text-text-soft hover:border-text-faint"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <label htmlFor="intervention-notes" className="block text-sm font-bold text-text-soft mb-2">
          Notes
        </label>
        <textarea
          id="intervention-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What did you discuss or agree on?"
          className="w-full flex-1 min-h-[140px] rounded-md border border-border bg-[#FCFBF8] p-3 text-sm text-text placeholder:text-text-faint mb-6 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent resize-none"
        />

        <div className="mt-auto flex flex-col gap-2.5">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-md bg-accent text-white text-sm font-bold py-2.5 hover:bg-accent-dark transition-colors disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save & mark contacted"}
          </button>
          <button
            onClick={onCancel}
            className="w-full text-sm font-bold text-accent-dark py-2 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
