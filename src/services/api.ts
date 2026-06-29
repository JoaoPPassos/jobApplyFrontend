import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api';
import { clearSession, getAccessToken, getRefreshToken, saveTokens } from './storage';
import { refreshTokens } from './auth.service';

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

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function flushQueue(error: unknown, token: string | null = null) {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!),
  );
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as RetryableRequest | undefined;
    // 401 em /auth/* é erro do próprio fluxo (credenciais inválidas, reset
    // token expirado), não sessão expirada — não tentar refresh
    const isAuthRequest = original?.url?.includes('/auth/');

    if (error.response?.status !== 401 || isAuthRequest || !original || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) {
      clearSession();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    try {
      const tokens = await refreshTokens(storedRefreshToken);
      saveTokens(tokens);
      flushQueue(null, tokens.accessToken);
      original.headers.Authorization = `Bearer ${tokens.accessToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      clearSession();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
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
