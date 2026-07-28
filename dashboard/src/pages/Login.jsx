import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DEMO_ACCOUNTS = [
  { email: "advisor@predicted.demo", label: "Advisor · CS 200 Level" },
  { email: "hod@predicted.demo", label: "HOD · Computer Science" },
];

export default function Login() {
  const { signIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);
    try {
      const user = await signIn(email, password);
      navigate(user.role === "coordinator" ? "/coordinator" : "/dashboard");
    } catch (err) {
      setFormError(err.message);
    }
  }

  function fillDemoAccount(demoEmail) {
    setEmail(demoEmail);
    setPassword("demopassword");
    setFormError(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-6">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden border border-border shadow-sm">
        <div className="hidden md:flex w-2/5 shrink-0 flex-col bg-accent px-10 py-10 text-white">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-white" />
            </div>
            <span className="font-semibold">PredictEd</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="font-serif text-4xl leading-tight mb-4">No student unseen.</h1>
            <p className="text-white/80 leading-relaxed">
              We know before the grades do — so you can reach the students who need
              you, while there's still time to help.
            </p>
          </div>
        </div>

        <div className="flex-1 bg-surface flex items-center justify-center px-8 py-10 sm:px-12">
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-semibold text-ink mb-1">Welcome back</h2>
            <p className="text-sm text-ink-muted mb-6">
              Sign in to your <span className="text-ink font-medium">PredictEd</span> account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm text-ink-muted mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm text-ink-muted">
                    Password
                  </label>
                  <a href="#" className="text-sm text-accent hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                />
              </div>

              {formError && (
                <p className="text-sm text-risk-critical" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-accent text-white text-sm font-medium py-2.5 hover:bg-accent-hover transition-colors disabled:opacity-60"
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <div className="mt-6 rounded-xl border border-border p-4">
              <p className="text-xs font-medium tracking-wide text-ink-muted mb-2">
                DEMO ACCOUNTS
              </p>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((acct) => (
                  <button
                    key={acct.email}
                    type="button"
                    onClick={() => fillDemoAccount(acct.email)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="text-sm text-accent font-medium hover:underline">
                      {acct.email}
                    </span>
                    <span className="text-xs text-ink-muted">{acct.label} →</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-muted/80 mt-3">
                Tap an account to fill the form, then Sign in. Prototype convenience —
                not a production feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
