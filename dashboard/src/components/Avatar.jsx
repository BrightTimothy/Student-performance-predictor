import { initials } from "../utils/text";

// Shared between the topbar, the sidebar, and the Settings profile photo
// preview — renders the uploaded photo if there is one, otherwise falls
// back to initials-on-a-circle like before.
export default function Avatar({ name, avatarUrl, className = "" }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`rounded-full object-cover shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full bg-accent-soft text-accent-dark flex items-center justify-center font-bold shrink-0 ${className}`}
    >
      {initials(name)}
    </div>
  );
}
