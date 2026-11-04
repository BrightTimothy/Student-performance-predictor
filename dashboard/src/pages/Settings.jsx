import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Toggle from "../components/Toggle";
import Avatar from "../components/Avatar";
import Toast from "../components/Toast";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notifications" },
  { key: "tiers", label: "How risk tiers work" },
];

const TOAST_DURATION_MS = 2500;

function ProfileTab({ user, onUpdateProfile }) {
  const isCoordinator = user.role === "coordinator";
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [toastMessage, setToastMessage] = useState(null);

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  }

  function handlePhotoSelected(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateProfile({ avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    onUpdateProfile({ avatarUrl: null });
  }

  function handleSave(e) {
    e.preventDefault();
    onUpdateProfile({ name: name.trim(), email: email.trim() });
    showToast("Profile updated");
  }

  return (
    <div className="bg-card border border-border rounded-md p-8">
      <h2 className="text-lg font-bold text-text mb-6">Profile</h2>

      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-border-soft">
        <Avatar name={user.name} avatarUrl={user.avatarUrl} className="h-16 w-16 text-lg" />
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-bold text-text hover:border-accent hover:text-accent-dark transition-colors"
          >
            Upload photo
          </button>
          {user.avatarUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-sm font-bold text-text-soft hover:text-text transition-colors"
            >
              Remove photo
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="profile-name" className="block text-sm text-text-faint mb-1">
            Name
          </label>
          <input
            id="profile-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-sm rounded-[8px] border border-border bg-[#FCFBF8] px-3.5 py-2.5 text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="profile-email" className="block text-sm text-text-faint mb-1">
            Email
          </label>
          <input
            id="profile-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full max-w-sm rounded-[8px] border border-border bg-[#FCFBF8] px-3.5 py-2.5 text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
        <div>
          <p className="text-sm text-text-faint mb-1">{isCoordinator ? "Department" : "Cohort"}</p>
          <p className="text-lg font-semibold text-text">
            {isCoordinator ? user.scopeName : user.cohortLabel}
          </p>
        </div>

        <button
          type="submit"
          className="rounded-md bg-accent text-white px-5 py-2.5 text-sm font-bold hover:bg-accent-dark transition-colors"
        >
          Save changes
        </button>
      </form>

      <Toast message={toastMessage} />
    </div>
  );
}

// Toggle state lives in the parent (Settings) rather than here, because
// this tab's content unmounts whenever another tab is active — local
// state here would reset to defaults every time the advisor switched
// away and back.
function NotificationsTab({ notifications, onChange, isCoordinator }) {
  const rows = [
    {
      key: "weeklyDigest",
      label: "Weekly email digest",
      sub: isCoordinator
        ? "A summary of your department, every week."
        : "A summary of your cohort, every week.",
    },
    {
      key: "inAppReminders",
      label: "In-app reminders",
      sub: "Nudge when a flag has gone 7 days unactioned.",
    },
    {
      key: "escalationNotice",
      label: "Escalation notice",
      sub: isCoordinator
        ? "Notify when a flag has gone 14 days unactioned."
        : "Notify when a flag reaches your HOD at 14 days.",
    },
  ];

  return (
    <div className="bg-card border border-border rounded-md p-8">
      <h2 className="text-lg font-bold text-text mb-6">Notifications</h2>
      <div>
        {rows.map((row, i) => (
          <div
            key={row.key}
            className={`flex items-center justify-between gap-6 py-5 ${
              i === 0 ? "" : "border-t border-border-soft"
            }`}
          >
            <div className="min-w-0">
              <p className="text-base font-semibold text-text">{row.label}</p>
              <p className="text-sm text-text-faint mt-1">{row.sub}</p>
            </div>
            <Toggle
              checked={notifications[row.key]}
              onChange={(value) => onChange(row.key, value)}
              label={row.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const TIERS = [
  {
    label: "High",
    colorClass: "text-risk-high",
    text: "the student is showing several warning signs at once and hasn't been reached yet this term.",
  },
  {
    label: "Medium",
    colorClass: "text-risk-med",
    text: "one or two signals worth a check-in, nothing urgent yet.",
  },
  {
    label: "Low",
    colorClass: "text-risk-low",
    text: "engagement and grades look steady.",
  },
];

function TiersTab() {
  return (
    <div className="bg-card border border-border rounded-md p-8">
      <h2 className="text-lg font-bold text-text mb-2">How risk tiers work</h2>
      <p className="text-base text-text-soft leading-relaxed mb-6">
        Plain-language, no formulas — written for a busy advisor, not a data scientist.
      </p>
      <div className="space-y-4">
        {TIERS.map((tier) => (
          <div key={tier.label} className="bg-neutral-bg rounded-md px-5 py-4">
            <p className="text-base text-neutral-text leading-relaxed">
              <b className={`${tier.colorClass} font-bold`}>{tier.label}</b> — {tier.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const DEFAULT_NOTIFICATIONS = {
  weeklyDigest: true,
  inAppReminders: true,
  escalationNotice: false,
};

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);

  function handleToggle(key, value) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-text mb-6">Settings</h1>

      <div className="flex gap-8 items-start">
        <div className="w-56 shrink-0 flex flex-col gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`text-left text-base px-4 py-3 rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-accent-soft text-accent-dark font-bold"
                  : "text-text-soft font-semibold hover:bg-border-soft"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-2xl min-w-0">
          {activeTab === "profile" && <ProfileTab user={user} onUpdateProfile={updateProfile} />}
          {activeTab === "notifications" && (
            <NotificationsTab
              notifications={notifications}
              onChange={handleToggle}
              isCoordinator={user.role === "coordinator"}
            />
          )}
          {activeTab === "tiers" && <TiersTab />}
        </div>
      </div>
    </div>
  );
}
