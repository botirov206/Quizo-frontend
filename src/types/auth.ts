export interface User {
  id: string;
  email: string | null;
  name: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
}
