import { apiRequest } from '@/shared/api';
import type {
  AdminIdentity,
  LoginRequest,
  LoginResponse,
} from '@/shared/types/api';

export function login(credentials: LoginRequest): Promise<LoginResponse> {
  return apiRequest('/auth/login', {
    authentication: { kind: 'none' },
    body: credentials,
    method: 'POST',
  });
}

export function getAdminIdentity(): Promise<AdminIdentity> {
  return apiRequest('/auth/me', {
    authentication: { kind: 'admin' },
  });
}
