import React from 'react';

export interface AlertProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  dismissible?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'primary',
  dismissible = false,
  onClose,
  children,
  className = '',
}) => {
  const classes = [
    'alert',
    `alert-${variant}`,
    dismissible && 'alert-dismissible',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="alert">
      {children}
      {dismissible && onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        />
      )}
    </div>
  );
};

