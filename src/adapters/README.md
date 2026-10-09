# Adapters

Data layer between UI and two quiz sources. UI imports from `src/adapters/index.ts` only.

```
UI
 ↓
quizService.ts          fetchAllQuizzes / fetchQuizById / fetchRandomQuiz
 ↓
services/               fetch + normalize
 ↓
api/                    raw HTTP          normalizers/   API → StandardQuiz
constants/              URLs, flags       mocks/         used when USE_REAL_API is false
```

## Sources

**OpenTDB** (`https://opentdb.com`, native `fetch`):

- `GET /api.php`, `GET /api_category.php`, token request/reset (tokens are never attached to question fetches).
- Rate limit 5.5s between calls; retry on 429.

**Backend** (`VITE_API_BASE_URL` or `https://api.kahoot.uz`, axios + Bearer):

| Function | HTTP | Path |
|----------|------|------|
| List | GET | `/quiz` |
| By id | GET | `/quiz/:id` |
| Mine | GET | `/quiz/my` (exported, unused) |
| Create | POST | `/quiz` |
| Join | POST | `/quiz/join` `{ quizKey }` |

`BACKEND_CONFIG.USE_REAL_API` is `true`, so mocks in `mocks/mockQuizzes.ts` are unused in production flow.

## Normalized types

See `src/types/quiz.ts`. `correctAnswerId` is the **answer string**, not an option id. List items from `GET /quiz` have empty `questions`; a playable quiz comes from join.

## Gaps

- OpenTDB `opentdb_*` ids in `fetchQuizById` ignore the id and fetch a new quiz.
- `time_limit` treated as minutes × 60 in the backend normalizer vs seconds per question in OpenTDB/game.
- Leaderboard HTTP helpers were removed; types remain for later.
