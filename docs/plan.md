# Plan: Fix 7 Quizo Frontend Issues

This plan addresses routing persistence, form styling, quiz/leaderboard page structure, dashboard improvements, a new `/join` route, leaderboard positioning, and quiz early-exit logic.

---

## Issues & Action Steps

### 1. Fix Page Refresh Routing

**Problem:** User gets redirected to `/dashboard` after refresh even when on `/classrooms`

**Root Cause:** The `AuthContext` loads user from localStorage asynchronously. During loading, `user` is `null`, causing route guards to redirect prematurely.

**Solution:**
- Add an `isLoading` state to `AuthContext`
- In `App.tsx`, show a loading spinner/skeleton while auth is loading
- Only evaluate route guards after auth state is resolved

**Files to modify:**
- `src/context/AuthContext.tsx` - Add `isLoading` state
- `src/App.tsx` - Add loading check before rendering routes

---

### 2. Center Auth Form Text

**Problem:** Login/SignUp/ForgotPassword form titles are left-aligned

**Solution:**
- Add `text-center` class to `CardHeader` component in all auth forms

**Files to modify:**
- `src/features/auth/components/LoginForm.tsx`
- `src/features/auth/components/RegisterForm.tsx`
- `src/features/auth/components/ForgotPasswordForm.tsx`

---

### 3. Open Quiz & Leaderboard as Full Pages (Not Popups)

**Problem:** Quiz and leaderboard currently render as popups/dialogs

**Solution:**
- Create a dedicated `LeaderboardPage.tsx` component
- Update routing to use full page routes like `/quiz/:id/play` and `/quiz/:id/leaderboard`
- Remove Dialog wrappers around quiz/leaderboard content

**Files to create:**
- `src/features/game/components/LeaderboardPage.tsx`

**Files to modify:**
- `src/App.tsx` - Add new routes
- Remove Dialog usage from quiz/game components where applicable

---

### 4. Fix Teacher Dashboard, Sidebar & Improve Quiz Creator

**Problem:** Teacher dashboard and sidebar need improvements, quiz creator needs better UX

**Solution:**
- Refactor `TeacherDashboard.tsx` layout for better organization
- Update `app-sidebar.tsx` with teacher-specific navigation (My Quizzes, Analytics, etc.)
- Enhance `QuizCreator.tsx` with improved form flow and validation feedback

**Files to modify:**
- `src/features/dashboard/components/TeacherDashboard.tsx`
- `src/components/app-sidebar.tsx`
- `src/features/quiz/components/QuizCreator.tsx`

---

### 5. Add `/join` Route

**Problem:** No dedicated route for students to join a quiz via code

**Solution:**
- Create a `JoinPage.tsx` component with a simple centered input for "Join via code"
- Add `/join` route in `App.tsx`

**Files to create:**
- `src/features/game/components/JoinPage.tsx`

**Files to modify:**
- `src/App.tsx` - Add `/join` route

**Component structure:**
```tsx
// Centered card with:
// - Title: "Join a Quiz"
// - Input: Quiz code entry
// - Button: "Join"
```

---

### 6. Leaderboard on Left Side of Quiz

**Problem:** Leaderboard position needs to be on the left side of the quiz

**Solution:**
- Update game page layout to use a two-column grid
- Left column: Leaderboard (fixed width ~300px)
- Right column: Quiz questions (flexible width)

**Files to modify:**
- `src/features/game/components/GameEngine.tsx`
- `src/features/game/components/BackendGame.tsx`

**Layout structure:**
```tsx
<div className="grid grid-cols-[300px_1fr] gap-6">
  <Leaderboard />
  <QuizContent />
</div>
```

---

### 7. End Quiz Anytime (Unanswered = Incorrect)

**Problem:** No way to end quiz early; unanswered questions need to be marked as incorrect (null)

**Solution:**
- Add `END_QUIZ_EARLY` action type in `gameReducer.ts`
- When triggered, mark all remaining unanswered questions as `{ selectedAnswer: null, isCorrect: false }`
- Set quiz status to `'FINISHED'`
- Add "End Quiz" button in game UI

**Files to modify:**
- `src/features/game/reducers/gameReducer.ts` - Add `END_QUIZ_EARLY` action
- `src/features/game/components/GameEngine.tsx` - Add "End Quiz" button
- `src/features/game/components/BackendGame.tsx` - Add "End Quiz" button

---

## Questions to Clarify

1. **Auth loading state** - Should the loading spinner be full-page or just affect protected content?
   - *Recommendation: Full-page skeleton for smoother UX*

2. **Leaderboard scope** - Is the leaderboard for a single quiz session or global rankings?
   - *This affects the data model and API needed*

3. **Join route authentication** - Should `/join` require login first, or allow code entry then prompt login?
   - *Recommendation: Allow code entry first, redirect to login if needed*

4. **Quiz creator improvements** - What specific enhancements are needed?
   - Better question types?
   - Image upload?
   - Preview mode?
   - Auto-save?

---

## Implementation Order

1. **Fix auth loading state** (Issue 1) - Foundation for other fixes
2. **Center auth forms** (Issue 2) - Quick win
3. **Add `/join` route** (Issue 5) - New feature, independent
4. **End quiz functionality** (Issue 7) - Game logic
5. **Leaderboard page & positioning** (Issues 3 & 6) - Related changes
6. **Dashboard & sidebar improvements** (Issue 4) - Larger refactor
