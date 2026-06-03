'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useSentRequests,
  useReceivedRequests,
  useAcceptRequest,
  useRejectRequest,
  useNegotiateFlag,
  CollaborationRequestCard,
} from '@/features/collaboration';
import type { CollaborationStatusFilter } from '@/features/collaboration/types';

const STATUS_TABS: { key: CollaborationStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'negotiate', label: 'Negotiate' },
];

/**
 * Collaborations Page
 * Sent | Received tabs; status and private negotiate filters; accept/reject; chat.
 */
export default function CollaborationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');
  const [statusFilter, setStatusFilter] = useState<CollaborationStatusFilter>('all');

  const { data: sentData, loading: sentLoading, error: sentError, refetch: refetchSent } =
    useSentRequests(statusFilter);
  const { data: receivedData, loading: receivedLoading, error: receivedError, refetch: refetchReceived } =
    useReceivedRequests(statusFilter);

  const refetchAll = () => {
    refetchSent();
    refetchReceived();
  };

  const { accept, loadingId: acceptLoadingId, error: acceptError, clearError: clearAcceptError } =
    useAcceptRequest({
      onSuccess: (response) => {
        refetchAll();
        if (response.conversation_id) {
          router.push(`/messages/${response.conversation_id}`);
        }
      },
    });
  const { reject, loadingId: rejectLoadingId, error: rejectError, clearError: clearRejectError } =
    useRejectRequest({
      onSuccess: () => refetchAll(),
    });
  const {
    toggle: toggleNegotiate,
    loadingId: negotiateLoadingId,
    error: negotiateError,
    clearError: clearNegotiateError,
  } = useNegotiateFlag({
    onSuccess: () => refetchAll(),
  });

  const error = sentError || receivedError || acceptError || rejectError || negotiateError;
  const loading = activeTab === 'sent' ? sentLoading : receivedLoading;
  const list = activeTab === 'sent' ? sentData : receivedData;

  const handleToggleNegotiate = (id: number, marked: boolean) => {
    toggleNegotiate(id, marked);
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Collaboration requests</h1>
        <p className="text-muted mb-0">
          Exchange requests with other businesses, chat while negotiating, and track your private
          reminders for follow-up.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              clearAcceptError();
              clearRejectError();
              clearNegotiateError();
            }}
            aria-label="Close"
          />
        </div>
      )}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            Sent
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Received
          </button>
        </li>
      </ul>

      <ul className="nav nav-pills mb-4 flex-wrap gap-1">
        {STATUS_TABS.map((tab) => (
          <li key={tab.key} className="nav-item">
            <button
              type="button"
              className={`nav-link ${statusFilter === tab.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {loading && list.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      ) : list.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-0">
              {statusFilter === 'negotiate'
                ? 'No requests with your negotiate reminder in this tab.'
                : activeTab === 'sent'
                  ? 'You have not sent any collaboration requests.'
                  : 'You have not received any collaboration requests.'}
            </p>
          </div>
        </div>
      ) : (
        <div>
          {list.map((request) => (
            <CollaborationRequestCard
              key={request.id}
              request={request}
              variant={activeTab}
              onAccept={activeTab === 'received' ? accept : undefined}
              onReject={activeTab === 'received' ? reject : undefined}
              onToggleNegotiate={handleToggleNegotiate}
              acceptLoadingId={acceptLoadingId ?? null}
              rejectLoadingId={rejectLoadingId ?? null}
              negotiateLoadingId={negotiateLoadingId ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
