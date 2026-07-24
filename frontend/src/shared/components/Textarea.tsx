import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, id, label, ...props }, ref) => {
    const textareaId = id ?? props.name;
    const errorId = error && textareaId ? `${textareaId}-error` : undefined;

    return (
      <div className="field">
        <label className="field__label" htmlFor={textareaId}>
          {label}
        </label>
        <textarea
          aria-describedby={errorId}
          aria-invalid={Boolean(error)}
          className={`field__control field__control--textarea ${className}`}
          id={textareaId}
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

Textarea.displayName = 'Textarea';
