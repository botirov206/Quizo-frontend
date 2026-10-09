import type { components, paths } from './schema';

export type Schemas = components['schemas'];
export type ApiErrorBody = Schemas['Error'];
export type RefreshResponse =
  paths['/api/v1/auth/refresh']['post']['responses'][200]['content']['application/json'];
