import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | false;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}) => {
  const baseClasses = [
    'bg-secondary',
    'bg-opacity-25',
    'rounded',
  ];

  if (variant === 'circular') {
    baseClasses.push('rounded-circle');
  }

  if (animation === 'pulse') {
    baseClasses.push('placeholder-glow');
  } else if (animation === 'wave') {
    baseClasses.push('placeholder-wave');
  }

  const classes = [
    ...baseClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const customStyle: React.CSSProperties = {
    width: width || (variant === 'circular' ? height || '40px' : '100%'),
    height: height || (variant === 'circular' ? width || '40px' : '1rem'),
    ...style,
  };

  return (
    <div className={classes} style={customStyle} {...props} />
  );
};

