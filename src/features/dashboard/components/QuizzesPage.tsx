import { useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { QuizGrid } from './QuizGrid';
import { useQuizList, useDeleteQuiz } from '@/features/quiz';
import { useAuth } from '@/context/AuthContext';
import { toastApiError } from '@/lib/toast-api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

export const QuizzesPage: FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const canManage = user?.role === 'teacher' || user?.role === 'admin';
  const { data, isLoading, error } = useQuizList({ mine: canManage, search });
  const deleteQuiz = useDeleteQuiz();

  if (!user) return null;

  const deleteOne = (id: string) => {
    if (!window.confirm('Delete this quiz?')) return;
    deleteQuiz.mutate(id, { onError: (deleteError) => toastApiError(deleteError) });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {canManage ? 'My Quizzes' : 'Quizzes'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {canManage ? 'Quizzes you created' : 'Published quizzes'}
              {!isLoading && data && data.items.length > 0 && (
                <span className="ml-2 text-muted-foreground/70">
                  ({data.items.length} {data.items.length === 1 ? 'quiz' : 'quizzes'})
                </span>
              )}
            </p>
          </div>
          {canManage && (
            <Button onClick={() => navigate('/quiz/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Button>
          )}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search quizzes"
            className="pl-10"
          />
        </div>

        <QuizGrid
          quizzes={data?.items}
          isLoading={isLoading}
          error={error}
          canManage={canManage}
          onDelete={canManage ? deleteOne : undefined}
          deletingId={deleteQuiz.isPending ? deleteQuiz.variables : undefined}
        />
      </div>
    </DashboardLayout>
  );
};
