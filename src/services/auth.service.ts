import { api } from './api';
import type { ApiResponse } from '../types/api';
import type {
  AuthenticateUserDTO,
  AuthLogin,
  AuthUser,
  CreateUserDTO,
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
