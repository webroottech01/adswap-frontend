'use client';

import type { CollaborationRequest } from '../types';
import { Badge } from '@/ui/Badge';

interface CollaborationRequestCardProps {
  request: CollaborationRequest;
  variant: 'sent' | 'received';
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  acceptLoadingId: number | null;
  rejectLoadingId: number | null;
}

function statusVariant(status: string): 'secondary' | 'success' | 'danger' {
  switch (status) {
    case 'accepted':
      return 'success';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
}

export function CollaborationRequestCard({
  request,
  variant,
  onAccept,
  onReject,
  acceptLoadingId,
  rejectLoadingId,
}: CollaborationRequestCardProps) {
  const isPending = request.status === 'pending';
  const otherName = variant === 'sent' ? request.receiver_business_name : request.sender_business_name;
  const showActions = variant === 'received' && isPending && onAccept && onReject;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h6 className="card-title mb-1">
              {variant === 'sent' ? 'To: ' : 'From: '}
              {otherName ?? `Business #${variant === 'sent' ? request.receiver_business_id : request.sender_business_id}`}
            </h6>
            <Badge variant={statusVariant(request.status)}>{request.status}</Badge>
          </div>
          <small className="text-muted">
            {new Date(request.created_at).toLocaleDateString()}
          </small>
        </div>
        {request.message && (
          <p className="card-text mt-2 mb-0 text-muted small">{request.message}</p>
        )}
        {showActions && (
          <div className="mt-3 d-flex gap-2">
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => onAccept(request.id)}
              disabled={acceptLoadingId === request.id || rejectLoadingId === request.id}
            >
              {acceptLoadingId === request.id ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              ) : null}
              Accept
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onReject(request.id)}
              disabled={acceptLoadingId === request.id || rejectLoadingId === request.id}
            >
              {rejectLoadingId === request.id ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              ) : null}
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
