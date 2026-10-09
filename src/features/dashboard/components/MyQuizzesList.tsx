import type { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteQuiz, useQuizList } from '@/features/quiz';
import { toastApiError } from '@/lib/toast-api-error';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Trash2, Loader2 } from 'lucide-react';
import { getDifficultyColor } from '../utils';

const PREVIEW_LIMIT = 5;

export const MyQuizzesList: FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuizList({ mine: true, limit: PREVIEW_LIMIT });
  const deleteQuiz = useDeleteQuiz();
  const quizzes = data?.items ?? [];

  const deleteOne = (id: string) => {
    if (!window.confirm('Delete this quiz?')) return;
    deleteQuiz.mutate(id, { onError: (deleteError) => toastApiError(deleteError) });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">My Quizzes</CardTitle>
        <Button size="sm" onClick={() => navigate('/quiz/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && (
          <p className="text-sm text-destructive text-center py-8">Failed to load your quizzes</p>
        )}
        {!isLoading && !error && quizzes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven&apos;t created any quizzes yet.</p>
            <Button variant="link" onClick={() => navigate('/quiz/create')}>
              Create your first quiz
            </Button>
          </div>
        )}
        {!isLoading && !error && quizzes.length > 0 && (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{quiz.title}</h4>
                    <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty.toLowerCase()}
                    </Badge>
                    <Badge variant={quiz.isPublished ? 'outline' : 'secondary'}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {quiz.questionCount} questions · {quiz.timePerQuestion}s · {quiz.quizKey}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/quiz/${quiz.id}/play`, { state: { quizKey: quiz.quizKey } })}
                    aria-label="Play quiz"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={deleteQuiz.isPending && deleteQuiz.variables === quiz.id}
                    onClick={() => deleteOne(quiz.id)}
                    aria-label="Delete quiz"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="link" className="px-0" asChild>
              <Link to="/quizzes">View all</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
