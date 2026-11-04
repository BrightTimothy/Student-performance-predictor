import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Shared by the topbar avatar and the sidebar's avatar/name block — same
// dropdown (name, email, Settings, Sign out) triggered from two places,
// so sign-out logic only lives in one component.
export default function UserMenu({ trigger, className = "", triggerClassName = "", panelClassName = "" }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSettings() {
    setIsOpen(false);
    navigate("/settings");
  }

  function handleSignOut() {
    signOut();
    navigate("/login");
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button type="button" onClick={() => setIsOpen((v) => !v)} className={triggerClassName}>
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`absolute w-56 bg-card border border-border shadow-soft rounded-md overflow-hidden z-50 ${panelClassName}`}
        >
          <div className="px-4 py-3 border-b border-border-soft">
            <div className="text-sm font-semibold text-text truncate">{user.name}</div>
            <div className="text-xs text-text-faint truncate">{user.email}</div>
          </div>
          <button
            type="button"
            onClick={handleSettings}
            className="w-full text-left px-4 py-2.5 text-sm text-text-soft hover:bg-border-soft transition-colors"
          >
            Settings
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2.5 text-sm text-text-soft hover:bg-border-soft transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
