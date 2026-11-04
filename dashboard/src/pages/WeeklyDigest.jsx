import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as studentsService from "../services/studentsService";
import DigestStat from "../components/DigestStat";
import DigestHighlightRow from "../components/DigestHighlightRow";

function weekOfLabel() {
  const start = new Date();
  start.setDate(start.getDate() - 6);
  return `Week of ${start.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
}

export default function WeeklyDigest() {
  const { user } = useAuth();
  const [digest, setDigest] = useState(null);

  useEffect(() => {
    studentsService.getWeeklyDigest(user.id).then(setDigest);
  }, [user.id]);

  if (!digest) {
    return <p className="text-text-soft text-sm">Loading digest…</p>;
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-text mb-0.5">Weekly digest</h1>
        <p className="text-sm text-text-soft">
          {weekOfLabel()} — {user.cohortLabel}
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <DigestStat
          label="New flags"
          value={digest.newFlags.thisWeek}
          lastWeek={digest.newFlags.lastWeek}
          goodDirection="down"
        />
        <DigestStat
          label="Contacted"
          value={digest.contacted.thisWeek}
          lastWeek={digest.contacted.lastWeek}
          goodDirection="up"
        />
        <DigestStat
          label="Improved"
          value={digest.improved.thisWeek}
          lastWeek={digest.improved.lastWeek}
          goodDirection="up"
        />
      </div>

      <h2 className="text-sm font-bold text-text-soft uppercase tracking-wide mb-2.5">
        Worth a look
      </h2>

      {digest.worthALook.length === 0 ? (
        <p className="text-sm text-text-soft py-6 text-center">
          Nothing stands out this week — a quiet week for your cohort.
        </p>
      ) : (
        digest.worthALook.map((item) => <DigestHighlightRow key={item.id} item={item} />)
      )}
    </div>
  );
}
