# Changelog

All notable changes to the EduQuiz Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - Day 5 Explore & OpenTDB Integration (2026-01-10)

#### Explore Feature - Category Browser
- [Explore] New `/explore` route with OpenTDB category browser
- [Explore] `CategoryBrowser` component displaying all 24 OpenTDB trivia categories as cards
- [Explore] `CategoryCard` component with gradient backgrounds, emoji icons, and hover animations
- [Explore] Search functionality to filter categories by name
- [Explore] `QuizConfigDialog` modal for configuring quiz before starting:
  - Difficulty selection (Easy 0.5pts / Medium 1pt / Hard 1.5pts)
  - Time per question (5-60 seconds, default 10s)
  - Number of questions (5-50, presets: 5, 10, 15, 20, 25, 30)
  - Summary showing points per question, total time, and max possible points

#### OpenTDB Game Engine
- [Explore] `OpenTDBGame` component - dedicated game engine for OpenTDB quizzes
- [Explore] Difficulty-based scoring system:
  - Easy: 0.5 points per correct answer
  - Medium: 1 point per correct answer
  - Hard: 1.5 points per correct answer
- [Explore] Real-time countdown timer with visual progress bars
- [Explore] Immediate feedback on answer selection (green/red highlighting)
- [Explore] Auto-advance to next question after 1.5s feedback delay
- [Explore] Time-up handling (auto-submit with 0 points if timer expires)
- [Explore] Finished state with detailed score summary:
  - Points earned vs max possible
  - Accuracy percentage
  - Correct/Incorrect count
  - Total time spent
- [Explore] Answer review section showing all questions with user answers
- [Explore] Play Again and Back to Categories actions

#### Quiz Results Storage (localStorage)
- [Explore] `useQuizResults` hook for managing quiz history in localStorage
- [Explore] `QuizResult` interface tracking:
  - Quiz metadata (id, title, category, difficulty)
  - Score and total points
  - Correct answers count and percentage
  - Time spent per question
  - Detailed answer history with points earned
- [Explore] Results persist across sessions (localStorage)
- [Explore] Stats aggregation: total quizzes, total points, average score
- [Explore] Foundation ready for backend API sync (POST results later)

#### Adapters & API Integration (Day 5 PRD Tasks)
- [Adapters] `src/adapters/types.ts` with OpenTDB and Backend API interfaces
- [Adapters] `src/adapters/utils.ts` with shared utilities:
  - `decodeHtmlEntities()` - decode HTML entities from OpenTDB
  - `shuffleArray()` - Fisher-Yates shuffle for options
  - `generateQuestionId()` - unique ID generation
  - `cleanCategoryName()` - strip "Entertainment:" prefixes
- [Adapters] `src/adapters/opentdbAdapter.ts` - OpenTDB API normalization:
  - Fetch questions with category, difficulty, amount parameters
  - Normalize to StandardQuiz format
  - Handle API response codes (rate limit, no results, etc.)
  - Fetch categories list
- [Adapters] `src/adapters/backendAdapter.ts` - Custom backend adapter:
  - Mock implementation for development
  - Ready for real API integration (change `USE_REAL_BACKEND` flag)
  - Auth token injection via axios interceptors
- [Adapters] `src/adapters/quizService.ts` - Unified quiz service:
  - `fetchAllQuizzes()` - combine both sources
  - `fetchQuizById()` - fetch single quiz
  - Source filtering (all/opentdb/custom)
- [Adapters] `src/adapters/index.ts` - Public API exports
- [Lib] `src/lib/axios.ts` - Configured axios instance:
  - Auth token injection via request interceptor
  - Error handling (401 → logout, 403, 404, 500)
  - Separate client for OpenTDB (no auth)

#### Dashboard Updates
- [Dashboard] `useQuizzes` hook updated to use adapters:
  - Source filtering (all/opentdb/custom)
  - Returns `openTDBQuizzes` and `customQuizzes` counts
- [Dashboard] `QuizzesPage` with source filter tabs:
  - All Sources, OpenTDB, Custom buttons
  - Shows count badges on each tab
- [Dashboard] `QuizCard` source badges with distinct colors:
  - OpenTDB: emerald/green
  - Custom: violet/purple
- [Dashboard] `getSourceBadgeColor()` utility function

#### Navigation
- [UI] Added "Explore" link in sidebar navigation with Sparkles icon
- [Routes] `/explore` - Category browser page
- [Routes] `/play/opentdb` - OpenTDB game engine with query params

#### Constants & Types
- [Explore] `CATEGORY_ICONS` - emoji mapping for all 24 categories
- [Explore] `CATEGORY_COLORS` - gradient color mapping for category cards
- [Explore] `DIFFICULTY_POINTS` - scoring multipliers (0.5/1/1.5)
- [Explore] `DEFAULT_QUIZ_CONFIG` - default time (10s), questions (10)
- [Explore] `QUIZ_CONFIG_LIMITS` - min/max for questions and time
- [Explore] `STORAGE_KEYS` - localStorage key constants

### Improved - Dashboard UX Enhancements (2026-01-10)
- [Dashboard] Enhanced `ScoreChart` tooltip with custom interactive design:
  - Larger invisible hover area (10px radius) for easier interaction
  - Smooth scale animation on hover (1.3x zoom with transition)
  - Custom dark-themed tooltip showing quiz title and score
  - Arrow pointer for better visual connection to data point
  - Fade-in and zoom-in animations for smooth appearance
  - Drop shadow effect on hovered points
- [Dashboard] Fixed `ScoreChart` width to properly fill the card container:
  - Dynamic width calculation based on container size
  - Responsive to window resize events
  - Proper SVG dimensions for full-width rendering
- [Dashboard] Dynamic breadcrumb navigation:
  - Created `useBreadcrumb` hook for route-based breadcrumb generation
  - Breadcrumb updates based on current route (/dashboard, /quizzes, /quiz/create, etc.)
  - Support for quiz play route patterns with proper navigation hierarchy
  - Clickable breadcrumb links for improved navigation
- [Dashboard] Updated `QuickActions` terminology:
  - Changed "Join Classroom" to "Join Test" (more appropriate for quiz platform)
  - Updated icon from Users to ClipboardList
  - Renamed variables: classCode → testCode for better clarity
  - Updated helper text to reflect test joining functionality

### Added - Student Dashboard Redesign (2026-01-09)
- [Dashboard] Personalized student dashboard with real-time statistics
- [Dashboard] `StatCard` component displaying 4 key metrics:
  - Quizzes Completed (with CheckCircle2 icon)
  - Average Score (with TrendingUp icon and performance color)
  - Current Streak (with Flame icon in orange)
  - Total Time Spent (with Clock icon)
- [Dashboard] `ScoreChart` component with SVG line chart showing last 10 quiz scores:
  - Grid lines for better readability
  - Data points with interactive hover tooltips
  - Smooth line interpolation for score trend visualization
  - Configurable height (200px) and colors via CHART_CONFIG
- [Dashboard] `RecentActivity` component showing last 5 quiz attempts:
  - Performance-based color coding (green/blue/yellow/red)
  - Retry button for quizzes with score < 70%
  - Relative time display (e.g., "2 hours ago", "3 days ago")
  - Empty state for new users with motivational message
- [Dashboard] `QuickActions` component with:
  - "Browse Quizzes" button navigating to /quizzes
  - "Join Classroom" feature with 6-digit code input validation
  - Uppercase, alphanumeric code format enforcement
- [Dashboard] `QuizzesPage` component (separated quiz browser from dashboard):
  - Quiz grid with search and filtering
  - "Create Quiz" button for teachers only
  - Protected route at `/quizzes`
- [Dashboard] Student statistics types:
  - `StudentStats` interface with quizzesCompleted, averageScore, currentStreak, totalTimeSpent
  - `QuizAttempt` interface tracking individual quiz completions
  - `ScoreDataPoint` interface for chart visualization
- [Dashboard] New hooks:
  - `useStudentStats` with TanStack Query (5min cache)
  - `useRecentActivity` with TanStack Query (2min cache)
- [Dashboard] Utility functions in `statsUtils.ts`:
  - `getPerformanceLevel()` - categorizes scores (EXCELLENT/GOOD/AVERAGE/POOR)
  - `formatTimeSpent()` - converts minutes to readable format (1h 30m)
  - `calculateAverageScore()` - computes average from attempts array
  - `getRelativeTime()` - formats timestamps ("2 hours ago")
  - `formatScorePercentage()` - converts score to percentage (78.5%)
- [Dashboard] Enhanced constants:
  - `SCORE_THRESHOLDS` (90/75/60 for performance levels)
  - `SCORE_COLORS` (color mappings for each performance level)
  - `CHART_CONFIG` (chart dimensions, colors, data point limits)
  - `TIME_FORMAT` (time conversion constants)
  - `RECENT_ACTIVITY_LIMIT` (5 attempts shown)
- [Dashboard] Mock data for development:
  - `MOCK_STUDENT_STATS` (24 quizzes, 78.5% avg, 5-day streak, 360min)
  - `MOCK_RECENT_ACTIVITY` (5 quiz attempts with varied performance)
  - `MOCK_SCORE_HISTORY` (10 data points for chart)
- [Routes] Added `/quizzes` protected route for quiz browsing
- [Navigation] Sidebar already includes "Quizzes" link (no changes needed)
- [UX] Separated concerns: Dashboard for stats, QuizzesPage for quiz browsing
- [Clean Code] All components follow established patterns:
  - Constants extraction for configuration
  - Utility functions for calculations
  - Memoized callbacks with useCallback
  - Proper TypeScript typing (no any)
  - Atomic, single-responsibility components

### Refactored - Clean Architecture (2026-01-09)
- [Auth] Extracted constants to `auth/constants/authConstants.ts` (MAX_INPUT_LENGTH, error messages, storage keys)
- [Auth] Created `auth/utils/pasteHandler.ts` with reusable `createPasteHandler()` factory
- [Auth] Applied `useCallback` memoization to all auth hooks (useLogin, useRegister, useForgotPassword)
- [Auth] Updated LoginForm, RegisterForm, ForgotPasswordForm to use centralized constants and utilities
- [Dashboard] Extracted constants to `dashboard/constants/dashboardConstants.ts` (query keys, colors, API config)
- [Dashboard] Created `dashboard/utils/quizCardUtils.ts` with `getDifficultyColor()`, `getSourceBadge()`, `formatTimeLimit()`
- [Dashboard] Refactored QuizCard to use extracted utilities and memoized callbacks
- [Dashboard] Updated useQuizzes hook to use centralized QUERY_KEYS and error messages
- [Quiz] Extracted constants to `quiz/constants/quizConstants.ts` (QUIZ_VALIDATION, DEFAULT_VALUES, TIMING)
- [Quiz] Created `quiz/utils/optionUtils.ts` with `generateOptionId()`, `createOption()`, `createOptions()`
- [Quiz] Created `quiz/utils/quizMapper.ts` with `mapFormDataToQuiz()` for data transformation
- [Quiz] Updated QuizCreator to use constants and utility functions
- [Quiz] Applied `useCallback` to QuizCreator handlers (handleAutoSave, addQuestion)
- [Game] Fixed unused parameter warning in `startQuizAction.ts`
- [All Features] Updated public API `index.ts` exports to include constants and utilities
- [Docs] Added `docs/refactoring/clean-architecture-summary.md` with full refactoring documentation

### Added - Day 4 Game Engine (2026-01-09)
- [Game] Complete game engine with state machine using useReducer
- [Game] `GameEngine` container component with full quiz playthrough
- [Game] `useGameEngine` hook managing game state (IDLE → LOADING → PLAYING → FEEDBACK → FINISHED)
- [Game] `QuestionCard` component with option selection and visual feedback
- [Game] `Timer` component with countdown, progress bar, and color-coded warnings
- [Game] `ProgressBar` component showing question progress
- [Game] `ScoreBoard` component with detailed results and answer review
- [Game] Auto-advance after 2 seconds of feedback per question
- [Game] Timer auto-advance when time runs out (0s)
- [Game] Answer validation with immediate visual feedback (green/red)
- [Game] Score calculation and tracking throughout quiz
- [Game] User answer tracking with time spent per question
- [Game] Final results with percentage, statistics, and performance message
- [Game] Answer review showing correct/incorrect with explanations
- [Game] Play Again and Go to Dashboard actions
- [Game] Mock quiz data with 5 JavaScript questions
- [Game] Protected route at `/quiz/:quizId/play`
- [Game] Integration with dashboard QuizCard "Play Now" button
- [Game] State transitions: IDLE, LOADING, PLAYING, FEEDBACK, FINISHED
- [Game] Automatic cleanup of timer intervals on unmount
- [Game] Responsive design for mobile and desktop
- [Types] GameState, GameStatus, GameAction types
- [Types] UseGameEngineReturn interface

### Added - Day 3 Quiz Creator (2026-01-09)
- [Quiz] `QuizCreator` component with react-hook-form and zod validation
- [Quiz] `useFieldArray` for dynamic questions and options management
- [Quiz] `quizFormSchema` and `questionSchema` with comprehensive validation rules
- [Quiz] `useQuizAutoSave` hook with localStorage persistence
- [Quiz] `useCreateQuiz` hook with mock API integration
- [Quiz] Auto-save functionality that saves form state on every change
- [Quiz] Quiz form with title, description, category, difficulty, and time limit fields
- [Quiz] Dynamic question management (add/remove questions)
- [Quiz] Multiple choice options with radio button selection for correct answer
- [Quiz] Optional explanation field for each question
- [Quiz] Minimum 5 questions validation
- [Quiz] Last saved timestamp display
- [Quiz] Protected route at `/quiz/create`
- [Quiz] Types exported via public API: QuizFormData, QuestionFormData
- [Dashboard] "Create Quiz" button in Dashboard header for easy navigation
- Installed dependencies: react-hook-form, zod, @hookform/resolvers

### Added - Day 2 Dashboard (2026-01-09)
- [Dashboard] `StandardQuiz` and `StandardQuestion` interfaces in `src/types/quiz.ts`
- [Dashboard] `GameStatus` and `GameState` types for quiz engine foundation
- [Dashboard] `DashboardLayoutProps` type in `src/features/dashboard/types/index.ts`
- [Dashboard] TanStack Query provider in `src/lib/query-provider.tsx` with 5min staleTime
- [Dashboard] `DashboardLayout` component with responsive sidebar navigation
- [Dashboard] Mobile drawer menu with backdrop overlay for sidebar
- [Dashboard] `QuizCard` component displaying quiz metadata (title, description, difficulty, source, time limit)
- [Dashboard] `QuizGrid` component with responsive layout (1/2/3 columns)
- [Dashboard] `useQuizzes` hook with TanStack Query integration
- [Dashboard] Mock quiz data with 15 sample quizzes in `src/features/dashboard/data/mock-quizzes.ts`
- [Dashboard] Loading and error states in QuizGrid
- [Dashboard] Difficulty color-coding (green/yellow/red) and source badges (OpenTDB/Custom)
- [UI] Navigation links in sidebar (Dashboard, Quizzes, Classrooms, Settings)
- [UI] User info section in sidebar showing name, email, and role
- [UI] Active route highlighting in navigation
- [UI] Upgraded to shadcn sidebar component with collapsible functionality
- [UI] `AppSidebar` component with icon-collapsible mode and professional design
- [UI] `NavUser` component with dropdown menu for user profile actions
- [UI] `NavMain` and `NavSecondary` components for structured navigation
- [UI] User avatar with initials fallback in sidebar footer
- [UI] Dropdown menu with Account, Billing, Notifications, and Logout options
- [UI] Breadcrumb navigation in header
- [UI] SidebarProvider wrapping entire dashboard layout
- [UI] shadcn components: separator, sheet, tooltip, skeleton, breadcrumb, dropdown-menu, avatar

### Added - Day 0-1 Auth & Architecture
- Day-specific TODO documentation in `docs/todo/` for tracking sprint progress (day-0 through day-7)
- Landing page component at `/` with links to login and PRD
- `LandingPage` component in `src/pages/LandingPage.tsx`
- `LogoutButton` component extracted into `src/features/auth/components/LogoutButton.tsx`
- `Dashboard` component moved to `src/features/dashboard/components/Dashboard.tsx`
- `RegisterForm` component in `src/features/auth/components/RegisterForm.tsx` with full validation logic
- Public API exports for dashboard feature via `src/features/dashboard/index.ts`
- Public API exports for auth feature via `src/features/auth/index.ts`
- Auth feature types in `src/features/auth/types/index.ts`
- `useLogin` and `useRegister` custom hooks in `src/features/auth/hooks/`
- Forgot password page at `/forgot-password` with email confirmation UI
- OAuth buttons (Google) in login and register forms
- Password visibility toggle with Eye/EyeOff icons
- Input validation: maxLength 150 chars, paste prevention on password fields
- ARIA labels and autocomplete attributes for accessibility
- CHANGELOG.md for tracking version history

### Changed
- [Dashboard] Dashboard component now uses DashboardLayout wrapper and QuizGrid
- [Dashboard] Main app wrapped in QueryProvider for TanStack Query
- [Dashboard] Upgraded DashboardLayout to use shadcn sidebar primitives with SidebarProvider
- [Dashboard] Sidebar now collapsible to icon-only mode for better space utilization
- [Dashboard] Content area now has rounded corners (rounded-xl) with white background
- [Dashboard] Main background color matches sidebar for cohesive design
- [Dashboard] Removed sidebar border for cleaner appearance
- [Dashboard] Header integrated into content container for cohesive design
- [Dashboard] Adjusted spacing and typography for more compact, professional appearance
- [Dashboard] QuizCard "Play Now" button now has white background with dark hover state
- [UI] Replaced custom sidebar implementation with shadcn sidebar component
- [UI] Enhanced user profile section with dropdown menu and actions
- [UI] Reduced auth form width from max-w-md to max-w-sm for slimmer, more professional appearance
- [Auth] Reverted to shadcn default styles (removed custom indigo colors)
- [Auth] Removed Apple OAuth button, kept Google only
- Refactored routing structure: landing at `/`, dashboard at `/dashboard`
- Moved dashboard UI from `App.tsx` to feature-specific component following feature-first architecture
- Updated `App.tsx` to import dashboard from feature public API
- Login/Register routes now redirect to `/dashboard` instead of `/`
- AuthContext register function parameter `password` marked as `_password` to satisfy TypeScript strict rules
- Complete UI overhaul for LoginForm and RegisterForm to match modern design standards
- Improved form layouts with cleaner spacing and better UX
- Extracted auth logic from components to dedicated hooks (separation of concerns)
- RegisterForm now uses firstName/lastName fields instead of single name field

### Fixed
- TypeScript error with `verbatimModuleSyntax` by using type-only imports for `ReactNode`, `User`, and `AuthResponse`
- Duplicate component declarations in `RegisterForm.tsx`
- Unused parameter warnings in `AuthContext.tsx`

## [0.1.0] - 2026-01-08

### Added
- Initial Vite + React + TypeScript setup
- Tailwind CSS and shadcn/ui configuration
- Feature-first folder structure (`features/auth`, `features/dashboard`, `features/game`)
- AuthContext with JWT-based authentication and localStorage persistence
- Mock login/register functionality
- Protected routes using React Router v7
- Type definitions in `src/types/auth.ts`
- Basic UI components (Button, Card, Input, Label, Form) via shadcn/ui

### Infrastructure
- Absolute imports configured with `@/` alias
- TypeScript strict mode with `verbatimModuleSyntax` enabled
- Build and dev scripts configured
- PRD document (`eduquiz_final_prd.md`) defining project scope and architecture

---

## Version History Guidelines

### Types of Changes
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

### Commit Message Format
When adding to changelog, reference the feature/task:
- `[Auth]` - Authentication related
- `[Dashboard]` - Dashboard features
- `[Quiz]` - Quiz engine and creator
- `[UI]` - UI components and styling
- `[Infra]` - Infrastructure and tooling
- `[Docs]` - Documentation updates
