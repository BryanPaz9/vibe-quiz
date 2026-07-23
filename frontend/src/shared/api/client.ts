import {
  clearAdminSession,
  getAdminSession,
} from '@/features/auth/session/admin-session';
import type { ApiErrorBody } from '@/shared/types/api';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is required');
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details: ApiErrorBody['error']['details'] = [],
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Authentication =
  | { kind: 'none' }
  | { kind: 'admin' }
  | { kind: 'participation'; token: string };

export interface ApiRequestOptions extends Omit<
  RequestInit,
  'body' | 'headers'
> {
  authentication?: Authentication;
  body?: unknown;
  headers?: HeadersInit;
}

function buildHeaders(options: ApiRequestOptions): Headers {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.authentication?.kind === 'admin') {
    const session = getAdminSession();
    if (session) headers.set('Authorization', `Bearer ${session.accessToken}`);
  }

  if (options.authentication?.kind === 'participation') {
    headers.set(
      'Authorization',
      `Participation ${options.authentication.token}`,
    );
  }

  return headers;
}

async function toApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return new ApiError(
      response.status,
      body.error.code,
      body.error.message,
      body.error.details,
      body.error.requestId,
    );
  } catch {
    return new ApiError(
      response.status,
      'UNEXPECTED_API_ERROR',
      'The server returned an unexpected response',
    );
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: buildHeaders(options),
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    if (response.status === 401 && options.authentication?.kind === 'admin') {
      clearAdminSession();
    }
    throw await toApiError(response);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
