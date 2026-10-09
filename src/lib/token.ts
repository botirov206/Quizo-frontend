type AuthFailureHandler = () => void;

let accessToken: string | null = null;

function redirectToLogin(): void {
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
}

let onFailure: AuthFailureHandler = redirectToLogin;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}

export function onAuthFailure(handler: AuthFailureHandler): void {
  onFailure = handler;
}

export function notifyAuthFailure(): void {
  onFailure();
}
