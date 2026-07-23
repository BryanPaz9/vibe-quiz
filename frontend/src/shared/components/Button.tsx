import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  children,
  className = '',
  disabled,
  isLoading = false,
  variant = 'primary',
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={`button button--${variant} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="button__spinner" aria-hidden="true" />
          <span>Procesando…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
