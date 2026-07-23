import { useSyncExternalStore } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  clearAdminSession,
  getAdminSession,
  subscribeToAdminSession,
} from '@/features/auth/session/admin-session';
import { Button } from '@/shared/components';

export function AdminLayout() {
  const navigate = useNavigate();
  const session = useSyncExternalStore(
    subscribeToAdminSession,
    getAdminSession,
    getAdminSession,
  );

  function logout() {
    clearAdminSession();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <p className="admin-nav__label">Panel administrativo</p>
        <p className="admin-nav__identity">{session?.admin.email}</p>
        <nav aria-label="Administración">
          <NavLink to="/admin/quizzes">Cuestionarios</NavLink>
        </nav>
        <Button onClick={logout} type="button" variant="secondary">
          Cerrar sesión
        </Button>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
