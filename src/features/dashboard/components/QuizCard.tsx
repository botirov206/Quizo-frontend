import { useCallback } from 'react';
import type { StandardQuiz } from '@/types/quiz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Book, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDifficultyColor, getSourceBadge, getSourceBadgeColor } from '../utils';

interface QuizCardProps {
  quiz: StandardQuiz;
}

export const QuizCard = ({ quiz }: QuizCardProps) => {
  const navigate = useNavigate();

  const handlePlayClick = useCallback(() => {
    navigate(`/quiz/${quiz.id}/play`);
  }, [navigate, quiz.id]);

  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg">{quiz.title}</CardTitle>
          <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${getSourceBadgeColor(quiz.source)}`}>
            {getSourceBadge(quiz.source)}
          </span>
        </div>
        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Book className="h-4 w-4" />
            <span>{quiz.category}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{quiz.timeLimit} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4" />
            <span className={`capitalize px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(quiz.difficulty ?? 'easy')}`}>
              {quiz.difficulty || 'easy'}
            </span>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full bg-background hover:bg-primary hover:text-primary-foreground"
          onClick={handlePlayClick}
        >
          Play Now
        </Button>
      </CardContent>
    </Card>
  );
};
