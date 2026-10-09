# Game (custom quizzes)

Students join a teacher quiz by key and play with a per-question timer. Scoring is **1 point per correct answer** (no difficulty multiplier). Results stay on screen; nothing is persisted.

## Routes

| Path | What |
|------|------|
| `/join` | Enter a quiz key, or land on `/join?code=ABC123` and auto-join. `POST /quiz/join`, then navigate with quiz in location state. |
| `/quiz/:quizId/play` | Ready → play → scoreboard. Direct URL uses `quizId` as the join key. |

## State machine (`useGameEngine` + `gameReducer`)

```
IDLE → START_QUIZ → PLAYING ⇄ FEEDBACK → FINISHED
                         ↑                    ↑
                    NEXT_QUESTION        END_QUIZ_EARLY
RESET_GAME → IDLE
```

Timer ticks every 1s while `PLAYING`. Timeout records an unanswered question and goes to `FEEDBACK`. After 2s (`FEEDBACK_DISPLAY_DURATION`) the engine auto-advances.

## File map

```
components/   GameEngine, JoinPage, QuestionCard, Timer, ProgressBar, ScoreBoard
              Leaderboard, QuizWithLeaderboard (built, not mounted)
hooks/        useGameEngine
reducers/     gameReducer + per-action handlers
constants/    DEFAULT_TIME_PER_QUESTION (30s), feedback, tick
types/        GameState / GameAction; leaderboard types unused
```

## Gaps

- `LOADING` and `FINISH_QUIZ` are defined but never produced.
- Leaderboard exports are commented out (`backend not ready`).
- Join normalizer can treat `time_limit` as minutes × 60, so per-question timers can be huge.
- No localStorage; scores are not sent to the server.
