import type { PublicUser } from '@/api/types';
import type { User } from '@/types/auth';

export type SignupRole = 'student' | 'teacher';

const UI_ROLES: Record<PublicUser['role'], User['role']> = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
};

const API_ROLES: Record<SignupRole, 'STUDENT' | 'TEACHER'> = {
  student: 'STUDENT',
  teacher: 'TEACHER',
};

export function toUser(account: PublicUser): User {
  return {
    id: account.id,
    email: account.email,
    firstName: account.firstName,
    lastName: account.lastName,
    name: `${account.firstName} ${account.lastName}`.trim(),
    role: UI_ROLES[account.role],
  };
}

export function toApiRole(role: SignupRole): 'STUDENT' | 'TEACHER' {
  return API_ROLES[role];
}
