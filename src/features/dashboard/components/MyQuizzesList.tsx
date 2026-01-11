/**
 * MyQuizzesList Component
 * Displays teacher's created quizzes with actions
 */

import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, MoreHorizontal, Users, BarChart3 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TeacherQuiz } from '../hooks/useTeacherStats';
import { DIFFICULTY_COLORS } from '../constants';

interface MyQuizzesListProps {
  quizzes: TeacherQuiz[];
}

const getDifficultyColor = (difficulty: string): string => {
  return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || DIFFICULTY_COLORS.default;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const MyQuizzesList: FC<MyQuizzesListProps> = ({ quizzes }) => {
  const navigate = useNavigate();

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
        {quizzes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>You haven't created any quizzes yet.</p>
            <Button variant="link" onClick={() => navigate('/quiz/create')}>
              Create your first quiz
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{quiz.title}</h4>
                    <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>{quiz.questionCount} questions</span>
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {quiz.timesPlayed} plays
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {quiz.averageScore}% avg
                    </span>
                    <span className="hidden sm:inline">
                      Created {formatDate(quiz.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/quiz/${quiz.id}/play`)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/quiz/${quiz.id}/play`)}>
                        <Play className="h-4 w-4 mr-2" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="h-4 w-4 mr-2" />
                        Assign to Class
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Results
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
