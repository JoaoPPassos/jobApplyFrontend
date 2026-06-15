import { api } from './api';
import type { ApiResponse } from '../types/api';
import type { AuthUser } from '../types/auth';

export async function saveEmailCredentials(email_password: string): Promise<AuthUser> {
  const { data } = await api.patch<ApiResponse<AuthUser>>('/users/email-credentials', {
    email_password,
  });
  return data.data;
}
