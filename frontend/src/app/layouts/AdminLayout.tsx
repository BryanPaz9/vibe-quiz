import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faListCheck,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
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
          <NavLink to="/admin/quizzes">
            <FontAwesomeIcon aria-hidden="true" icon={faListCheck} />
            <span>Cuestionarios</span>
          </NavLink>
        </nav>
        <Button onClick={logout} type="button" variant="secondary">
          <FontAwesomeIcon aria-hidden="true" icon={faRightFromBracket} />
          <span>Cerrar sesión</span>
        </Button>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
