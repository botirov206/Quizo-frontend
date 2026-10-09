import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Play, ArrowLeft } from 'lucide-react';
import { useQuizPreview } from '@/features/quiz';
import { getErrorMessage, isNotFoundError } from '@/lib/api-error';
import { toastApiError } from '@/lib/toast-api-error';

function sanitizeKey(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
}

export const JoinPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quizCode, setQuizCode] = useState(() => sanitizeKey(searchParams.get('code') ?? ''));
  const previewQuery = useQuizPreview(quizCode);
  const preview = previewQuery.data;
  const notFound = isNotFoundError(previewQuery.error);

  useEffect(() => {
    if (previewQuery.error && !notFound) toastApiError(previewQuery.error);
  }, [previewQuery.error, notFound]);

  const start = () => {
    if (!preview) return;
    navigate(`/quiz/${preview.id}/play`, { state: { quizKey: quizCode } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-4 px-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Play className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Join a Quiz</CardTitle>
            <CardDescription>
              Enter the 6-character quiz key from your teacher
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                start();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="quizCode">Quiz key</Label>
                <Input
                  id="quizCode"
                  type="text"
                  placeholder="ABC123"
                  value={quizCode}
                  onChange={(event) => setQuizCode(sanitizeKey(event.target.value))}
                  maxLength={6}
                  className="text-center text-2xl font-mono tracking-widest uppercase h-14"
                  autoComplete="off"
                  autoFocus
                />
                {quizCode.length > 0 && quizCode.length < 6 && (
                  <p className="text-sm text-muted-foreground text-center">Enter all 6 characters</p>
                )}
                {notFound && (
                  <p className="text-sm text-destructive text-center">No quiz with that key</p>
                )}
                {previewQuery.error && !notFound && (
                  <p className="text-sm text-destructive text-center">
                    {getErrorMessage(previewQuery.error)}
                  </p>
                )}
              </div>

              {previewQuery.isFetching && (
                <p className="text-sm text-muted-foreground text-center">Looking up quiz...</p>
              )}

              {preview && (
                <div className="rounded-lg border p-4 space-y-1 text-sm">
                  <p className="text-lg font-semibold">{preview.title}</p>
                  <p>{preview.questionCount} questions</p>
                  <p className="capitalize">{preview.difficulty.toLowerCase()}</p>
                  <p>{preview.timePerQuestion} seconds per question</p>
                  <p>
                    {preview.creator.firstName} {preview.creator.lastName}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-lg" disabled={!preview}>
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don&apos;t have a code?{' '}
              <Link to="/explore" className="text-primary hover:underline">
                Explore public quizzes
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
