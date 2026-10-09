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

export type QuizListItem = Schemas['QuizListItem'];
export type QuizPreview = Schemas['QuizPreview'];
export type QuizMutation = Schemas['QuizMutation'];

export type CategoryListResponse =
  paths['/api/v1/categories']['get']['responses'][200]['content']['application/json'];

export type CategoryItem = CategoryListResponse['items'][number];

export type QuizListResponse =
  paths['/api/v1/quizzes']['get']['responses'][200]['content']['application/json'];

export type CreateQuizBody = NonNullable<
  paths['/api/v1/quizzes']['post']['requestBody']
>['content']['application/json'];

export type PlaySessionStart = Schemas['PlaySessionStart'];
export type PlayerQuestion = Schemas['PlayerQuestion'];
export type PlayAnswer = Schemas['PlayAnswer'];
export type PlayResult = Schemas['PlayResult'];
export type Leaderboard = Schemas['Leaderboard'];
export type MeStats = Schemas['MeStats'];
export type HistoryList = paths['/api/v1/me/history']['get']['responses'][200]['content']['application/json'];
export type TeacherStats = Schemas['TeacherStats'];
export type TeacherRecentResult = Schemas['TeacherRecentResult'];
export type Classroom = Schemas['Classroom'];
export type ClassroomList = paths['/api/v1/classrooms']['get']['responses'][200]['content']['application/json'];
export type ClassroomMember = Schemas['ClassroomMember'];
export type ClassroomResults = Schemas['ClassroomResults'];

export type PlayStartRequest = NonNullable<
  paths['/api/v1/play-sessions']['post']['requestBody']
>['content']['application/json'];

export type PlayAnswerRequest = NonNullable<
  paths['/api/v1/play-sessions/{id}/answers']['post']['requestBody']
>['content']['application/json'];
