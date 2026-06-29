import { api } from './api';
import type { ApiResponse } from '../types/api';
import type {
  AuthenticateUserDTO,
  AuthLogin,
  AuthTokens,
  AuthUser,
  CreateUserDTO,
  ResetPasswordDTO,
} from '../types/auth';

export async function login(payload: AuthenticateUserDTO): Promise<AuthLogin> {
  const { data } = await api.post<ApiResponse<AuthLogin>>(
    '/auth/login',
    payload,
  );
  return data.data;
}

export async function signUp(payload: CreateUserDTO): Promise<AuthUser> {
  const { data } = await api.post<ApiResponse<AuthUser>>(
    '/auth/signUp',
    payload,
  );
  return data.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
}

export async function verifyResetCode(
  email: string,
  code: string,
): Promise<string> {
  const { data } = await api.post<ApiResponse<{ reset_token: string }>>(
    '/auth/verify-reset-code',
    { email, code },
  );
  return data.data.reset_token;
}

export async function resetPassword(payload: ResetPasswordDTO): Promise<void> {
  await api.post<ApiResponse<null>>('/auth/reset-password', payload);
}

export async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const { data } = await api.post<ApiResponse<AuthTokens>>(
    '/auth/refresh-token',
    { refreshToken },
  );
  return data.data;
}
