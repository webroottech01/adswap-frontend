import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isInvalid = !!error;
  const inputClasses = [
    'form-control',
    isInvalid && 'is-invalid',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const wrapperClasses = fullWidth ? 'w-100' : '';

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />
      {error && (
        <div className="invalid-feedback d-block">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div className="form-text">
          {helperText}
        </div>
      )}
    </div>
  );
};

