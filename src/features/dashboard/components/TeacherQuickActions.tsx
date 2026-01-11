/**
 * TeacherQuickActions Component
 * Quick action buttons for teachers
 */

import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, BarChart3, Copy, BookOpen } from 'lucide-react';

export const TeacherQuickActions: FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Create Quiz',
      icon: Plus,
      onClick: () => navigate('/quiz/create'),
      variant: 'default' as const,
    },
    {
      label: 'Manage Classes',
      icon: Users,
      onClick: () => navigate('/classrooms'),
      variant: 'outline' as const,
    },
    {
      label: 'View All Quizzes',
      icon: BookOpen,
      onClick: () => navigate('/quizzes'),
      variant: 'outline' as const,
    },
    {
      label: 'View Results',
      icon: BarChart3,
      onClick: () => navigate('/results'),
      variant: 'outline' as const,
    },
    {
      label: 'Copy Class Code',
      icon: Copy,
      onClick: () => {
        // TODO: Show class code dialog
        navigator.clipboard.writeText('ABC123');
      },
      variant: 'outline' as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant={action.variant}
            className="justify-start"
            onClick={action.onClick}
          >
            <action.icon className="h-4 w-4 mr-2" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
