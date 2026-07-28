# PredictEd Dashboard

The advisor and student affairs frontend for PredictEd — an early-warning
system that helps academic advisors identify and support at-risk students.
Built with React, Vite, React Router, Tailwind CSS, and Recharts.

## Setup

```bash
cd dashboard
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

The **only** real network call this app makes is `POST /predict`, sent to
the FastAPI backend in `../api`. Everything else (auth, student records,
interventions, weekly digest, admin stats) is mocked. For that one call to
work, start the backend separately from the repo root:

```bash
uvicorn api.main:app --reload
```

The backend must be reachable at `http://127.0.0.1:8000` (CORS is already
enabled there for all origins). If it isn't running, student profile pages
will show a "Couldn't reach the prediction service" message instead of a
risk score — every other page still works.

## Demo accounts

Any password works for these mock accounts:

| Email | Role | Lands on |
|---|---|---|
| `advisor@predicted.demo` | advisor | `/dashboard` |
| `affairs@predicted.demo` | admin | `/admin` |

## Project layout

```
src/
  services/     # ALL data access lives here — the single seam to swap
                # mocks for a real backend later. api.js is the one
                # module that calls the real FastAPI server.
  data/         # Mock records (students, users, advisors) consumed by
                # the services layer.
  context/      # AuthContext — holds the logged-in user for the session.
  components/   # Shared UI: layout/sidebar, risk dot/gauge, chips,
                # filter bar, charts, timeline.
  pages/        # One file per route.
  utils/        # Small helpers (risk tier labels/colors, date math).
```

## Notes

- There's no localStorage/sessionStorage use — sessions live only in
  React state, so a page refresh returns you to `/login`.
- Student risk tiers/scores shown in list views (dashboard, coverage,
  escalations) are pre-baked mock values, as if from a nightly batch
  scoring job. The **student profile page** is the real integration
  point: it sends that student's full 26-feature payload to
  `POST /predict` and renders the live `risk_score`, `risk_tier`, and
  `top_reasons` from the model.
- To point this at a real backend later, replace the function bodies in
  `src/services/*.js` with real `fetch` calls — component code doesn't
  need to change.
