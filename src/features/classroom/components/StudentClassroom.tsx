/**
 * StudentClassroom Component
 * Classroom view for students
 */

import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, GraduationCap, Loader2 } from 'lucide-react';
import { useClassrooms } from '../hooks/useClassrooms';
import { useClassroomActions } from '../hooks/useClassroomActions';
import { ClassroomCard } from './ClassroomCard';
import { JoinClassDialog } from './JoinClassDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const StudentClassroom: FC = () => {
  const { data, isLoading } = useClassrooms();
  const { joinClassroom, isJoining, leaveClassroom, isLeaving, error, clearError } =
    useClassroomActions();

  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [leaveClassroomId, setLeaveClassroomId] = useState<string | null>(null);

  const handleJoinClassroom = useCallback(
    (code: string) => {
      joinClassroom(
        { code },
        {
          onSuccess: () => {
            setIsJoinDialogOpen(false);
          },
        }
      );
    },
    [joinClassroom]
  );

  const handleLeaveClassroom = useCallback(() => {
    if (leaveClassroomId) {
      leaveClassroom(leaveClassroomId, {
        onSuccess: () => {
          setLeaveClassroomId(null);
        },
      });
    }
  }, [leaveClassroom, leaveClassroomId]);

  const handleCloseJoinDialog = useCallback(() => {
    setIsJoinDialogOpen(false);
    clearError();
  }, [clearError]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7" />
            My Classrooms
          </h1>
          <p className="text-sm text-muted-foreground">
            Join classrooms and take quizzes assigned by your teachers
            {data && data.classrooms.length > 0 && (
              <span className="ml-2">
                ({data.classrooms.length} classrooms enrolled)
              </span>
            )}
          </p>
        </div>
        <Button onClick={() => setIsJoinDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Join Classroom
        </Button>
      </div>

      {/* Content */}
      {data?.classrooms.length === 0 ? (
        <div className="text-center py-16 border rounded-lg bg-muted/30">
          <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">No classrooms yet</h2>
          <p className="text-muted-foreground mb-4">
            Ask your teacher for a classroom code to join.
          </p>
          <Button onClick={() => setIsJoinDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Join Classroom
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.classrooms.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              isTeacher={false}
              onLeave={setLeaveClassroomId}
            />
          ))}
        </div>
      )}

      {/* Join Dialog */}
      <JoinClassDialog
        isOpen={isJoinDialogOpen}
        onClose={handleCloseJoinDialog}
        onSubmit={handleJoinClassroom}
        isLoading={isJoining}
        error={error}
      />

      {/* Leave Confirmation Dialog */}
      <AlertDialog open={!!leaveClassroomId} onOpenChange={() => setLeaveClassroomId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Classroom</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this classroom? You will need the classroom code
              to rejoin.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveClassroom}
              disabled={isLeaving}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLeaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Leave Classroom
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
