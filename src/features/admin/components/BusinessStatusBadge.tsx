import { BusinessStatus } from '../types';

interface BusinessStatusBadgeProps {
  status: BusinessStatus;
}

/**
 * Business Status Badge Component
 * Displays business status with appropriate Bootstrap badge color
 */
export function BusinessStatusBadge({ status }: BusinessStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-warning text-dark',
    },
    approved: {
      label: 'Approved',
      className: 'bg-success',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-danger',
    },
    suspended: {
      label: 'Suspended',
      className: 'bg-secondary',
    },
  };

  const config = statusConfig[status];

  return (
    <span className={`badge ${config.className}`}>{config.label}</span>
  );
}











