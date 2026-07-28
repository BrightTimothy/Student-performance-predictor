import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getWeeklyDigest } from "../services/digestService";
import SummaryCard from "../components/SummaryCard";

function delta(current, previous) {
  const diff = current - previous;
  if (diff === 0) return "No change from last week";
  return diff > 0 ? `+${diff} vs. last week` : `${diff} vs. last week`;
}

export default function WeeklyDigest() {
  const { user } = useAuth();
  const [digest, setDigest] = useState(null);

  useEffect(() => {
    getWeeklyDigest(user.id).then(setDigest);
  }, [user.id]);

  function handleExport() {
    // No export backend yet — this is a no-op for the demo.
  }

  if (!digest) {
    return <p className="text-ink-muted text-sm">Loading digest…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">This week at a glance</h1>
          <p className="text-ink-muted mt-1">{user.cohortLabel}</p>
        </div>
        <button
          onClick={handleExport}
          className="rounded-lg border border-border text-sm font-medium px-4 py-2 text-ink hover:border-accent hover:text-accent transition-colors"
        >
          Export summary
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="New flags"
          value={digest.newFlags}
          sublabel={delta(digest.newFlags, digest.lastWeek.newFlags)}
        />
        <SummaryCard
          label="Students contacted"
          value={digest.contacted}
          sublabel={delta(digest.contacted, digest.lastWeek.contacted)}
        />
        <SummaryCard
          label="Students improved"
          value={digest.improved}
          sublabel={delta(digest.improved, digest.lastWeek.improved)}
        />
      </div>
    </div>
  );
}
