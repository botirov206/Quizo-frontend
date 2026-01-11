/**
 * Classroom Feature Public API
 */

// Components
export { ClassroomPage } from './components/ClassroomPage';
export { TeacherClassroom } from './components/TeacherClassroom';
export { StudentClassroom } from './components/StudentClassroom';
export { ClassroomCard } from './components/ClassroomCard';
export { CreateClassDialog } from './components/CreateClassDialog';
export { JoinClassDialog } from './components/JoinClassDialog';
export { StudentList } from './components/StudentList';
export { ResultsGrid } from './components/ResultsGrid';

// Hooks
export { useClassrooms, useClassroomById, useClassroomStudents } from './hooks/useClassrooms';
export { useClassroomActions, generateClassroomCode } from './hooks/useClassroomActions';
export { useClassroomResults, transformToGridData } from './hooks/useClassroomResults';

// Constants
export {
  CODE_ALLOWED_CHARS,
  CODE_LENGTH,
  CLASSROOM_QUERY_KEYS,
  CLASSROOM_ERROR_MESSAGES,
  CLASSROOM_SUCCESS_MESSAGES,
  CLASSROOM_VALIDATION,
} from './constants';

// Types
export type {
  Classroom,
  ClassroomStudent,
  ClassroomQuizResult,
  CreateClassroomInput,
  JoinClassroomInput,
  ClassroomStats,
} from './types';
