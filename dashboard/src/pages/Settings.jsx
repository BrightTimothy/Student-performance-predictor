import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user } = useAuth();
  const [digestFrequency, setDigestFrequency] = useState("weekly");

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-semibold text-ink">Settings</h1>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-medium text-ink mb-4">Profile</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Name</span>
            <span className="text-ink">{user.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Email</span>
            <span className="text-ink">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Role</span>
            <span className="text-ink capitalize">{user.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">
              {user.role === "coordinator" ? "Scope" : "Cohort"}
            </span>
            <span className="text-ink">
              {user.role === "coordinator" ? user.scopeName : user.cohortLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-medium text-ink mb-4">Notification preferences</h2>
        <label className="block text-sm text-ink-muted mb-1">Email digest frequency</label>
        <select
          value={digestFrequency}
          onChange={(e) => setDigestFrequency(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="never">Never</option>
        </select>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-medium text-ink mb-3">Understanding risk tiers</h2>
        <ul className="space-y-2 text-sm text-ink-muted">
          <li><span className="text-ink font-medium">Doing well</span> — no signs of disengagement right now.</li>
          <li><span className="text-ink font-medium">Keep an eye on</span> — some early signals worth watching.</li>
          <li><span className="text-ink font-medium">Needs attention</span> — academic or engagement signals suggest this student could benefit from outreach soon.</li>
        </ul>
      </div>
    </div>
  );
}
