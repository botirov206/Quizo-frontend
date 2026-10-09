import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ForgotPasswordForm,
  GuestRoute,
  LoginForm,
  RegisterForm,
  RequireAuth,
  RequireRole,
  ResetPasswordForm,
} from '@/features/auth';
import { useAuth } from '@/context/AuthContext';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard, HistoryPage, QuizzesPage } from '@/features/dashboard';
import { QuizCreator } from '@/features/quiz';
import { JoinPage } from '@/features/game';
import { CategoryBrowser, QuizConfigPage } from '@/features/explore';
import { PlayScreen } from '@/features/play';
import { ClassroomPage } from '@/features/classroom';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginForm /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterForm /></GuestRoute>} />
      <Route path="/register/teacher" element={<GuestRoute><RegisterForm /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordForm /></GuestRoute>} />
      <Route path="/reset-password" element={<ResetPasswordForm />} />

      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/join" element={<RequireAuth><JoinPage /></RequireAuth>} />
      <Route path="/quizzes" element={<RequireAuth><QuizzesPage /></RequireAuth>} />
      <Route
        path="/quiz/create"
        element={
          <RequireRole roles={['teacher', 'admin']}>
            <QuizCreator />
          </RequireRole>
        }
      />
      <Route path="/play/:sessionId" element={<RequireAuth><PlayScreen /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><HistoryPage /></RequireAuth>} />
      <Route path="/explore" element={<RequireAuth><CategoryBrowser /></RequireAuth>} />
      <Route path="/explore/configure" element={<RequireAuth><QuizConfigPage /></RequireAuth>} />
      <Route path="/classrooms" element={<RequireAuth><ClassroomPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
