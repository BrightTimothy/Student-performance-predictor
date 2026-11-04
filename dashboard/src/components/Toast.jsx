export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-card border border-border shadow-soft rounded-md px-4 py-3">
      <p className="text-sm font-semibold text-text">{message}</p>
    </div>
  );
}
