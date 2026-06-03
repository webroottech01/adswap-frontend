'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import type { CollaborationRequest } from '../types';
import { Badge } from '@/ui/Badge';

interface CollaborationRequestCardProps {
  request: CollaborationRequest;
  variant: 'sent' | 'received';
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onToggleNegotiate?: (id: number, marked: boolean) => void;
  acceptLoadingId: number | null;
  rejectLoadingId: number | null;
  negotiateLoadingId: number | null;
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
  onToggleNegotiate,
  acceptLoadingId,
  rejectLoadingId,
  negotiateLoadingId,
}: CollaborationRequestCardProps) {
  const isPending = request.status === 'pending';
  const otherName = variant === 'sent' ? request.receiver_business_name : request.sender_business_name;
  const showActions = variant === 'received' && isPending && onAccept && onReject;
  const canChat =
    (request.status === 'pending' || request.status === 'accepted') &&
    request.conversation_id != null;
  const negotiateLoading = negotiateLoadingId === request.id;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <h6 className="card-title mb-1">
              {variant === 'sent' ? 'To: ' : 'From: '}
              {otherName ?? `Business #${variant === 'sent' ? request.receiver_business_id : request.sender_business_id}`}
            </h6>
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <Badge variant={statusVariant(request.status)}>{request.status}</Badge>
              {request.marked_negotiating && (
                <Badge variant="secondary">Your negotiate reminder</Badge>
              )}
            </div>
          </div>
          <small className="text-muted">
            {new Date(request.created_at).toLocaleDateString()}
          </small>
        </div>
        {request.message && (
          <p className="card-text mt-2 mb-0 text-muted small">{request.message}</p>
        )}
        <div className="mt-3 d-flex flex-wrap gap-2">
          {showActions && (
            <>
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
            </>
          )}
          {onToggleNegotiate && request.status !== 'rejected' && (
            <button
              type="button"
              className={`btn btn-sm ${request.marked_negotiating ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => onToggleNegotiate(request.id, !request.marked_negotiating)}
              disabled={negotiateLoading}
            >
              {negotiateLoading ? (
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
              ) : null}
              {request.marked_negotiating ? 'Clear negotiate reminder' : 'Remind me to negotiate'}
            </button>
          )}
          {canChat && (
            <Link
              href={`/messages/${request.conversation_id}`}
              className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
            >
              <MessageSquare size={14} className="me-1" />
              Chat
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
