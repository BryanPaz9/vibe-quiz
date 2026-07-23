import { NavLink, Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-nav">
        <p className="admin-nav__label">Panel administrativo</p>
        <nav aria-label="Administración">
          <NavLink to="/admin/quizzes">Cuestionarios</NavLink>
        </nav>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
