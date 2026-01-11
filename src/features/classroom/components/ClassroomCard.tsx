/**
 * ClassroomCard Component
 * Displays a classroom with basic info and actions
 */

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Copy, MoreHorizontal, Trash2, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Classroom } from '../types';

interface ClassroomCardProps {
  classroom: Classroom;
  isTeacher: boolean;
  onCopyCode?: (code: string) => void;
  onDelete?: (classroomId: string) => void;
  onLeave?: (classroomId: string) => void;
  onViewDetails?: (classroomId: string) => void;
}

export const ClassroomCard: FC<ClassroomCardProps> = ({
  classroom,
  isTeacher,
  onCopyCode,
  onDelete,
  onLeave,
  onViewDetails,
}) => {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(classroom.code);
    onCopyCode?.(classroom.code);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">{classroom.name}</CardTitle>
          {isTeacher && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-sm">
                {classroom.code}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={handleCopyCode}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails?.(classroom.id)}>
              View Details
            </DropdownMenuItem>
            {isTeacher && (
              <>
                <DropdownMenuItem onClick={handleCopyCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Join Code
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(classroom.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Classroom
                </DropdownMenuItem>
              </>
            )}
            {!isTeacher && (
              <DropdownMenuItem
                onClick={() => onLeave?.(classroom.id)}
                className="text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Leave Classroom
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{classroom.studentIds.length} students</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{classroom.quizIds.length} quizzes</span>
          </div>
        </div>
        {!isTeacher && (
          <p className="text-sm text-muted-foreground mt-2">
            Teacher: {classroom.teacherName}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
