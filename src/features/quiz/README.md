# Quiz creator

Teacher-oriented form at `/quiz/create`. Any logged-in user can open it; `App.tsx` does not check role.

## What the user sees

Title, description, category, difficulty, time limit (minutes), 4-option MCQs, optional explanation. Submit shows a dialog with the quiz key. True/False toggle and draft auto-save are commented out in the UI.

## Data

- Create: real `POST /quiz` through `useCreateQuiz` → `createBackendQuiz`.
- Drafts: `localStorage` key `quiz-draft` via `useQuizAutoSave` (save/load UI disabled; `clearQuiz()` still runs after submit).

## File map

```
components/QuizCreator.tsx   form + success dialog
hooks/useCreateQuiz.ts       form → BackendCreateQuizRequest
hooks/useQuizAutoSave.ts     localStorage draft
types/schema.ts              Zod quizFormSchema / questionSchema
utils/optionUtils.ts         option IDs
utils/quizMapper.ts          unused (create hook maps itself)
constants/quizConstants.ts   validation, defaults (schema duplicates some numbers)
```

## Gaps

- Form `timeLimit` is minutes; game treats `StandardQuiz.timeLimit` as seconds per question.
- Zod `MIN_QUESTIONS` in constants is 5; schema allows 1.
- No `DashboardLayout`, so the rest of the app’s nav is missing on this page.
