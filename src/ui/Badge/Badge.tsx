import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const variantClass = `bg-${variant}`;
  const textClass = variant === 'light' ? 'text-dark' : 'text-white';
  
  const classes = [
    'badge',
    variantClass,
    textClass,
    'd-inline-flex',
    'align-items-center',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

