import type { AuthLogin, AuthTokens, AuthUser } from '../types/auth';

const ACCESS_TOKEN_KEY = 'jobapply.accessToken';
const REFRESH_TOKEN_KEY = 'jobapply.refreshToken';
const USER_KEY = 'jobapply.user';

export function saveSession(login: AuthLogin): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, login.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, login.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(login.user));
}

export function saveTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
