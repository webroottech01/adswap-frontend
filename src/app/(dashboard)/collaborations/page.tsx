'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useSentRequests,
  useReceivedRequests,
  useAcceptRequest,
  useRejectRequest,
  CollaborationRequestCard,
} from '@/features/collaboration';

/**
 * Collaborations Page
 * Tabs: Sent | Received. Status badges. Accept/Reject for receiver on pending requests.
 */
export default function CollaborationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  const { data: sentData, loading: sentLoading, error: sentError, refetch: refetchSent } = useSentRequests();
  const { data: receivedData, loading: receivedLoading, error: receivedError, refetch: refetchReceived } = useReceivedRequests();

  const { accept, loadingId: acceptLoadingId, error: acceptError, clearError: clearAcceptError } =
    useAcceptRequest({
      onSuccess: (response) => {
        refetchReceived();
        if (response.conversation_id) {
          router.push(`/messages/${response.conversation_id}`);
        }
      },
    });
  const { reject, loadingId: rejectLoadingId, error: rejectError, clearError: clearRejectError } = useRejectRequest({
    onSuccess: () => refetchReceived(),
  });

  useEffect(() => {
    refetchSent();
    refetchReceived();
  }, [refetchSent, refetchReceived]);

  const error = sentError || receivedError || acceptError || rejectError;
  const loading = activeTab === 'sent' ? sentLoading : receivedLoading;
  const list = activeTab === 'sent' ? sentData : receivedData;

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Collaboration requests</h1>
        <p className="text-muted mb-0">View and manage collaboration requests you sent or received</p>
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
            }}
            aria-label="Close"
          />
        </div>
      )}

      <ul className="nav nav-tabs mb-4">
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
              {activeTab === 'sent' ? 'You have not sent any collaboration requests.' : 'You have not received any collaboration requests.'}
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
              acceptLoadingId={acceptLoadingId ?? null}
              rejectLoadingId={rejectLoadingId ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
