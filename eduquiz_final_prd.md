# 📂 Product Requirements Document (PRD): EduQuiz Platform

| **Project Name** | EduQuiz (Internal Code: *Project-Gamify*) |
| :--- | :--- |
| **Document ID** | PRD-EQ-001 |
| **Version** | 1.2 (Unified Implementation Master) |
| **Role** | Full-Stack Educational Gamification Platform |
| **Status** | **In Progress (Day 2 - Dashboard Phase)** |
| **Tech Stack** | React (Vite), TypeScript, Tailwind (shadcn/ui), TanStack Query |
| **Backend Interface** | REST API (Node/Express OR Python/Django - Agnostic) |
| **Architecture** | **Feature-First (Feature Sliced Design Lite)** |
| **Target Audience** | Students, Teachers, Self-Learners (Primary: Uzbekistan) |

---

## 1. 📘 Executive Summary

### The Vision: "YouTube for Quizzes"

EduQuiz is a scalable, full-stack educational platform that bridges the gap between static learning and interactive gamification. We are transitioning from a simple Vanilla JS quiz script to a robust platform that evolves quizzes into a content ecosystem where users can **play** generic content, **create** custom educational material, and **track** progress within virtual classrooms.

### The Problem Statement

Traditional learning management systems (LMS) are boring and static. Simple quiz apps lack classroom management features. There is a critical need for a hybrid platform that combines:
- **Open Data**: Fun, public trivia for engagement
- **Curated Curriculum**: Teacher-made tests aligned with educational goals

### The Engineering Goal

To build a codebase that is **modular, testable, and scalable**. We are moving away from organizing files by *type* (e.g., a giant `components` folder) toward organizing by **domain** (e.g., `features/quiz`, `features/auth`). The system must handle the "Dual-Mode" requirement: consuming data from **two completely different sources** (External API & Internal DB) while providing a unified, seamless User Experience (UX).

### Core Goals (v1)

1. **Unified Experience**: Seamlessly blend third-party trivia (OpenTDB) with custom internal quizzes.
2. **Teacher Empowerment**: Allow teachers to create quizzes and view student results easily.
3. **Scalable Architecture**: Build a frontend that can handle the transition from v1 (Async Play) to v2 (Real-Time Socket.io) without a rewrite.

### Success Metrics

- **User Retention**: % of students who complete more than 3 quizzes
- **Creator Activity**: Number of custom quizzes created by teachers
- **System Reliability**: Zero frontend crashes during data ingestion from different APIs
- **Response Time**: < 200ms for quiz loading after data fetch

---

## 2. 🚀 Product Scope: Versions & Roadmap

### v1: Minimum Lovable Product (MLP) - *Current Sprint*

**Focus**: Core Loop & Architecture

The v1 release is focused on building the foundation with essential features only. We are NOT building real-time multiplayer yet.

#### Key Features (In Scope)

1. **Authentication System**: Secure JWT-based Login/Register with persistence (✅ *Done*)
2. **Teacher Dashboard**: View created quizzes, student results, and manage classrooms
3. **Student Dashboard**: Join classes, view quiz history, see personal stats
4. **Quiz Creator**: Dynamic form builder for creating quizzes with multiple choice/boolean questions
5. **The Game Engine**: State-machine driven interface for taking quizzes (Timer, Scoring, Feedback)
6. **Classroom System**: Students join via 6-digit code; Teachers track progress
7. **Dual-Source Content**: Play quizzes from OpenTDB API AND Custom Backend DB

#### Out of Scope (v1)

- Real-time multiplayer lobbies
- Team/Group mode
- Rich media in questions (images/audio)
- AI question generation
- Paid/Premium tiers
- Mobile native apps
- Offline mode

### v2: Future Vision (Post-MLP)

- **Real-Time Sockets**: Convert the "Async" game engine to a "Live" lobby (Kahoot style)
- **Team Mode**: Shared scores for groups (Baamboozle style)
- **Rich Media**: Support images/audio in questions
- **AI Question Generator**: GPT-powered question creation from curriculum
- **Dark Mode**: Built-in support via Tailwind/shadcn
- **Analytics Dashboard**: Deep insights into student performance
- **Mobile Apps**: React Native or Progressive Web App

---

## 3. 👥 User Personas

### 🎓 Persona A: The Student (Ali, 16 years old)

- **Demographics**: High school student in Tashkent
- **Goal**: Wants to test knowledge in a fun and fast way. Wants instant feedback.
- **Pain Points**: 
  - Hates boring forms and traditional tests
  - Loses motivation with delayed feedback
  - Frustrated when progress is lost due to internet issues
- **Key User Journey**: Logs in → Joins a class via code → Plays a quiz → Sees leaderboard → Reviews mistakes
- **Technical Needs**: Mobile-responsive UI, fast load times, clear progress indicators

### 👩‍🏫 Persona B: The Teacher (Aziza, 32 years old)

- **Demographics**: Math teacher managing 4 classes (120 students total)
- **Goal**: Wants to assign homework that grades itself. Needs to see who's struggling.
- **Pain Points**: 
  - Existing tools are too complex or expensive
  - Manual grading takes hours
  - Difficult to track individual student progress
- **Key User Journey**: Creates a "Math Midterm" quiz → Copies the invite code → Shares with students → Views the "Results Grid" → Identifies struggling students
- **Technical Needs**: Simple quiz creation workflow, clear analytics, bulk class management

### 🧑‍💼 Persona C: The Self-Learner (Jasur, 24 years old)

- **Demographics**: University student preparing for IELTS
- **Goal**: Practice vocabulary and grammar without joining formal classes
- **Pain Points**: Needs varied content, wants to track improvement over time
- **Key User Journey**: Browses public quizzes → Plays OpenTDB trivia → Views personal stats → Retakes quizzes to improve scores
- **Technical Needs**: Public quiz library, personal progress tracking, variety in content

---

## 4. 🏗️ Technical Architecture (The Standard)

This is the most critical section for the development team. We strictly adhere to **Feature-First Architecture**.

### 4.1 The Philosophy: "Lego Brick" Rule

Instead of a monolithic application where all components are mixed together, we treat every feature as a **mini-application**.

**Core Principles:**
- **Encapsulation**: A feature should contain its own UI, logic, and state
- **Independence**: If we want to remove the "Quiz" feature, we should be able to delete the `src/features/quiz` folder, and the rest of the app (Auth, Dashboard) should still work perfectly
- **Single Responsibility**: Each feature handles one domain concern

### 4.2 The Mandated Folder Structure

```text
src/
├── adapters/          # 🛡️ THE WALL: Normalizes API data -> StandardQuiz
│   ├── opentdbAdapter.ts
│   ├── backendAdapter.ts
│   └── types.ts
│
├── components/        # 🌍 SHARED UI (Buttons, Inputs, Layouts - shadcn/ui)
│   ├── ui/           # shadcn/ui primitives
│   └── layouts/      # Reusable layouts
│
├── config/            # ⚙️ Global App Config
│   ├── env.ts        # Environment variables
│   └── routes.ts     # Route constants
│
├── context/           # 🧠 Global App State
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/             # 🪝 Global Shared Hooks
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
│
├── lib/               # 📚 Third-party setups
│   ├── axios.ts      # Axios instance configuration
│   ├── firebase.ts   # Firebase setup (if needed)
│   └── utils.ts      # Utility functions
│
├── pages/             # 🧭 Page Components (Routing Entry Points)
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── QuizPage.tsx
│
├── types/             # 🔷 Global TypeScript Interfaces
│   ├── user.ts
│   ├── quiz.ts
│   └── api.ts
│
└── features/          # 📦 THE CORE DOMAIN LOGIC
    │
    ├── auth/          # Feature: Authentication
    │   ├── api/
    │   │   ├── login.ts
    │   │   └── register.ts
    │   ├── components/
    │   │   ├── LoginForm.tsx
    │   │   └── RegisterForm.tsx
    │   ├── hooks/
    │   │   └── useAuth.ts
    │   ├── types/
    │   │   └── index.ts
    │   └── index.ts   # Public API exports
    │
    ├── dashboard/     # Feature: Dashboards
    │   ├── api/
    │   ├── components/
    │   │   ├── TeacherDashboard.tsx
    │   │   ├── StudentDashboard.tsx
    │   │   └── StatsCard.tsx
    │   ├── hooks/
    │   │   └── useDashboardData.ts
    │   └── index.ts
    │
    └── quiz/          # Feature: The Game Engine
        ├── api/       # API calls specific to quizzes
        │   ├── getQuiz.ts
        │   ├── submitAnswer.ts
        │   └── getResults.ts
        │
        ├── components/# UI Components used ONLY in quiz feature
        │   ├── QuizCard.tsx
        │   ├── Timer.tsx
        │   ├── QuestionCard.tsx
        │   ├── OptionsGrid.tsx
        │   └── ScoreBoard.tsx
        │
        ├── hooks/     # Logic specific to quizzes
        │   ├── useQuizTimer.ts
        │   ├── useQuizScore.ts
        │   └── useGameEngine.ts
        │
        ├── types/     # TypeScript types specific to quizzes
        │   └── index.ts
        │
        ├── stores/    # State specific to this feature
        │   └── gameStore.ts
        │
        └── index.ts   # 🚪 PUBLIC API: Exports only what app needs
```

### 4.3 The "Public API" Rule (`index.ts`)

Each feature folder MUST have an `index.ts` file at its root that acts as the feature's public interface.

**The Rule:**
- **Internal**: `QuizCard`, `useQuizTimer`, and `api/getQuiz` are internal implementation details
- **External**: The rest of the app (e.g., the `QuizPage`) should **only** import from `features/quiz`
- It should NOT reach deep into `features/quiz/components/QuizCard`

**Examples:**

❌ **Bad** (Breaking encapsulation):
```typescript
import { QuizCard } from '@/features/quiz/components/QuizCard'
import { useQuizTimer } from '@/features/quiz/hooks/useQuizTimer'
```

✅ **Good** (Using public API):
```typescript
import { QuizCard, useQuizTimer } from '@/features/quiz'
```

**Implementation Example** (`features/quiz/index.ts`):
```typescript
// Public Components
export { QuizCard } from './components/QuizCard'
export { ScoreBoard } from './components/ScoreBoard'

// Public Hooks
export { useGameEngine } from './hooks/useGameEngine'
export { useQuizTimer } from './hooks/useQuizTimer'

// Public Types
export type { GameState, QuizQuestion } from './types'
```

---

## 5. 🧩 Data Flow & Design Patterns

### 5.1 The Adapter Pattern (CRITICAL)

This is the **most important pattern** in the entire application. Since we have two data sources (OpenTDB and Custom Backend), we strictly separate the **Data Layer** from the **UI Layer**.

**The Golden Rule:**
> The Game Component **NEVER** speaks to the API directly. It speaks to the **Adapter**.

**Flow:**
1. **Input**: API Response (JSON from Node/Python/OpenTDB)
2. **Process**: Adapter Function (`normalizeQuizData`)
3. **Output**: `StandardQuiz` Interface (The format our UI expects)

**Visual Flow:**
```
[OpenTDB API] ──→ [opentdbAdapter.ts] ──→ [StandardQuiz] ──→ [Game UI]
[Backend API] ──→ [backendAdapter.ts] ──→ [StandardQuiz] ──→ [Game UI]
```

**Implementation Requirements:**
- All adapters live in `src/adapters/`
- Each adapter exports a `normalize()` function
- The UI layer ONLY works with `StandardQuiz` type
- If API format changes, ONLY the adapter file is updated

### 5.2 State Management Strategy

We use different tools for different types of state:

#### Global User State: React Context
- **Tool**: Context API
- **Use Case**: Authentication state (user info, token, role)
- **Why**: Low frequency updates, needs to be accessible everywhere
- **Location**: `src/context/AuthContext.tsx`

#### Server Data: TanStack Query (React Query)
- **Tool**: TanStack Query (React Query)
- **Use Case**: Quizzes, classrooms, student lists, results
- **Why**: Built-in caching, loading states, refetching, optimistic updates
- **Location**: API calls in `features/*/api/`
- **CRITICAL**: We do NOT put server data in Redux/Context. React Query handles it.

#### Local Game State: useReducer
- **Tool**: useReducer hook
- **Use Case**: Quiz game flow (complex state machine)
- **Why**: The quiz has complex states (`IDLE`, `LOADING`, `PLAYING`, `PAUSED`, `FINISHED`). A reducer is cleaner than 10 `useState` variables.
- **Location**: `features/quiz/hooks/useGameEngine.ts`

**State Machine Example:**
```typescript
type GameState = 
  | { status: 'IDLE' }
  | { status: 'LOADING' }
  | { status: 'PLAYING', currentQuestion: number, timeLeft: number }
  | { status: 'FEEDBACK', isCorrect: boolean }
  | { status: 'FINISHED', score: number, totalQuestions: number }
```

#### Form State: React Hook Form
- **Tool**: react-hook-form + zod
- **Use Case**: Quiz creator, login/register forms
- **Why**: Declarative validation, better performance than controlled components
- **Location**: Form components in respective features

### 5.3 Container/Presentation Pattern

- **Containers** (Smart Components): Handle logic using hooks (`useQuiz`, `useAuth`)
- **Presentational** (Dumb Components): Pure UI, receive data via props
- **Example**: `QuizContainer.tsx` fetches data → passes to → `QuizCard.tsx` which only renders

---

## 6. 🧑‍💻 Developer Experience (DX) & Coding Standards

### 6.1 Technology Stack

**Core:**
- React 18 (with Hooks)
- TypeScript 5.x
- Vite (Build tool)

**Styling:**
- Tailwind CSS 3.x
- `clsx` and `tailwind-merge` for dynamic classes
- **shadcn/ui** (Radix UI primitives)

**Forms & Validation:**
- `react-hook-form` (Form state management)
- `zod` (Schema validation)

**Data Fetching:**
- TanStack Query v5 (React Query)
- Axios (HTTP client)

**UI & Icons:**
- Lucide React (Icon library)
- Radix UI (Accessible primitives via shadcn/ui)

**Routing:**
- React Router v6 (Data Routers)

### 6.2 Coding Standards (STRICT)

**Copilot Instructions:** When generating code for this project, adhere to these rules:

1. **Strict TypeScript**
   - No `any` types allowed
   - Use `unknown` if unsure, then narrow with type guards
   - Define all interfaces in `src/types/` or feature-specific `types/`

2. **Absolute Imports**
   - Always use `@/` aliases
   - Example: `@/components/ui/button` NOT `../../../components/ui/button`

3. **Component Composition**
   - Build small, reusable components (Atomic Design)
   - If a component exceeds 150 lines, split it
   - Single Responsibility Principle

4. **Naming Conventions**
   - **Folders**: `kebab-case` (e.g., `quiz-creator`)
   - **Components**: `PascalCase` (e.g., `QuizCard.tsx`)
   - **Functions/Hooks**: `camelCase` (e.g., `useQuizScore`)
   - **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_QUESTIONS`)

5. **Tailwind CSS**
   - Use utility classes, avoid custom CSS
   - Use `clsx` for conditional classes
   - Use `cn()` helper from shadcn/ui for merging

6. **Clean Code Principles**
   - Functions should be small and do one thing (SRP)
   - Max 3-4 parameters per function
   - Early returns over nested if-else
   - Descriptive variable names (no `data`, `temp`, `x`)

7. **Comments**
   - Code should be self-documenting
   - Add comments for "why", not "what"
   - Use JSDoc for complex functions

---

## 7. 📝 Data Dictionary (The Contracts)

These are the **Single Source of Truth** types. All code must conform to these interfaces.

### 7.1 The User

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt?: string;
}
```

### 7.2 The Standard Quiz (Internal Format)

*The frontend expects this format, always.*

```typescript
export interface StandardQuestion {
  id: string;
  text: string;
  options: string[]; // Shuffled [A, B, C, D]
  correctAnswerId: string; // The value to match against
  type: 'multiple' | 'boolean';
  explanation?: string; // Optional feedback text
}

export interface StandardQuiz {
  id: string;
  title: string;
  description?: string;
  source: 'opentdb' | 'custom';
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // seconds per question
  questions: StandardQuestion[];
  createdBy?: string; // User ID (for custom quizzes)
  createdAt?: string;
}
```

### 7.3 Game State

```typescript
export type GameStatus = 'IDLE' | 'LOADING' | 'PLAYING' | 'FEEDBACK' | 'FINISHED';

export interface GameState {
  status: GameStatus;
  currentQuestionIndex: number;
  score: number;
  answers: Record<string, string>; // questionId: selectedAnswerId
  timeLeft: number;
  quiz: StandardQuiz | null;
}
```

### 7.4 Classroom

```typescript
export interface Classroom {
  id: string;
  name: string;
  code: string; // 6-digit join code
  teacherId: string;
  studentIds: string[];
  createdAt: string;
}
```

---

## 8. 🧠 Core Features & Functional Requirements

### 8.1 Authentication (The Passport)

**Requirement ID**: AUTH-01

**Description**: Secure JWT-based authentication handling multiple sessions with persistent login.

**User Flow**:
1. User visits login page
2. Enters email/password
3. Backend validates and returns JWT token
4. Frontend stores JWT in LocalStorage
5. Updates global AuthContext
6. Redirects to Dashboard

**Technical Requirements**:
- JWT stored in LocalStorage (v1), HttpOnly cookies (v2)
- Token expiration handling with refresh logic
- Protected routes using `ProtectedRoute` wrapper
- Role-based access control (RBAC)

**UI Requirements**:
- Clean forms using `shadcn/ui` components
- Real-time validation with `zod`
- Loading states during API calls
- Clear error messages

**API Endpoints**:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me` (verify token)

### 8.2 The Universal Quiz Engine (The Core)

**Requirement ID**: ENGINE-01

**Description**: A state-machine-driven interface for taking quizzes that works identically with data from any source.

**Critical Constraint**: 
Must use the **Adapter Pattern**. The Game Component **must not know** if data comes from OpenTDB or the internal DB.

**State Machine**:
```
IDLE → LOADING → PLAYING → FEEDBACK → FINISHED
                    ↓          ↑
                    └──────────┘ (next question)
```

**States Explained**:
- `IDLE`: No quiz loaded
- `LOADING`: Fetching quiz data
- `PLAYING`: User answering current question, timer active
- `FEEDBACK`: Show correct/incorrect for 2 seconds
- `FINISHED`: Show final score and summary

**UI Requirements**:
- Progress bar (Question 3/10)
- Countdown timer (visual + numeric)
- Options grid (A, B, C, D buttons)
- Immediate feedback (green/red color)
- Final score screen with review option

**Technical Requirements**:
- Use `useReducer` for state management
- Implement timer with `useEffect` + `setInterval`
- Shuffle options on load (Fisher-Yates)
- Calculate score: correct answers / total questions × 100
- Store answers for review later

**API Endpoints**:
- `GET /api/quiz/:id` (fetch quiz data)
- `POST /api/quiz/:id/submit` (submit full game result)

### 8.3 Quiz Creator (Teacher Tool)

**Requirement ID**: CREATE-01

**Description**: Dynamic form builder for teachers to create custom quizzes with validation.

**User Flow**:
1. Teacher clicks "Create Quiz"
2. Fills in title, description, category, difficulty
3. Adds questions one by one
4. For each question: text + 2-4 options + mark correct answer
5. Preview before saving
6. Publishes to their classroom

**Technical Requirements**:
- Use `react-hook-form` with `useFieldArray`
- Minimum 2 options per question
- Maximum 4 options per question
- At least 1 question required
- Exactly 1 correct answer per question
- Field validation with `zod` schemas

**UI Requirements**:
- Add/Remove question buttons
- Drag to reorder questions (optional v1)
- Live character count
- Auto-save to LocalStorage (prevent data loss)
- Confirmation before leaving page with unsaved changes

**Validation Rules**:
```typescript
const questionSchema = z.object({
  text: z.string().min(10, "Question too short").max(500),
  type: z.enum(['multiple', 'boolean']),
  options: z.array(z.string().min(1)).min(2).max(4),
  correctAnswerId: z.string().min(1, "Select correct answer")
})
```

**API Endpoints**:
- `POST /api/quiz/create`
- `PUT /api/quiz/:id/update`
- `DELETE /api/quiz/:id`

### 8.4 Dashboards

**Requirement ID**: DASH-01

**Description**: Role-specific dashboards for teachers and students.

#### Teacher Dashboard

**Features**:
- List of created quizzes (cards with stats)
- Student management (view enrolled students)
- Classroom management (create/delete classes)
- Results grid (students × quizzes matrix)
- Quick actions (Create Quiz, Generate Code, Download Results)

**Data Display**:
- Total quizzes created
- Total students enrolled
- Average class score
- Recent activity feed

#### Student Dashboard

**Features**:
- Join class via 6-digit code
- Browse available quizzes
- View personal quiz history
- See leaderboard (if enabled)
- Track progress (badges, streaks)

**Data Display**:
- Quizzes completed
- Average score
- Best subject/category
- Recent attempts

**Technical Requirements**:
- Use TanStack Query for data fetching
- Implement pagination for quiz lists (20 per page)
- Real-time updates via polling (5-second interval) or WebSockets (v2)
- Responsive grid layout (1 col mobile, 2 col tablet, 3 col desktop)

### 8.5 Classrooms & Social Features

**Requirement ID**: CLASS-01

**Description**: Group management system for teachers and students.

**Teacher Actions**:
- Create Classroom (name + auto-generate 6-digit code)
- View enrolled students
- Remove students
- Archive/Delete classroom
- Assign quizzes to specific classrooms

**Student Actions**:
- Join Classroom (enter 6-digit code)
- Leave Classroom
- View classmates (if teacher enables)
- See class leaderboard

**Data Relationships**:
- Many-to-Many: Students ↔ Classrooms
- One-to-Many: Teacher → Classrooms
- One-to-Many: Classroom → Quizzes

**Technical Requirements**:
- Code generation: 6-digit alphanumeric (exclude ambiguous: 0, O, 1, I)
- Code uniqueness check before saving
- Expiration: codes valid for 30 days (optional v2)

---

## 9. 🔐 Security & Privacy

### 9.1 Authentication Security

- **JWT Storage**: LocalStorage (v1), migrate to HttpOnly cookies (v2)
- **Token Expiration**: 7 days, with refresh token rotation
- **Password Requirements**: Min 8 chars, 1 uppercase, 1 number
- **Brute Force Protection**: Rate limiting on login endpoint (5 attempts/15 min)

### 9.2 Input Validation

- **Frontend**: Validate all inputs with `zod` before submission
- **Backend**: Double validation, never trust client
- **XSS Prevention**: Escape HTML entities from OpenTDB before rendering
- **SQL Injection**: Use parameterized queries (ORM like Prisma)

### 9.3 Route Protection

- **Protected Routes**: `/dashboard/*`, `/quiz/*`, `/create/*`
- **Public Routes**: `/`, `/login`, `/register`
- **Role-Based Access**:
  - Teacher-only: `/create`, `/classroom/manage`
  - Student-only: `/classroom/join`
  - Admin-only: `/admin/*` (future)

### 9.4 Data Privacy

- **Student Data**: Names, emails, scores are private by default
- **Teacher Data**: Quiz content is private until published
- **Leaderboards**: Opt-in only, anonymous nicknames allowed
- **GDPR Compliance** (v2): Right to deletion, data export

---

## 10. 📊 Analytics & Metrics (Implementation)

### 10.1 User Metrics

**Track in Frontend** (analytics.ts):
- Quiz completion rate
- Average time per question
- Most popular quiz categories
- Bounce rate on quiz start
- Device breakdown (mobile vs desktop)

**Track in Backend** (database):
- Daily active users (DAU)
- Weekly active users (WAU)
- Quiz creation rate
- Student enrollment rate
- Teacher retention

### 10.2 Performance Metrics

**Frontend**:
- Time to Interactive (TTI) < 3 seconds
- First Contentful Paint (FCP) < 1.5 seconds
- Bundle size < 300KB (gzipped)

**Backend**:
- API response time < 200ms (p95)
- Database query time < 50ms (p95)
- Error rate < 0.1%

### 10.3 Feature-Specific Metrics

**Quiz Engine**:
- Average quiz completion time
- Questions answered per session
- Feedback interaction rate

**Quiz Creator**:
- Average questions per quiz
- Save vs Publish ratio
- Time spent in editor

---

## 11. 🗓️ Implementation Plan: 7-Day Sprint

### ✅ Day 0: Architecture & Foundation (COMPLETED)

**Goal**: Initialize the "Shell"

**Completed Tasks**:
- [x] Setup Vite + React + TypeScript
- [x] Install Tailwind CSS & shadcn/ui
- [x] Configure Absolute Imports (`@/`)
- [x] Define `StandardQuiz` TypeScript Interface
- [x] Setup folder structure

### ✅ Day 1: Authentication & Routing (COMPLETED)

**Goal**: Secure the app

**Completed Tasks**:
- [x] Build `AuthContext` (JWT, LocalStorage Persistence)
- [x] Build `LoginForm` & `RegisterForm` (UI)
- [x] Setup React Router & `ProtectedRoute` wrapper
- [x] Implement "Mock" Login API
- [x] Test role-based routing

### 🚧 Day 2: The Dashboard & Data Fetching (CURRENT PRIORITY)

**Goal**: The user's home base

**Status**: **IN PROGRESS**

**Tasks**:
- [ ] **Layout**: Create `DashboardLayout` (Sidebar, Navbar, Mobile Menu)
  - Responsive sidebar (collapse on mobile)
  - User profile dropdown
  - Logout button
- [ ] **State**: Install TanStack Query (React Query)
  - Configure `QueryClient`
  - Setup `queryClient` provider
  - Create `useQuizzes` hook
- [ ] **UI**: Build `QuizGrid` and `QuizCard` components
  - Display quiz title, description, question count
  - Show quiz source badge (OpenTDB/Custom)
  - Add "Play Now" button
- [ ] **Mocking**: Create fake API response list of quizzes
  - Mock 10-15 sample quizzes
  - Include mix of OpenTDB and Custom
  - Test loading/error states

**Definition of Done**:
- Dashboard renders without errors
- Sidebar works on desktop and mobile
- Quiz cards display correctly
- TanStack Query successfully fetches mock data

### 📅 Day 3: The Quiz Creator (Forms)

**Goal**: Enable teachers to build content

**Tasks**:
- [ ] **Library Setup**: Install `react-hook-form` and `zod`
- [ ] **UI**: Build "Create Quiz" Page
  - Quiz metadata form (title, description, category, difficulty)
  - Question list with add/remove buttons
- [ ] **Logic**: Implement `useFieldArray`
  - Handle dynamic adding/removing of questions
  - Handle dynamic adding/removing of options per question
- [ ] **Validation**: Implement `zod` schemas
  - Ensure every question has text
  - Ensure every question has a correct answer
  - Ensure minimum 2 options per question
- [ ] **UX**: Add auto-save to LocalStorage
  - Prevent data loss on accidental close
  - Show "Unsaved changes" warning

**Acceptance Criteria**:
- Teacher can create a quiz with 5+ questions
- Validation prevents submission of incomplete data
- Form data persists in LocalStorage
- Successfully submits to mock API

### 📅 Day 4: The Game Engine (Core Logic)

**Goal**: The actual gameplay experience

**Tasks**:
- [ ] **State Machine**: Implement `useGameEngine` hook
  - States: `IDLE` → `LOADING` → `PLAYING` → `FEEDBACK` → `FINISHED`
  - Use `useReducer` for state management
- [ ] **Components**: Build game UI
  - `QuestionCard`: Display current question
  - `Timer`: Countdown with visual progress
  - `OptionsGrid`: A/B/C/D buttons
  - `ScoreBoard`: Final results screen
- [ ] **Logic**: Implement game mechanics
  - Scoring calculation (correct / total × 100)
  - Timer countdown (per question or total)
  - Answer validation
  - Transition animations between states
- [ ] **Summary**: Build "End Game" screen
  - Final score with percentage
  - Breakdown of correct/incorrect
  - "Review Answers" button
  - "Play Again" button

**Acceptance Criteria**:
- Quiz plays from start to finish without bugs
- Timer counts down correctly
- Score calculates accurately
- User can review wrong answers

### 📅 Day 5: The Adapters & API Integration

**Goal**: Connect the real data

**Tasks**:
- [ ] **OpenTDB Adapter**: Write `opentdbAdapter.ts`
  - Fetch trivia from OpenTDB API
  - Normalize to `StandardQuiz` format
  - Handle HTML entities decoding
  - Handle API errors gracefully
- [ ] **Backend Adapter**: Write `backendAdapter.ts`
  - Fetch from custom backend
  - Normalize to `StandardQuiz` format
  - Handle authentication headers
  - Handle API errors gracefully
- [ ] **Integration**: Update Dashboard
  - Fetch from BOTH sources
  - Display unified quiz list
  - Show source badge (OpenTDB/Custom)
  - Add filter by source
- [ ] **Testing**: Verify adapter pattern works
  - Game Engine works with OpenTDB data
  - Game Engine works with Backend data
  - No UI changes needed for different sources

**Acceptance Criteria**:
- Dashboard displays quizzes from both sources
- Playing an OpenTDB quiz works perfectly
- Playing a custom quiz works perfectly
- Adapters handle errors without crashing

### 📅 Day 6: Classrooms & Social Features

**Goal**: Group management

**Tasks**:
- [ ] **Student View**: Build "Join Class" feature
  - Input field for 6-digit code
  - Validation (code exists, not already joined)
  - Success message with class name
  - View enrolled classes list
- [ ] **Teacher View**: Build "My Students" section
  - Create new classroom form
  - Generate unique 6-digit code
  - View student list per classroom
  - Remove student action
  - Archive classroom action
- [ ] **API Integration**: Connect classroom endpoints
  - `POST /api/classroom/create`
  - `POST /api/classroom/join`
  - `GET /api/classroom/:id/students`
  - `DELETE /api/classroom/:id/student/:studentId`

**Acceptance Criteria**:
- Student can join classroom with code
- Teacher can create classroom and get code
- Teacher can view enrolled students
- Teacher can remove students

### 📅 Day 7: Polish & Deployment

**Goal**: Ship the MLP

**Tasks**:
- [ ] **Responsiveness**: Test on multiple devices
  - iPhone (Safari)
  - Android (Chrome)
  - Tablet (iPad)
  - Desktop (1920px, 1366px, 1024px)
- [ ] **Feedback**: Add Toast notifications
  - Success toasts (quiz completed, class joined)
  - Error toasts (network error, validation failed)
  - Info toasts (loading data)
- [ ] **Performance**: Optimize bundle
  - Code splitting with React.lazy
  - Optimize images (WebP format)
  - Remove unused dependencies
- [ ] **Testing**: Manual QA
  - Test all user flows end-to-end
  - Test error scenarios
  - Test with slow network (throttling)
- [ ] **Deploy**: Push to Vercel
  - Setup environment variables
  - Configure build settings
  - Test production build
  - Share demo link with stakeholders

**Definition of Done**:
- App works on mobile and desktop
- No console errors in production
- All features functional
- Deployed and accessible via URL

---

## 12. ⚠️ Risks & Mitigation Strategies

### 12.1 Technical Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Backend API Format Changes** (Node vs Django) | High | Medium | Strictly adhere to **Adapter Pattern**. If API changes, update only the Adapter file (`src/adapters/`), not UI components. Document API contracts clearly. |
| **"Spaghetti Code" in Game Engine** | High | Medium | Use `useReducer` instead of multiple `useState` to manage game flow, ensuring state transitions are predictable and testable. |
| **OpenTDB API Rate Limiting** | Medium | High | Implement caching with TanStack Query (5-minute cache). Add fallback to cached data. Consider mirroring OpenTDB data to our backend. |
| **State Management Complexity** | Medium | Medium | Follow strict separation: Context for auth, React Query for server data, useReducer for game state. No mixing. |
| **Time Constraint (7 Days)** | High | High | Rely heavily on `shadcn/ui` components to avoid custom CSS. Mock data immediately so we don't wait for backend. Cut features if needed (move to v2). |

### 12.2 Product Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **Low User Adoption** | High | Medium | Focus on Teacher onboarding with simple UI. Provide sample quizzes. Gather feedback early and iterate. |
| **Content Quality Issues** | Medium | Medium | Implement quiz review/approval system (v2). Provide quiz creation best practices guide. Add AI quality check (v2). |
| **Scope Creep** | High | High | Strictly adhere to v1 features list. Create v2 backlog for all "nice-to-haves". Communicate clearly with stakeholders. |

### 12.3 Security Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| **XSS via OpenTDB Content** | High | Medium | Sanitize ALL external content before rendering. Use DOMPurify library. Never use `dangerouslySetInnerHTML` without sanitization. |
| **JWT Token Theft** | High | Low | Use HttpOnly cookies (v2). Implement token rotation. Add XSS protection headers. Set CORS properly. |
| **Classroom Code Guessing** | Medium | Medium | Use 6-digit alphanumeric (not just numbers). Add rate limiting on join attempts. Log suspicious activity. |

---

## 13. 🎯 Acceptance Criteria (Launch Checklist)

Before marking v1 as "Done", all of the following must be true:

### Functionality
- [ ] User can register and login successfully
- [ ] User session persists across page refreshes
- [ ] Teacher can create a quiz with 5+ questions
- [ ] Student can play a quiz from start to finish
- [ ] Quiz timer works correctly
- [ ] Score calculation is accurate
- [ ] Student can join a classroom via code
- [ ] Teacher can view enrolled students
- [ ] Dashboard displays quizzes from OpenTDB AND custom backend
- [ ] Adapters successfully normalize data from both sources

### Performance
- [ ] Page load time < 3 seconds on 4G connection
- [ ] No layout shifts (CLS < 0.1)
- [ ] Smooth animations (60 FPS)
- [ ] Bundle size < 300KB gzipped

### Quality
- [ ] Zero TypeScript errors
- [ ] Zero console errors in production
- [ ] No `any` types in codebase
- [ ] All features work on Chrome, Safari, Firefox
- [ ] Mobile responsive (tested on iPhone and Android)

### User Experience
- [ ] Clear error messages for failed actions
- [ ] Loading states for all async operations
- [ ] Success feedback for completed actions
- [ ] Intuitive navigation
- [ ] No dead ends (user always has a next action)

---

## 14. 📚 Appendices

### Appendix A: API Contracts

#### Authentication

```typescript
// POST /api/auth/register
Request: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
}
Response: {
  user: User;
  token: string;
}

// POST /api/auth/login
Request: {
  email: string;
  password: string;
}
Response: {
  user: User;
  token: string;
}
```

#### Quizzes

```typescript
// GET /api/quizzes
Response: {
  quizzes: StandardQuiz[];
  total: number;
  page: number;
  pageSize: number;
}

// POST /api/quiz/create
Request: {
  title: string;
  description?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: StandardQuestion[];
}
Response: {
  quiz: StandardQuiz;
}
```

#### Classrooms

```typescript
// POST /api/classroom/create
Request: {
  name: string;
}
Response: {
  classroom: Classroom;
  code: string;
}

// POST /api/classroom/join
Request: {
  code: string;
}
Response: {
  classroom: Classroom;
  success: boolean;
}
```

### Appendix B: Environment Variables

```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3000/api
VITE_OPENTDB_API_URL=https://opentdb.com/api.php
VITE_APP_NAME=EduQuiz
VITE_ENABLE_ANALYTICS=false

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost:5432/eduquiz
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRY=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Appendix C: Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@tanstack/react-query": "^5.15.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "axios": "^1.6.2",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## 15. 🚢 Deployment Strategy

### Development
- **Environment**: Local (Vite dev server)
- **Backend**: Local Node/Django server
- **Database**: Local PostgreSQL

### Staging
- **Frontend**: Vercel Preview Deployments (on PR)
- **Backend**: Heroku/Railway (staging branch)
- **Database**: Staging PostgreSQL instance

### Production
- **Frontend**: Vercel (main branch auto-deploy)
- **Backend**: Railway/Render/AWS (main branch)
- **Database**: Production PostgreSQL (AWS RDS/Supabase)
- **CDN**: Cloudflare (for static assets)
- **Monitoring**: Sentry (error tracking)

---

## 16. 📞 Stakeholders & Communication

### Development Team
- **Lead Frontend Engineer**: Architecture decisions, code review
- **Frontend Developer**: Implementation (You)
- **Backend Developer**: Javohir (Node/Django API)

### Communication Channels
- **Daily Standups**: 10 AM Tashkent time
- **Code Review**: GitHub Pull Requests
- **Documentation**: This PRD + inline code comments
- **Blockers**: Slack #eduquiz-dev channel

### Decision Log
All major architectural decisions should be documented in `docs/ADR/` (Architecture Decision Records).

---

## 📝 Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | Team | Initial draft |
| 1.1 | Jan 2026 | Team | Added detailed architecture |
| 1.2 | Jan 2026 | Claude | Unified final master PRD |

**Last Updated**: January 8, 2026  
**Next Review**: End of Day 7 (Post-Launch Retrospective)

---

## ✅ Conclusion

This PRD serves as the **Single Source of Truth** for the EduQuiz Platform v1 development. It combines vision, architecture, implementation details, and success criteria in one authoritative document.

**Key Takeaways:**
1. **Feature-First Architecture** keeps code modular and scalable
2. **Adapter Pattern** ensures data consistency across sources
3. **7-Day Sprint** provides clear milestones and deliverables
4. **Strict coding standards** maintain code quality
5. **Clear acceptance criteria** define when we're done

**Next Steps:**
1. Save this file as `docs/PRD.md`
2. Reference it in VS Code with Copilot (`@workspace PRD`)
3. Begin Day 2 implementation (Dashboard)
4. Update status as features are completed

**Remember**: This is a living document. As we learn during implementation, we update the PRD—but we never compromise on the core architecture principles.

---

*End of Product Requirements Document*