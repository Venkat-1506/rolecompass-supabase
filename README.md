# RoleCompass

A career-intelligence web platform that connects **candidates** and **employers**. Candidates discover jobs and roles, benchmark their skills against real role requirements, follow a structured learning roadmap, and track every application through the recruitment pipeline. Employers publish roles, review candidates, and manage their hiring pipeline — all in one glass-themed, fully responsive React app.

> Front-end only: there is no backend or database. All accounts, jobs, applications and learning progress persist in the browser via `localStorage`.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| UI | React 19 |
| Build | Vite 6 (`@vitejs/plugin-react`) |
| Routing | React Router v7 (nested layouts, route guards) |
| Icons | lucide-react |
| Fonts | Fontsource — Outfit, Plus Jakarta Sans |
| Styling | Hand-rolled CSS design system (tokens, glass surfaces, motion, responsive layers) |
| State / Data | React Context (`AppProviders`) + `localStorage` persistence |

## Getting Started

Requires Node.js 18+ and npm.

```bash
npm install       # install dependencies
npm run dev       # start dev server  -> http://localhost:5173
npm run build     # production build  -> dist/
npm run preview   # serve the build   -> http://localhost:4173
```

## Demo Accounts

All seeded accounts use the password **`password123`**:

| Role | Name | Email |
| --- | --- | --- |
| Candidate | Arjun Verma | `arjun.verma@rolecompass.demo` |
| Candidate | Arun | `arun@gmail.com` |
| Employer | Priya Sundaram (Zoho) | `priya.s@zoho.com` |

To reset all local data, clear site data for the origin (or run `localStorage.clear()` in the browser console) and reload.

## Features

### Public workspace
- Home page with hero job search, trending roles and company highlights
- Job explorer (`/jobs`, `/explore`) with keyword, location, category and work-mode filters
- Company directory and detailed company pages with logo fallbacks
- Role catalogue (`/roles`) with role details, required skills and recommended resources
- How It Works, About and Contact pages
- Role fit scoring (`calculateRoleCompassFit`) shared across the app

### Candidate workspace (`/candidate`, protected)
- Dashboard with target role, readiness score, skill gaps and recent applications
- Roles & Fit — pick target roles and see readiness/fit updates
- Learning Hub — step-based roadmap with sequential gating, resource filters (category/type), progress tracking, timeline view and per-role learning records
- Skill detail pages with in-progress/completed states
- Applications Tracker — status tabs, selection detail view, recruitment pipeline stepper, recruiter notes and submitted screening details (mobile: focused detail view with back link)
- Resume page with ATS tester (score + analysis modal), profile and preferences

### Employer workspace (`/employer`, protected)
- Company setup with company logo upload (stored as overrides)
- Job creation wizard
- Job management, candidate list and hiring pipeline views
- Employer overview dashboard

### Platform
- Role-based route guards (`GuestRoute` / `ProtectedRoute` / `allowedRole`)
- Session, accounts, jobs, applications and learning records persisted in `localStorage`
- Shared employer/candidate job listings with `companyOverrides` for logos/details
- Page transitions, scroll-reveal and hover micro-interactions (CSS-driven, no animation library)
- Application modal with scroll locking (background stays fixed while open)
- Fully responsive: mobile bottom navigation, adaptive header with live height offset, breakpoints at 639/767/1023px

## Project Structure

```
src/
├── App.jsx                  # providers + router + global styles
├── app/
│   ├── layouts/             # PublicLayout, CandidateLayout, EmployerLayout
│   ├── providers/           # AppProviders (auth, accounts, jobs, learning state)
│   └── router/              # AppRouter (routes), RouteGuards
├── components/
│   ├── forms/               # ApplicationModal, AtsAnalysisModal
│   ├── glass/               # GlassCard, GlassSurface (glass design primitives)
│   ├── layout/              # PageShell, PageContainer, Section, Stack, Grid, Cluster
│   ├── navigation/          # GlobalHeader, MobileBottomNav, footer, nav menus
│   └── ui/                  # Button, Input, Select, Modal, Drawer, Tabs, Toast, ...
├── data/                    # seed data: companies, jobs, roles, skills, learning, users
├── pages/
│   ├── auth/  onboarding/  public/  candidate/  employer/
├── services/                # storage (localStorage wrapper), learning, resume, ATS, api
├── styles/                  # tokens, globals, glass, motion, animations, responsive, ...
└── utils/                   # scrollLock, helpers
```

## Data & Persistence

Everything is stored in `localStorage` under the `rolecompass_` prefix, e.g. `rolecompass_rc_active_session` (active session), `rolecompass_rc_accounts`, `rolecompass_applications`, `rolecompass_learning_records`, `rolecompass_jobs`, `rolecompass_company_overrides`. Seed data ships with the app, so a fresh browser starts with demo jobs, companies and accounts.

## Verification

There is no test framework in this project. Builds are verified with `npm run build`, and UI behaviour has been smoke-tested in headless Chrome across 320×568, 375×667, 390×844, 430×932 and 1280×800 viewports (no horizontal overflow, content clear of fixed header/bottom nav).
