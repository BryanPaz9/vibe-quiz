import type { ReactNode } from 'react';

export function Loader({ label = 'Cargando' }: { label?: string }) {
  return (
    <div className="state-message" role="status">
      <span className="loader" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorMessage({
  children,
  title = 'No fue posible completar la operación',
}: {
  children?: ReactNode;
  title?: string;
}) {
  return (
    <div className="state-message state-message--error" role="alert">
      <strong>{title}</strong>
      {children && <span>{children}</span>}
    </div>
  );
}

export function EmptyState({
  children,
  title,
}: {
  children?: ReactNode;
  title: string;
}) {
  return (
    <div className="state-message">
      <strong>{title}</strong>
      {children && <span>{children}</span>}
    </div>
  );
}
