import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, id, label, ...props }, ref) => {
    const inputId = id ?? props.name;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    return (
      <div className="field">
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
        <input
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={`field__control ${className}`}
          id={inputId}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="field__error" id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
