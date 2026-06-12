import axios, { AxiosError } from 'axios';
import type { ApiError } from '../types/api';
import { clearSession, getAccessToken } from './storage';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      clearSession();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiError>(error)) {
    const message = error.response?.data?.message;
    if (message) return message;
    if (error.code === 'ERR_NETWORK') {
      return 'Não foi possível conectar ao servidor. O backend está rodando?';
    }
  }
  return 'Erro inesperado. Tente novamente.';
}
