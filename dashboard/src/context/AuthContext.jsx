import { createContext, useContext, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // No localStorage available in this environment, so the session only
  // lives for the lifetime of the app (a refresh returns to /login).
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function signIn(email, password) {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  function signOut() {
    setUser(null);
    setError(null);
  }

  // No backend to persist this to — just updates the in-memory session so
  // the new name/email/avatar shows up everywhere that reads useAuth().
  function updateProfile(updates) {
    setUser((prev) => ({ ...prev, ...updates }));
  }

  const value = useMemo(
    () => ({ user, error, isLoading, signIn, signOut, updateProfile }),
    [user, error, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
