import React from 'react';

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  fullScreen?: boolean;
  text?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  text,
}) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  const spinnerClasses = [
    'spinner-border',
    `text-${variant}`,
    sizeClass,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <div className="d-flex flex-column align-items-center">
      <div className={spinnerClasses} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <span className="mt-2">{text}</span>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75" style={{ zIndex: 9999 }}>
        {content}
      </div>
    );
  }

  return content;
};

