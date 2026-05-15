import React from 'react';
import { Input } from '@/ui/Input';
import { Button } from '@/ui/Button';
import { Alert } from '@/ui/Alert';

export interface AuthFormField {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}

export interface AuthFormProps {
  fields: AuthFormField[];
  onSubmit: (data: Record<string, string>) => void;
  submitText?: string;
  submitVariant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  loading?: boolean;
  error?: string;
  className?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  fields,
  onSubmit,
  submitText = 'Submit',
  submitVariant = 'primary',
  loading = false,
  error,
  className = '',
}) => {
  const [formData, setFormData] = React.useState<Record<string, string>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {error && (
        <Alert variant="danger" dismissible className="mb-3">
          {error}
        </Alert>
      )}

      {fields.map((field) => (
        <div key={field.name} className="mb-3">
          <Input
            label={field.label}
            type={field.type || 'text'}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={errors[field.name]}
            required={field.required}
            autoComplete={field.autoComplete}
            fullWidth
          />
        </div>
      ))}

      <Button
        type="submit"
        variant={submitVariant}
        fullWidth
        disabled={loading}
      >
        {loading ? 'Processing...' : submitText}
      </Button>
    </form>
  );
};

