'use client';

import { useEffect } from 'react';
import { useAdminCollaborations } from '@/features/admin-collaborations/hooks';
import { AdminCollaborationFilters } from '@/features/admin-collaborations/components/AdminCollaborationFilters';
import { AdminCollaborationsTable } from '@/features/admin-collaborations/components/AdminCollaborationsTable';

export default function AdminCollaborationsPage() {
  const { data, loading, error, params, refetch } = useAdminCollaborations({
    status: 'all',
    page: 1,
    per_page: 10,
  });

  useEffect(() => {
    void refetch();
  }, []);

  const items = data?.data ?? [];
  const meta = data?.meta;

  const changePage = (page: number) => {
    void refetch({ ...params, page });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Collaborations</h1>
      </div>

      <AdminCollaborationFilters
        onChange={(next) => {
          void refetch(next);
        }}
      />

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      <AdminCollaborationsTable items={items} loading={loading} />

      {meta && meta.last_page > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span className="text-muted">
            Page {meta.current_page} of {meta.last_page} (total {meta.total})
          </span>
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={meta.current_page <= 1 || loading}
              onClick={() => changePage(meta.current_page - 1)}
            >
              Previous
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled={meta.current_page >= meta.last_page || loading}
              onClick={() => changePage(meta.current_page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

