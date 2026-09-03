import { AuthUser } from '../types/auth';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export class ApiClientError extends Error {
  statusCode: number;
  errors: string[];

  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export interface SessionPayload {
  user: AuthUser;
  accessToken: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

let accessToken: string | null = null;
let onSessionExpired: (() => void) | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const setSessionExpiredHandler = (fn: (() => void) | null): void => {
  onSessionExpired = fn;
};

export const refreshSession = async (): Promise<SessionPayload | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
    if (!res.ok) return null;
    const body = (await res.json()) as ApiEnvelope<SessionPayload>;
    if (!body.success || !body.data) return null;
    accessToken = body.data.accessToken;
    return body.data;
  } catch {
    return null;
  }
};

const request = async <T>(path: string, options: RequestInit = {}, allowRetry = true): Promise<T> => {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers, credentials: 'include' });

  if (res.status === 401 && allowRetry) {
    const refreshed = await refreshSession();
    if (refreshed) {
      return request<T>(path, options, false);
    }
    accessToken = null;
    onSessionExpired?.();
    throw new ApiClientError('Session expired', 401);
  }

  const body = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || !body || !body.success) {
    throw new ApiClientError(body?.message ?? 'Request failed', res.status, body?.errors ?? []);
  }

  return body.data as T;
};

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'POST', body: data !== undefined ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: 'PATCH', body: data !== undefined ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
