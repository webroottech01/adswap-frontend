'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { messagingApi } from './api';
import type {
  ConversationDetailResponse,
  ConversationListItem,
  ConversationsMeta,
  Message,
  SendMessagePayload,
} from './types';

export function useConversations(initialPage = 1, initialPerPage = 15) {
  const [data, setData] = useState<ConversationListItem[]>([]);
  const [meta, setMeta] = useState<ConversationsMeta | null>(null);
  const pageRef = useRef(initialPage);
  const [perPage] = useState(initialPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflightRef = useRef(false);

  const refetch = useCallback(async (nextPage?: number) => {
    const targetPage = nextPage ?? pageRef.current;
    if (inflightRef.current) {
      return;
    }

    inflightRef.current = true;
    setLoading(true);
    setError(null);
    try {
      const response = await messagingApi.getConversations(targetPage, perPage);
      const items = Array.isArray(response?.data) ? response.data : [];
      setData(items);
      setMeta(response.meta ?? null);
      pageRef.current = targetPage;
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to load conversations'
          : 'Failed to load conversations';
      setError(message);
    } finally {
      setLoading(false);
      inflightRef.current = false;
    }
  }, [perPage]);

  return { data, meta, page: pageRef.current, perPage, loading, error, refetch };
}

export function useConversationDetail(
  conversationId: number,
  initialPage = 1,
  initialPerPage = 20,
) {
  const [data, setData] = useState<ConversationDetailResponse | null>(null);
  const pageRef = useRef(initialPage);
  const [perPage] = useState(initialPerPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflightRef = useRef(false);

  const fetchDetail = useCallback(
    async (targetPage: number, options?: { clearMessages?: boolean }) => {
      if (!conversationId || conversationId < 1) {
        return;
      }
      if (inflightRef.current) {
        return;
      }

      inflightRef.current = true;
      if (options?.clearMessages) {
        setData(null);
      }
      setLoading(true);
      setError(null);

      try {
        const response = await messagingApi.getConversation(
          conversationId,
          targetPage,
          perPage,
        );
        setData(response);
        pageRef.current = targetPage;
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
              'Failed to load messages'
            : 'Failed to load messages';
        setError(message);
        if (options?.clearMessages) {
          setData(null);
        }
      } finally {
        setLoading(false);
        inflightRef.current = false;
      }
    },
    [conversationId, perPage],
  );

  useEffect(() => {
    if (!conversationId || conversationId < 1) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    void fetchDetail(1, { clearMessages: true });

    return () => {
      inflightRef.current = false;
    };
  }, [conversationId, fetchDetail]);

  const refetch = useCallback(
    async (nextPage?: number) => {
      const targetPage = nextPage ?? pageRef.current;
      const hasMessages = (data?.messages?.length ?? 0) > 0;
      await fetchDetail(targetPage, { clearMessages: !hasMessages });
    },
    [data?.messages?.length, fetchDetail],
  );

  return { data, page: pageRef.current, perPage, loading, error, refetch };
}

export function useSendMessage(options?: {
  onSuccess?: (message: Message) => void;
  onError?: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (conversationId: number, payload: SendMessagePayload) => {
      const text = payload.text?.trim() ?? '';
      const files = payload.files ?? [];
      if (!text && files.length === 0) {
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const message = await messagingApi.sendMessage(conversationId, { text, files });
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
