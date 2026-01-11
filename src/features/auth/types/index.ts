// Auth feature types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthFormState {
  loading: boolean;
  error: string;
}

export interface ForgotPasswordState {
  email: string;
  loading: boolean;
  sent: boolean;
  error: string;
}
