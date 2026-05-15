import Link from 'next/link';
import { DataTable, DataTableColumn } from '@/shared/DataTable';
import { Business } from '../types';
import { BusinessStatusBadge } from './BusinessStatusBadge';
import { Button } from '@/ui/Button';
import { Edit, CheckCircle, XCircle, Ban } from 'lucide-react';

interface BusinessListProps {
  businesses: Business[];
  loading?: boolean;
  onApprove?: (business: Business) => void;
  onReject?: (business: Business) => void;
  onSuspend?: (business: Business) => void;
  actionLoading?: number | null;
}

/**
 * Business List Component
 * Displays businesses in a table format with actions
 */
export function BusinessList({
  businesses,
  loading = false,
  onApprove,
  onReject,
  onSuspend,
  actionLoading = null,
}: BusinessListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const columns: DataTableColumn<Business>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'name',
      header: 'Business Name',
      sortable: true,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      render: (business) => <BusinessStatusBadge status={business.status} />,
    },
    {
      key: 'flags',
      header: 'Type',
      render: (business) => (
        <div className="d-flex gap-2">
          {business.is_provider && (
            <span className="badge bg-info">Provider</span>
          )}
          {business.is_buyer && (
            <span className="badge bg-primary">Buyer</span>
          )}
          {!business.is_provider && !business.is_buyer && (
            <span className="text-muted small">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (business) => formatDate(business.created_at),
      sortable: true,
    },
  ];

  const isActionLoading = (businessId: number) => actionLoading === businessId;

  const actions = (business: Business) => {
    const isLoading = isActionLoading(business.id);

    return (
      <div className="d-flex gap-2 flex-wrap">
        <Link href={`/admin/businesses/${business.id}`}>
          <Button variant="primary" outline size="sm" title="Edit" icon={Edit}>
            Edit
          </Button>
        </Link>
        {business.status === 'pending' && onApprove && (
          <Button
            variant="success"
            outline
            size="sm"
            title="Approve"
            icon={CheckCircle}
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onApprove(business);
            }}
          >
            {isLoading ? '...' : 'Approve'}
          </Button>
        )}
        {business.status === 'pending' && onReject && (
          <Button
            variant="danger"
            outline
            size="sm"
            title="Reject"
            icon={XCircle}
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onReject(business);
            }}
          >
            {isLoading ? '...' : 'Reject'}
          </Button>
        )}
        {business.status === 'approved' && onSuspend && (
          <Button
            variant="warning"
            outline
            size="sm"
            title="Suspend"
            icon={Ban}
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              onSuspend(business);
            }}
          >
            {isLoading ? '...' : 'Suspend'}
          </Button>
        )}
        {(business.status === 'rejected' || business.status === 'suspended') &&
          onApprove && (
            <Button
              variant="success"
              outline
              size="sm"
              title="Approve"
              icon={CheckCircle}
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                onApprove(business);
              }}
            >
              {isLoading ? '...' : 'Approve'}
            </Button>
          )}
      </div>
    );
  };

  return (
    <DataTable
      columns={columns}
      data={businesses}
      loading={loading}
      emptyMessage="No businesses found"
      actions={actions}
      onRowClick={(business) => {
        window.location.href = `/admin/businesses/${business.id}`;
      }}
    />
  );
}

