import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
  RequireAuth,
  RequireRole,
  ResetPasswordForm,
} from '@/features/auth';
import { useAuth } from '@/context/AuthContext';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard, QuizzesPage } from '@/features/dashboard';
import { QuizCreator } from '@/features/quiz';
import { GameEngine, JoinPage } from '@/features/game';
import { CategoryBrowser, OpenTDBGame, QuizConfigPage } from '@/features/explore';
import { ClassroomPage } from '@/features/classroom';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

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
      <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
      <Route path="/register/teacher" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordForm /> : <Navigate to="/dashboard" />} />
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
      <Route path="/quiz/:quizId/play" element={<RequireAuth><GameEngine /></RequireAuth>} />
      <Route path="/explore" element={<RequireAuth><CategoryBrowser /></RequireAuth>} />
      <Route path="/explore/configure" element={<RequireAuth><QuizConfigPage /></RequireAuth>} />
      <Route path="/play/opentdb" element={<RequireAuth><OpenTDBGame /></RequireAuth>} />
      <Route path="/classrooms" element={<RequireAuth><ClassroomPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
