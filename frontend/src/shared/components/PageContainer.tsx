import type { ReactNode } from 'react';

export function PageContainer({
  actions,
  children,
  className = '',
  eyebrow,
  title,
}: {
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <main className={`page-container ${className}`}>
      <header className="page-header">
        <div>
          {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </header>
      {children}
    </main>
  );
}
