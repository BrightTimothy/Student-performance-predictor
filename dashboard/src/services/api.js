// This is the ONLY module in the app that talks to the real backend.
// Everything else (auth, students, interventions, digest, admin stats)
// is mocked in sibling service modules so it can be swapped for real
// endpoints later without touching any component code.

const BASE_URL = "http://127.0.0.1:8000";

export async function pingApi() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error(`API ping failed: ${res.status}`);
  return res.json();
}

// features must be the full 26-key payload the backend expects
// (see api/routes/predict.py::StudentData).
export async function predictRisk(features) {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });
  if (!res.ok) {
    throw new Error(`Prediction request failed: ${res.status}`);
  }
  return res.json();
}
