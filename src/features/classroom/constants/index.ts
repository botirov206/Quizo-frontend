/**
 * Classroom Feature Constants
 */

// Characters for code generation (excluding ambiguous: 0, O, 1, I, L)
export const CODE_ALLOWED_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const CODE_LENGTH = 6;

// Query keys
export const CLASSROOM_QUERY_KEYS = {
  ALL: ['classrooms'] as const,
  BY_ID: (id: string) => ['classroom', id] as const,
  STUDENTS: (classroomId: string) => ['classroom', classroomId, 'students'] as const,
  RESULTS: (classroomId: string) => ['classroom', classroomId, 'results'] as const,
} as const;

// Error messages
export const CLASSROOM_ERROR_MESSAGES = {
  NOT_FOUND: 'Classroom not found',
  INVALID_CODE: 'Invalid classroom code. Please check and try again.',
  ALREADY_JOINED: 'You are already a member of this classroom.',
  CREATE_FAILED: 'Failed to create classroom. Please try again.',
  JOIN_FAILED: 'Failed to join classroom. Please try again.',
  LEAVE_FAILED: 'Failed to leave classroom. Please try again.',
  REMOVE_STUDENT_FAILED: 'Failed to remove student. Please try again.',
} as const;

// Success messages
export const CLASSROOM_SUCCESS_MESSAGES = {
  CREATED: 'Classroom created successfully!',
  JOINED: 'Successfully joined the classroom!',
  LEFT: 'You have left the classroom.',
  STUDENT_REMOVED: 'Student has been removed from the classroom.',
  CODE_COPIED: 'Classroom code copied to clipboard!',
} as const;

// Validation
export const CLASSROOM_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 50,
  CODE_PATTERN: /^[A-HJ-NP-Z2-9]{6}$/,
} as const;

// Mock API delay
export const MOCK_DELAY = 500;
