import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuizListItem } from '@/features/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Book, Award, Key, Copy, Trash2 } from 'lucide-react';
import { startCustomPlay, playHref } from '@/features/play';
import { toastApiError } from '@/lib/toast-api-error';
import { getDifficultyColor } from '../utils';

interface QuizCardProps {
  quiz: QuizListItem;
  canManage?: boolean;
  onDelete?: (id: string) => void;
  deletePending?: boolean;
}

export const QuizCard = ({ quiz, canManage, onDelete, deletePending }: QuizCardProps) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [starting, setStarting] = useState(false);
  const difficulty = quiz.difficulty.toLowerCase();

  const play = () => {
    if (starting) return;
    setStarting(true);
    void startCustomPlay(quiz.quizKey)
      .then((started) => navigate(playHref(started.sessionId, started.quizId ?? quiz.id)))
      .catch((error: unknown) => {
        toastApiError(error);
        setStarting(false);
      });
  };

  const copyKey = () => {
    void navigator.clipboard.writeText(quiz.quizKey);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg">{quiz.title}</CardTitle>
          <Badge variant={quiz.isPublished ? 'outline' : 'secondary'}>
            {quiz.isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Book className="h-4 w-4" />
            <span>{quiz.categoryName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{quiz.timePerQuestion}s per question</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="h-4 w-4" />
            <span className={`capitalize px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
            <span>{quiz.questionCount} {quiz.questionCount === 1 ? 'question' : 'questions'}</span>
          </div>
          {canManage && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Key className="h-4 w-4" />
              <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{quiz.quizKey}</span>
              <Button type="button" variant="ghost" size="sm" onClick={copyKey} aria-label="Copy quiz key">
                <Copy className="h-3 w-3" />
              </Button>
              {copied && <span className="text-xs text-green-600">Copied</span>}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={play} disabled={starting}>
            Play Now
          </Button>
          {canManage && onDelete && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={deletePending}
              onClick={() => onDelete(quiz.id)}
              aria-label="Delete quiz"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
