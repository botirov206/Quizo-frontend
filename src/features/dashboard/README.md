# Dashboard

Home after login, plus the custom-quiz browser. Uses `DashboardLayout` (sidebar + breadcrumbs), also wrapped around Explore and Classrooms.

## What the user sees

- **Teacher** (`/dashboard`): mock stats, mock “My Quizzes” list, mock recent student results, shortcuts.
- **Student** (`/dashboard`): mock stats, mock score chart, mock recent attempts, join-by-code.
- **Both** (`/quizzes`): grid of custom quizzes from `GET /quiz`. Teachers get a Create button.

## Data

| Surface | Source |
|---------|--------|
| Quiz grid (`useQuizzes`) | Real `fetchAllQuizzes({ source: 'custom' })` |
| Teacher stats / list / results | Mock `data/mock-teacher-stats.ts` |
| Student stats / activity / chart | Mock `data/mock-student-stats.ts` (chart imports mock directly) |
| Copy class code | Hardcoded `'ABC123'` |

## File map

```
components/             Dashboard, TeacherDashboard, StudentDashboard, layout, cards, charts
components/filters/     SourceFilter (unused; Explore replaced dual-source tabs)
hooks/                  useQuizzes, useTeacherStats, useStudentStats, useRecentActivity, useBreadcrumb
data/                   mock teacher/student stats; mock-quizzes.ts unused
utils/                  card and stats helpers
constants/              query keys, colors, mock delay
```

## Gaps

- Stats are not wired to `GET /quiz/my` or attempts.
- `TeacherQuickActions` used to point at `/results` (no route); now `/classrooms`.
- `/quiz/create` does not use `DashboardLayout`, so breadcrumbs for that path never show.
- Student trends on stat cards are hardcoded strings.
