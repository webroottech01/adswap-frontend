'use client';

import { useCallback, useState } from 'react';
import { adminCollaborationsApi, type AdminCollaborationsQueryParams } from './api';
import type { AdminCollaboration, AdminCollaborationListResponse } from './types';

export function useAdminCollaborations(initialParams: AdminCollaborationsQueryParams = {}) {
  const [params, setParams] = useState<AdminCollaborationsQueryParams>(initialParams);
  const [data, setData] = useState<AdminCollaborationListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (override?: AdminCollaborationsQueryParams) => {
      const nextParams = { ...params, ...(override ?? {}) };
      setParams(nextParams);
      setLoading(true);
      setError(null);
      try {
        const response = await adminCollaborationsApi.getCollaborations(nextParams);
        setData(response);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
              'Failed to load collaborations'
            : 'Failed to load collaborations';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [params]
  );

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refetch: fetchData,
  };
}

export function useAdminCollaborationDetail(id: number | null) {
  const [data, setData] = useState<AdminCollaboration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (id == null) return;
    setLoading(true);
    setError(null);
    try {
      const response = await adminCollaborationsApi.getCollaboration(id);
      setData(response);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to load collaboration'
          : 'Failed to load collaboration';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    data,
    loading,
    error,
    refetch: fetchDetail,
  };
}

