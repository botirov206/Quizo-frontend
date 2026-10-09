import type {
  AuthResponse,
  ForgotPasswordRequest,
  GoogleAuthRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  TelegramAuthRequest,
} from '@/api/types';
import { apiClient } from '@/lib/axios';

async function postSession(path: string, body: unknown): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>(path, body);
  return data;
}

export function loginApi(body: LoginRequest): Promise<AuthResponse> {
  return postSession('/auth/login', body);
}

export function registerApi(body: RegisterRequest): Promise<AuthResponse> {
  return postSession('/auth/register', body);
}

export function googleAuthApi(body: GoogleAuthRequest): Promise<AuthResponse> {
  return postSession('/auth/google', body);
}

export function telegramAuthApi(body: TelegramAuthRequest): Promise<AuthResponse> {
  return postSession('/auth/telegram', body);
}

export function refreshApi(): Promise<AuthResponse> {
  return postSession('/auth/refresh', undefined);
}

export async function logoutApi(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function forgotPasswordApi(body: ForgotPasswordRequest): Promise<void> {
  await apiClient.post('/auth/forgot-password', body);
}

export async function resetPasswordApi(body: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/reset-password', body);
}
