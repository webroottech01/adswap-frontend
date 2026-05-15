import React from 'react';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  showLabel?: boolean;
  label?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  label,
  className = '',
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const variantClass = `bg-${variant}`;
  
  const progressClasses = [
    'progress',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const barClasses = [
    'progress-bar',
    variantClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={progressClasses} {...props}>
      <div
        className={barClasses}
        role="progressbar"
        style={{ width: `${percentage}%` }}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        {showLabel && (label || `${Math.round(percentage)}%`)}
      </div>
    </div>
  );
};

