# Kahoot.uz

Frontend for **Kahoot.uz**, a quiz platform for students and teachers. Teachers create quizzes and classrooms; students join by code or play public trivia from OpenTDB.

This repo is the React SPA only. The original backend at `api.kahoot.uz` is gone. A new backend spec lives in the sibling folder `../Kahoot-backend/`.

## Stack

React 19, Vite 7, TypeScript (strict), Tailwind 3, shadcn/ui, TanStack Query, react-router 7, axios, Zod. Package manager: **pnpm**.

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build
pnpm preview
pnpm lint
```

Copy [`.env.example`](.env.example) to `.env` if you need to override defaults:

```bash
VITE_API_BASE_URL=https://api.kahoot.uz
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

Without `.env`, the app uses `https://api.kahoot.uz` and a built-in Google client ID. Auth, quiz list, create, and join still call that API; it will fail until the new backend is running.

## Routes

| Path | Who | What |
|------|-----|------|
| `/` | Public | Landing |
| `/login`, `/register`, `/register/teacher`, `/forgot-password` | Public | Auth |
| `/dashboard` | Logged in | Teacher or student home |
| `/quizzes` | Logged in | Custom quiz list |
| `/quiz/create` | Logged in | Create quiz (intended for teachers) |
| `/join` | Logged in | Join a teacher quiz by key |
| `/quiz/:quizId/play` | Logged in | Play a custom quiz |
| `/explore` | Logged in | OpenTDB category browser |
| `/explore/configure` | Logged in | Trivia settings |
| `/play/opentdb` | Logged in | Play an OpenTDB quiz |
| `/classrooms` | Logged in | Classroom UI (mock data) |

## What's real vs mock

**Talks to the old REST API:** login, register, Google sign-in, list quizzes (`GET /quiz`), create quiz (`POST /quiz`), join by key (`POST /quiz/join`).

**Mock or local only:** teacher/student dashboard stats, recent activity, score chart, all classrooms, leaderboard (UI exists, not mounted), OpenTDB results (written to `localStorage` under `eduquiz_*`, never shown), forgot-password (fake delay).

**OpenTDB** is called directly from the browser (`https://opentdb.com`). Correct answers currently arrive in the client; the new backend will hide them.

## Folders

```
src/
  adapters/          Dual-source quiz data (OpenTDB + backend)
  features/auth      Login, register, Google, forgot-password
  features/dashboard Teacher/student home and quiz grid
  features/quiz      Quiz creator
  features/game      Join-by-code + custom quiz engine
  features/explore   OpenTDB categories and trivia engine
  features/classroom Classrooms (mock)
  context/           AuthContext (JWT in localStorage)
  lib/               axios, TanStack Query, cn()
  pages/             Landing page
  components/        Shell + shadcn/ui
```

Each feature folder has its own README.

## More docs

- [Project summary](docs/PROJECT_SUMMARY.md) — what was built, gaps, next steps
- [Historical PRD](eduquiz_final_prd.md) — original 7-day plan (stale in places)
- [Changelog](CHANGELOG.md)
- [Backend spec](../Kahoot-backend/README.md) — Express + Prisma design for the rewrite
