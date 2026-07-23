import { useSyncExternalStore } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import {
  getAdminSession,
  subscribeToAdminSession,
} from '@/features/auth/session/admin-session';

export function ProtectedRoute() {
  const session = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSession,
    getAdminSession,
  );
  const location = useLocation();

  if (!session) {
    return (
      <Navigate replace state={{ from: location.pathname }} to="/admin/login" />
    );
  }

  return <Outlet />;
}
