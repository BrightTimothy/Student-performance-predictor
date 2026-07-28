# PredictEd — Static Wireframe Reference

This folder documents the **9-screen wireframe** — the flat visual reference
(not the interactive prototype). It shows every screen twice, as a labeled
desktop mockup and a labeled mobile mockup side by side, with a short
rationale under each. Use it to see and copy exact layout, spacing, and
component structure per screen.

**If you are Claude Code implementing a screen:** open `wireframe.html` in a
browser to see it, or read it directly — the markup for each screen's
desktop and mobile mockup is self-contained inside its `<section>`. Copy
class names and structure from `components.css`; copy exact values from
`tokens.css`. Don't re-derive colors or spacing from scratch.

## Files

| File | Purpose |
|---|---|
| `README.md` | This document. |
| `tokens.css` | Color, radius, and shadow values as CSS custom properties. |
| `components.css` | All component + layout CSS for the wireframe, framework-agnostic. |
| `wireframe.html` | The full static reference sheet — all 9 screens, desktop + mobile mockups, with rationale text. Open directly in a browser. |

## What this is (and isn't)

This is a **flat reference sheet**: each screen is drawn twice as a fixed
900px "desktop" frame and a fixed 322px "mobile" frame, side by side, for
visual audit and handoff. Nothing here is clickable or animated — that's
intentional, so a reviewer can see both breakpoints of every screen at a
glance without navigating anything.

It is **not** the same file as the interactive prototype (if one exists
alongside this in the repo) — that's a live, single, truly responsive app
shell with real navigation and motion. This wireframe reference is the
static specification of the same design language; the prototype is its
runnable proof. Match implementation to this reference's structure and
values regardless of which one you're looking at, since both should agree.

## Design philosophy

PredictEd is a tool of **care, not surveillance** — "a calm morning to-do
list of people to care for," not "a control room of alarms."

- Risk is never shown alone — every flag is paired with a plain-English
  reason. Never render a bare score or color by itself.
- Risk colors (`--risk-high/-med/-low`) are muted and used only as small
  dots, pill backgrounds, or thin bar fills — **never** as a row/card
  background wash.
- The bursary-clearance chip (`.chip-neutral`) is neutral grey, always —
  same visual weight as a metadata label, never a status alert.
- The Coordinator (HOD) role sees everything but can act on nothing except
  messaging an advisor (`.esc-row` / `.m-student-card` "Message advisor"
  button on the Escalations screen — the only action anywhere in that role).
- Cohort/advisor differences are framed as capacity or programme-stage
  language ("may need support," "harder transition stage"), never as rank,
  score, or blame — see `.support-note` / `.ontrack-note` and the caption
  under the Cohort Risk Overview bars.

## Tokens

See `tokens.css` for exact values. Summary:

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF8F3` | App background |
| `--card` | `#FFFFFF` | Cards, rows |
| `--border` | `#E8E3D9` | Hairline borders |
| `--text` / `--text-soft` / `--text-faint` | `#33302B` / `#79746C` / `#AFA99D` | Text hierarchy |
| `--accent` / `--accent-soft` / `--accent-dark` | `#4F6FCB` / `#EEF1FB` / `#3E58A8` | The one calm blue |
| `--risk-high` / `-med` / `-low` | `#C97B72` / `#C99A4A` / `#6E9E79` | Dots, pills, bar fills only |
| `--neutral-bg` / `--neutral-text` | `#F1EDE4` / `#8A8478` | Bursary chip only |
| `--radius-lg` / `-md` / `-sm` | `16px` / `10px` / `7px` | Sheets / cards / small controls |
| `--shadow` | soft double shadow | No hard drop shadows anywhere |

## Screen inventory & key components per screen

| # | Screen | Role | Key classes to reuse |
|---|---|---|---|
| 1 | Login | Shared | `.login-card`, `.login-motto`, `.field-mock`, `.demo-hint` |
| 2 | Dashboard | Advisor | `.summary-row`/`.m-summary-row`, `.filter-bar`, `.student-row`/`.m-student-card`, `.risk-dot`, `.status-chip` |
| 3 | Student profile | Advisor | `.profile-header`, `.chip-neutral`, `.gauge-card` (SVG gauge), `.reason-card`/`.reason-fill`, `.trend-card` (SVG sparkline), `.log-item` |
| 4 | Log intervention | Advisor | `.segmented`/`.seg-opt`, `.textarea-mock`, side panel (desktop) vs full-screen sheet (mobile) |
| 5 | Weekly digest | Advisor | `.digest-stat-row`, `.digest-delta` |
| 6 | Settings | Advisor | `.settings-tabs`/`.settings-tab`, `.toggle-mock`, `.tier-note` |
| 7 | Department overview | HOD | `.summary-row`, `.trend-card`, `.bars-card`/`.level-bar-row` |
| 8 | Outreach coverage | HOD | `.cov-table` (desktop) / `.m-student-card` (mobile), `.support-note`, `.ontrack-note` |
| 9 | Escalations | HOD | `.esc-row`, `.esc-days`, "Message advisor" button |

## Responsive approach used in this reference

Each screen's desktop and mobile mockups are **separate markup blocks**
(`.app-desktop` vs `.app-mobile`) sitting side by side, because this file's
job is a visual audit sheet, not a running responsive layout. When you
implement the real screen, don't duplicate markup like this — write one
component whose CSS reflows at a single `880px` breakpoint (see the
`predicted-design-reference` prototype folder, if present in this repo, for
the live single-markup pattern: e.g. `.list-row` there does with one class
what `.student-row` + `.m-student-card` do here with two).

## Non-goals / guardrails

- Don't give the HOD role any control that touches a student directly
  (email, log intervention, mark resolved). Only "Message advisor" exists.
- Don't use fee/payment data anywhere except the single neutral bursary chip
  on the student profile.
- Don't rank, score, or leaderboard advisors.
- Don't turn risk dots into full-row/card background colors.
- Don't add a second accent color.
