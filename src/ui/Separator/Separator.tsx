import React from 'react';

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  const classes = [
    orientation === 'vertical' ? 'vr' : 'border-top',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (orientation === 'vertical') {
    return <div className={classes} {...(props as React.HTMLAttributes<HTMLDivElement>)} />;
  }

  return <hr className={classes} {...props} />;
};

