/**
 * TeacherClassroom Component
 * Classroom management view for teachers
 */

import type { FC } from 'react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Plus, Users, Loader2 } from 'lucide-react';
import { useClassrooms, useClassroomStudents } from '../hooks/useClassrooms';
import { useClassroomActions } from '../hooks/useClassroomActions';
import { ClassroomCard } from './ClassroomCard';
import { CreateClassDialog } from './CreateClassDialog';
import { StudentList } from './StudentList';
import { ResultsGrid } from './ResultsGrid';
import { CLASSROOM_SUCCESS_MESSAGES } from '../constants';

export const TeacherClassroom: FC = () => {
  const { data, isLoading } = useClassrooms();
  const {
    createClassroom,
    isCreating,
    deleteClassroom,
    removeStudent,
    isRemovingStudent,
  } = useClassroomActions();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(null);

  const { data: students, isLoading: isLoadingStudents } = useClassroomStudents(
    selectedClassroomId || undefined
  );

  const selectedClassroom = data?.classrooms.find((c) => c.id === selectedClassroomId);

  const handleCreateClassroom = useCallback(
    (name: string) => {
      createClassroom(
        { name },
        {
          onSuccess: () => {
            setIsCreateDialogOpen(false);
          },
        }
      );
    },
    [createClassroom]
  );

  const handleCopyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(CLASSROOM_SUCCESS_MESSAGES.CODE_COPIED, {
      description: `Code: ${code}`,
    });
  }, []);

  const handleDeleteClassroom = useCallback(
    (classroomId: string) => {
      deleteClassroom(classroomId);
      if (selectedClassroomId === classroomId) {
        setSelectedClassroomId(null);
      }
    },
    [deleteClassroom, selectedClassroomId]
  );

  const handleRemoveStudent = useCallback(
    (studentId: string) => {
      if (selectedClassroomId) {
        removeStudent({ classroomId: selectedClassroomId, studentId });
      }
    },
    [removeStudent, selectedClassroomId]
  );

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
            <Users className="h-7 w-7" />
            My Classrooms
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your classrooms
            {data && data.classrooms.length > 0 && (
              <span className="ml-2">
                ({data.classrooms.length} classrooms • {data.totalStudents} students)
              </span>
            )}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Classroom
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Classrooms List */}
        <div className="lg:col-span-2 space-y-4">
          {data?.classrooms.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-muted/30">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2">No classrooms yet</h2>
              <p className="text-muted-foreground mb-4">
                Create your first classroom to start adding students.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Classroom
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data?.classrooms.map((classroom) => (
                <div
                  key={classroom.id}
                  className={`cursor-pointer ${
                    selectedClassroomId === classroom.id ? 'ring-2 ring-primary rounded-lg' : ''
                  }`}
                  onClick={() => setSelectedClassroomId(classroom.id)}
                >
                  <ClassroomCard
                    classroom={classroom}
                    isTeacher={true}
                    onCopyCode={handleCopyCode}
                    onDelete={handleDeleteClassroom}
                    onViewDetails={setSelectedClassroomId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Student List Sidebar */}
        <div>
          {selectedClassroom ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{selectedClassroom.name}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedClassroomId(null)}
                >
                  Close
                </Button>
              </div>
              <StudentList
                students={students || []}
                isLoading={isLoadingStudents}
                isTeacher={true}
                onRemoveStudent={handleRemoveStudent}
                isRemovingStudent={isRemovingStudent}
              />
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground">
                Select a classroom to view students
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {selectedClassroom && (
        <ResultsGrid
          classroomId={selectedClassroom.id}
          classroomName={selectedClassroom.name}
        />
      )}

      {/* Create Dialog */}
      <CreateClassDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateClassroom}
        isLoading={isCreating}
      />
    </div>
  );
};
