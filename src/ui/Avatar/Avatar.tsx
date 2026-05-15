import React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: '',
    md: '',
    lg: '',
  };

  const sizeStyles = {
    sm: { width: '2rem', height: '2rem', fontSize: '0.75rem' },
    md: { width: '3rem', height: '3rem', fontSize: '1rem' },
    lg: { width: '4rem', height: '4rem', fontSize: '1.25rem' },
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const classes = [
    'rounded-circle',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'bg-primary',
    'text-white',
    'fw-bold',
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style = { ...sizeStyles[size], ...props.style };

  if (src) {
    return (
      <div className={classes} style={style} {...props}>
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="rounded-circle w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      </div>
    );
  }

  if (name) {
    return (
      <div className={classes} style={style} {...props}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
};

