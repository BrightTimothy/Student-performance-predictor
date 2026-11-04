import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

const ROLE_TABS = [
  { key: "advisor", label: "Advisor", heading: "Advisor login", demoEmail: "advisor@predicted.demo" },
  { key: "coordinator", label: "Coordinator (HOD)", heading: "Coordinator login", demoEmail: "hod@predicted.demo" },
];

export default function Login() {
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("advisor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  const activeTab = ROLE_TABS.find((tab) => tab.key === activeRole);

  function handleRoleChange(role) {
    setActiveRole(role);
    setFormError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#FBF9F4,#F1EEE6)]">
      <div className="w-[420px] bg-card border border-border rounded-lg shadow-soft px-10 py-10">
        <div className="flex flex-col items-center mb-2">
          <Logo size="lg" />
        </div>

        <p className="text-base text-text-soft text-center italic mt-1 mb-6">
          "We know before the grades do."
        </p>

        <div className="flex gap-2 mb-6">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleRoleChange(tab.key)}
              className={`flex-1 text-sm font-semibold px-3.5 py-2 rounded-md border transition-colors ${
                activeRole === tab.key
                  ? "bg-accent border-accent text-white"
                  : "bg-card border-border text-text-soft hover:border-text-faint"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <h1 className="text-base font-bold text-text mb-4">{activeTab.heading}</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-base font-bold text-text-soft mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={activeTab.demoEmail}
            className="w-full rounded-[8px] border border-border bg-[#FCFBF8] px-4 py-3.5 text-base text-text placeholder:text-text-faint mb-4 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          <label htmlFor="password" className="block text-base font-bold text-text-soft mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            className="w-full rounded-[8px] border border-border bg-[#FCFBF8] px-4 py-3.5 text-base text-text placeholder:text-text-faint mb-4 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />

          {formError && (
            <p className="text-sm text-risk-high mb-4" role="alert">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-[8px] bg-accent text-white text-base font-bold py-3 mt-2 hover:bg-accent-dark transition-colors disabled:opacity-60"
          >
            {isLoading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="text-sm text-text-faint text-center mt-5 bg-neutral-bg rounded-[8px] px-4 py-3">
          Demo accounts
          <br />
          Advisor: advisor@predicted.demo
          <br />
          Coordinator: hod@predicted.demo
          <br />
          password: demo1234
        </div>
      </div>
    </div>
  );
}
