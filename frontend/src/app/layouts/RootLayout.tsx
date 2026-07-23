import { Link, Outlet } from 'react-router-dom';

export function RootLayout() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <header className="site-header">
        <Link className="brand" to="/">
          <span className="brand__mark" aria-hidden="true">
            V
          </span>
          <span>VibeQuiz</span>
        </Link>
        <nav aria-label="Navegación principal">
          <Link to="/admin/login">Administración</Link>
        </nav>
      </header>
      <div id="main-content">
        <Outlet />
      </div>
      <footer className="site-footer">
        VibeQuiz · Proyecto educativo de desarrollo asistido por IA
      </footer>
    </div>
  );
}
