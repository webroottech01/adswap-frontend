'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAdminCollaborationDetail } from '@/features/admin-collaborations/hooks';

export default function AdminCollaborationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data, loading, error, refetch } = useAdminCollaborationDetail(Number.isNaN(id) ? null : id);

  useEffect(() => {
    if (!Number.isNaN(id)) {
      void refetch();
    }
  }, [id, refetch]);

  if (Number.isNaN(id)) {
    return <div className="container-fluid py-4">Invalid collaboration id.</div>;
  }

  return (
    <div className="container-fluid py-4">
      <h1 className="h4 mb-3">Collaboration details</h1>

      {loading && <p className="text-muted">Loading collaboration...</p>}
      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {data && (
        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <h2 className="h6">Businesses</h2>
              <p className="mb-1">
                <strong>Sender:</strong>{' '}
                {data.sender_business_name ?? `Business #${data.sender_business_id}`} (ID:{' '}
                {data.sender_business_id})
              </p>
              <p className="mb-0">
                <strong>Receiver:</strong>{' '}
                {data.receiver_business_name ?? `Business #${data.receiver_business_id}`} (ID:{' '}
                {data.receiver_business_id})
              </p>
            </div>

            <div className="mb-3">
              <h2 className="h6">Status</h2>
              <p className="mb-1 text-capitalize">{data.status}</p>
              <p className="mb-0 text-muted">
                Created at {new Date(data.created_at).toLocaleString()}
                {' · '}
                Updated at {new Date(data.updated_at).toLocaleString()}
              </p>
            </div>

            <div>
              <h2 className="h6">Message</h2>
              <p className="mb-0">{data.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

