# Kahoot.uz — project summary

Refresher for picking this repo back up. Built in January 2026 as a 7-day frontend sprint (`docs/todo/day-0` through `day-7`). Originally named EduQuiz / Quizo / Quizora; the product name is now **Kahoot.uz**.

## What it is

A student/teacher quiz SPA. Teachers write multiple-choice quizzes and get a 6-character key. Students join with that key, or browse OpenTDB trivia under Explore. Classrooms exist as UI only.

## Architecture

Feature folders under `src/features/`. UI never talks to OpenTDB or the backend directly for quizzes. It goes through `src/adapters`:

```
UI  →  quizService  →  services/  →  api/ + normalizers/
                                 →  StandardQuiz / StandardQuestion
```

`StandardQuiz` in `src/types/quiz.ts` is the shared shape. OpenTDB HTML entities are decoded and options shuffled in the OpenTDB normalizer. Backend snake_case (`time_limit`, `quiz_key`, `correct_answer`) is mapped to camelCase.

Auth is a React context. JWT and a JSON user blob live in `localStorage`. Axios injects `Authorization: Bearer`. A 401 clears storage and redirects to `/login`. Roles: UI uses `student | teacher | admin`; the old backend used `user` for students, mapped in `AuthContext`.

## Feature status

| Feature | Status |
|---------|--------|
| Auth (email + Google) | Real API. Forgot-password is a mock delay. |
| Dashboard | Shell is real. Quiz grid hits `GET /quiz`. Stats, chart, activity are mocks. |
| Quiz creator | Real `POST /quiz`. Draft auto-save is disabled in the UI. |
| Game (custom) | Real `POST /quiz/join`. Scoring is +1 per correct, client-side. Leaderboard not mounted. |
| Explore | Live OpenTDB. Difficulty scoring 0.5 / 1 / 1.5. Results in localStorage, no history page. |
| Classroom | Full mock UI. Codes use alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789`. |
| Adapters | Split into api / normalizers / services. `BACKEND_CONFIG.USE_REAL_API` is `true`. |

## Known gaps

- The old backend (`https://api.kahoot.uz`) is gone. Auth and custom quizzes will fail until a new one exists.
- Correct answers ship to the browser (join response and OpenTDB). Scores are computed client-side and can be faked.
- `timeLimit` is inconsistent: the creator form collects **minutes**; the game engine treats `quiz.timeLimit` as **seconds per question**; the backend normalizer multiplies by 60.
- Route guards are “logged in or not”. Students can open `/quiz/create`. Sidebar links `/analytics`, `/settings`, `/support` have no pages.
- Teacher quizzes score 1 point each; Explore uses difficulty points. Two separate game engines (`GameEngine` vs `OpenTDBGame`).
- Google signup does not send role, so `/register/teacher` + Google cannot create a teacher.
- `QuizConfigDialog` is leftover; the live path is `QuizConfigPage`.
- localStorage keys still use the `eduquiz_*` prefix on purpose.

## Next steps

The rewrite is specified in `../Kahoot-backend/`. Headline changes:

1. Server-side play sessions: the client gets options only; the server checks answers and clocks.
2. Clean `/api/v1` camelCase API generated from Zod → OpenAPI → frontend types.
3. OpenTDB mirrored into Postgres so Explore answers can be verified too.
4. Classrooms, stats, history, and leaderboards become real.
5. Live hosted games (PIN, Socket.IO) are designed as phase L1, after self-paced play works.

Frontend wiring of that API is phase **F1** in the backend docs. Do not start F1 until B0–B9 of the backend are done.
