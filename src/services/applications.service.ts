import { api } from './api';
import type { ApiResponse } from '../types/api';
import type {
  Application,
  CreateApplicationDTO,
  UpdateApplicationDTO,
} from '../types/application';

export async function listApplications(filters?: {
  user_id?: string;
  status?: string;
}): Promise<Application[]> {
  const { data } = await api.get<ApiResponse<Application[]>>('/applications', {
    params: filters,
  });
  return data.data;
}

export async function getApplication(id: string): Promise<Application> {
  const { data } = await api.get<ApiResponse<Application>>(
    `/applications/${id}`,
  );
  return data.data;
}

export async function createApplication(
  payload: CreateApplicationDTO,
): Promise<Application> {
  const { data } = await api.post<ApiResponse<Application>>(
    '/applications',
    payload,
  );
  return data.data;
}

export async function updateApplication(
  id: string,
  payload: UpdateApplicationDTO,
): Promise<Application> {
  const { data } = await api.patch<ApiResponse<Application>>(
    `/applications/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/applications/${id}`);
}
