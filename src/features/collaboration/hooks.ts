'use client';

import { useState, useCallback } from 'react';
import { collaborationApi } from './api';
import type { CollaborationRequest } from './types';

/**
 * Fetch sent collaboration requests.
 */
export function useSentRequests() {
  const [data, setData] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await collaborationApi.getSent();
      setData(list);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to load sent requests'
        : 'Failed to load sent requests';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch };
}

/**
 * Fetch received collaboration requests.
 */
export function useReceivedRequests() {
  const [data, setData] = useState<CollaborationRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await collaborationApi.getReceived();
      setData(list);
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to load received requests'
        : 'Failed to load received requests';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch };
}

/**
 * Send a collaboration request. Returns mutate function and loading/error state.
 */
export function useSendRequest(options?: { onSuccess?: () => void; onError?: (message: string) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (receiverBusinessId: number, message: string) => {
      setLoading(true);
      setError(null);
      try {
        await collaborationApi.sendRequest(receiverBusinessId, message);
        options?.onSuccess?.();
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to send request'
            : 'Failed to send request';
        setError(message);
        options?.onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return { send, loading, error, clearError: () => setError(null) };
}

/**
 * Accept a collaboration request. Returns mutate function and loading/error state.
 * Call onSuccess to refetch received list (e.g. refetch() from useReceivedRequests) and handle redirect.
 */
export function useAcceptRequest(options?: {
  onSuccess?: (response: CollaborationRequest) => void;
  onError?: (message: string) => void;
}) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accept = useCallback(
    async (id: number) => {
      setLoadingId(id);
      setError(null);
      try {
        const response = await collaborationApi.accept(id);
        options?.onSuccess?.(response);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to accept'
            : 'Failed to accept';
        setError(message);
        options?.onError?.(message);
      } finally {
        setLoadingId(null);
      }
    },
    [options]
  );

  return { accept, loadingId, error, clearError: () => setError(null) };
}

/**
 * Reject a collaboration request.
 */
export function useRejectRequest(options?: { onSuccess?: () => void; onError?: (message: string) => void }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reject = useCallback(
    async (id: number) => {
      setLoadingId(id);
      setError(null);
      try {
        await collaborationApi.reject(id);
        options?.onSuccess?.();
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to reject'
            : 'Failed to reject';
        setError(message);
        options?.onError?.(message);
      } finally {
        setLoadingId(null);
      }
    },
    [options]
  );

  return { reject, loadingId, error, clearError: () => setError(null) };
}
