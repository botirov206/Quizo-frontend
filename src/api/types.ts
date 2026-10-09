import type { components, paths } from './schema';

export type Schemas = components['schemas'];
export type ApiErrorBody = Schemas['Error'];
export type PublicUser = Schemas['PublicUser'];

export type AuthResponse =
  paths['/api/v1/auth/login']['post']['responses'][200]['content']['application/json'];

export type RefreshResponse =
  paths['/api/v1/auth/refresh']['post']['responses'][200]['content']['application/json'];

export type LoginRequest = NonNullable<
  paths['/api/v1/auth/login']['post']['requestBody']
>['content']['application/json'];

export type RegisterRequest = NonNullable<
  paths['/api/v1/auth/register']['post']['requestBody']
>['content']['application/json'];

export type GoogleAuthRequest = NonNullable<
  paths['/api/v1/auth/google']['post']['requestBody']
>['content']['application/json'];

export type TelegramAuthRequest = NonNullable<
  paths['/api/v1/auth/telegram']['post']['requestBody']
>['content']['application/json'];

export type ForgotPasswordRequest = NonNullable<
  paths['/api/v1/auth/forgot-password']['post']['requestBody']
>['content']['application/json'];

export type ResetPasswordRequest = NonNullable<
  paths['/api/v1/auth/reset-password']['post']['requestBody']
>['content']['application/json'];
