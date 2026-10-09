# Explore (OpenTDB trivia)

Browse public trivia, configure difficulty/count/time, play. Scoring uses **difficulty points**: easy 0.5, medium 1, hard 1.5.

## Routes

| Path | What |
|------|------|
| `/explore` | Category grid from OpenTDB, search, refresh. |
| `/explore/configure?categoryId=&categoryName=&icon=` | Difficulty, time, question count. |
| `/play/opentdb?category=&difficulty=&amount=&time=` | Fetch → ready → play → results. |

Config is passed as **URL query**. `localStorage['eduquiz_last_config']` is written but never read by `OpenTDBGame`.

## Data

- Categories and questions: live OpenTDB (`https://opentdb.com`), 5.5s rate limit, retry on 429.
- Results: `useQuizResults` writes `eduquiz_results` (cap 100). No history UI.

## File map

```
components/   CategoryBrowser, CategoryCard, QuizConfigPage, OpenTDBGame
              QuizConfigDialog (unused leftover)
hooks/        useCategories, useQuizResults
types/        Category, QuizConfig, QuizResult, DIFFICULTY_POINTS
constants/    icons, colors, storage keys, presets
```

`OpenTDBGame` is a separate engine from `features/game` (useState, not the reducer). Timeout now auto-advances (same as answering).

## Gaps

- Answers come from OpenTDB in the client; scores can be faked.
- Results are write-only until a history page exists.
- `QuizConfigDialog` is dead code.
