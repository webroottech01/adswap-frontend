'use client';

import { useCallback, useState } from 'react';
import { messagingApi } from './api';
import type {
  ConversationDetailResponse,
  ConversationListItem,
  ConversationsMeta,
  Message,
} from './types';

export function useConversations(initialPage = 1, initialPerPage = 15) {
  const [data, setData] = useState<ConversationListItem[]>([]);
  const [meta, setMeta] = useState<ConversationsMeta | null>(null);
  const [page, setPage] = useState(initialPage);
  const [perPage] = useState(initialPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (nextPage?: number) => {
      const targetPage = nextPage ?? page;
      setLoading(true);
      setError(null);
      try {
        const response = await messagingApi.getConversations(targetPage, perPage);
        setData(response.data);
        setMeta(response.meta);
        setPage(targetPage);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
              'Failed to load conversations'
            : 'Failed to load conversations';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [page, perPage],
  );

  return { data, meta, page, perPage, loading, error, refetch };
}

export function useConversationDetail(
  conversationId: number,
  initialPage = 1,
  initialPerPage = 20,
) {
  const [data, setData] = useState<ConversationDetailResponse | null>(null);
  const [page, setPage] = useState(initialPage);
  const [perPage] = useState(initialPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (nextPage?: number) => {
      const targetPage = nextPage ?? page;
      if (!conversationId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await messagingApi.getConversation(conversationId, targetPage, perPage);
        setData(response);
        setPage(targetPage);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
              'Failed to load messages'
            : 'Failed to load messages';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, page, perPage],
  );

  return { data, page, perPage, loading, error, refetch };
}

export function useSendMessage(options?: {
  onSuccess?: (message: Message) => void;
  onError?: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (conversationId: number, messageText: string) => {
      if (!messageText.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const message = await messagingApi.sendMessage(conversationId, messageText);
        options?.onSuccess?.(message);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
              'Failed to send message'
            : 'Failed to send message';
        setError(message);
        options?.onError?.(message);
      } finally {
        setLoading(false);
      }
    },
    [options],
  );

  return { send, loading, error, clearError: () => setError(null) };
}

