import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = '', error, id, label, ...props }, ref) => {
    const selectId = id ?? props.name;
    const errorId = error && selectId ? `${selectId}-error` : undefined;

    return (
      <div className="field">
        <label className="field__label" htmlFor={selectId}>
          {label}
        </label>
        <select
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={`field__control ${className}`}
          id={selectId}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="field__error" id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
