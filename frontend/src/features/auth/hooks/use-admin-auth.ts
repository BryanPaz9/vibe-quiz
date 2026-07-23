import { useMutation } from '@tanstack/react-query';
import { getAdminIdentity, login } from '@/features/auth/api/auth-api';
import {
  clearAdminSession,
  setAdminSession,
} from '@/features/auth/session/admin-session';
import type { LoginRequest } from '@/shared/types/api';

export function useAdminLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const response = await login(credentials);
      const expiresAt = Date.now() + response.expiresIn * 1_000;
      setAdminSession({
        accessToken: response.accessToken,
        admin: response.admin,
        expiresAt,
      });

      try {
        const admin = await getAdminIdentity();
        setAdminSession({
          accessToken: response.accessToken,
          admin,
          expiresAt,
        });
        return admin;
      } catch (error) {
        clearAdminSession();
        throw error;
      }
    },
  });
}
