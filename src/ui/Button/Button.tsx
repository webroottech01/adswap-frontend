import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
  size?: 'sm' | 'lg';
  outline?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size,
  outline = false,
  fullWidth = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseClass = 'btn';
  const variantClass = outline ? `btn-outline-${variant}` : `btn-${variant}`;
  const sizeClass = size ? `btn-${size}` : '';
  const widthClass = fullWidth ? 'w-100' : '';
  const isDisabled = disabled || loading;
  
  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    widthClass,
    'd-flex',
    'align-items-center',
    'justify-content-center',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <button className={classes} disabled={isDisabled} {...props}>
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {children}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={iconSize} className="me-2" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={iconSize} className="ms-2" />}
        </>
      )}
    </button>
  );
};

