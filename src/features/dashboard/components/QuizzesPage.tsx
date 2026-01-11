import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { QuizGrid } from './QuizGrid';
import { useQuizzes } from '../hooks/useQuizzes';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
// import { SourceFilter } from './filters'; // Disabled for now - may use in future

export const QuizzesPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    data: quizzes, 
    isLoading, 
    error,
    totalCount,
  } = useQuizzes();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">My Quizzes</h1>
            <p className="text-sm text-muted-foreground">
              Browse and play custom quizzes created by teachers
              {!isLoading && totalCount > 0 && (
                <span className="ml-2 text-muted-foreground/70">
                  ({totalCount} {totalCount === 1 ? 'quiz' : 'quizzes'})
                </span>
              )}
            </p>
          </div>
          {user.role === 'teacher' && (
            <Button onClick={() => navigate('/quiz/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          )}
        </div>

        {/* Source Filter Tabs - Disabled for now */}
        {/* <SourceFilter
          activeSource={source}
          onSourceChange={setSource}
          openTDBCount={openTDBQuizzes.length}
          customCount={customQuizzes.length}
          isLoading={isLoading}
        /> */}
        
        {/* Quiz Grid */}
        <QuizGrid quizzes={quizzes} isLoading={isLoading} error={error} />
      </div>
    </DashboardLayout>
  );
};
