import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/context/AuthContext';
import { LandingPage } from '@/pages/LandingPage';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';
import { Dashboard, QuizzesPage } from '@/features/dashboard';
import { QuizCreator } from '@/features/quiz';
import { GameEngine, JoinPage } from '@/features/game';
import { CategoryBrowser, OpenTDBGame } from '@/features/explore';
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

  // Show loading state while auth is being resolved
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={!user ? <LoginForm /> : <Navigate to="/dashboard" />} />
      <Route path="/register" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
      <Route path="/register/teacher" element={!user ? <RegisterForm /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordForm /> : <Navigate to="/dashboard" />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/join" element={user ? <JoinPage /> : <Navigate to="/login" />} />
      <Route path="/quizzes" element={user ? <QuizzesPage /> : <Navigate to="/login" />} />
      <Route path="/quiz/create" element={user ? <QuizCreator /> : <Navigate to="/login" />} />
      <Route path="/quiz/:quizId/play" element={user ? <GameEngine /> : <Navigate to="/login" />} />
      
      {/* Explore Feature - OpenTDB Categories */}
      <Route path="/explore" element={user ? <CategoryBrowser /> : <Navigate to="/login" />} />
      <Route path="/play/opentdb" element={user ? <OpenTDBGame /> : <Navigate to="/login" />} />
      
      {/* Classroom Feature */}
      <Route path="/classrooms" element={user ? <ClassroomPage /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;