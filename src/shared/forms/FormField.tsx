import React from 'react';
import { Input } from '@/ui/Input';

export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  className?: string;
  fullWidth?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  error,
  helperText,
  value,
  onChange,
  onBlur,
  autoComplete,
  className = '',
  fullWidth = true,
}) => {
  return (
    <div className={className}>
      <Input
        label={label}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        error={error}
        helperText={helperText}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        fullWidth={fullWidth}
      />
    </div>
  );
};

