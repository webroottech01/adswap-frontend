'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { businessApi } from '@/features/business/api';
import { messagingApi } from './api';
import type { ConversationListItem, ConversationsMeta } from './types';

interface MessagesContextValue {
  conversations: ConversationListItem[];
  meta: ConversationsMeta | null;
  loading: boolean;
  error: string | null;
  myBusinessId: number | null;
  refetchConversations: (page?: number) => Promise<void>;
}

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function useMessagesContext(): MessagesContextValue {
  const ctx = useContext(MessagesContext);
  if (!ctx) {
    throw new Error('useMessagesContext must be used within MessagesProvider');
  }
  return ctx;
}

const DEFAULT_PER_PAGE = 15;

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [meta, setMeta] = useState<ConversationsMeta | null>(null);
  const pageRef = useRef(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myBusinessId, setMyBusinessId] = useState<number | null>(null);

  const conversationsInflight = useRef(false);
  const myBusinessInflight = useRef(false);

  const refetchConversations = useCallback(async (nextPage?: number) => {
    const targetPage = nextPage ?? pageRef.current;
    if (conversationsInflight.current) {
      return;
    }

    conversationsInflight.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await messagingApi.getConversations(targetPage, DEFAULT_PER_PAGE);
      const items = Array.isArray(response?.data) ? response.data : [];
      setConversations(items);
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
      conversationsInflight.current = false;
    }
  }, []);

  const fetchMyBusiness = useCallback(async () => {
    if (myBusinessInflight.current) {
      return;
    }
    myBusinessInflight.current = true;
    try {
      const business = await businessApi.getMyBusiness({ skipGlobalLoading: true });
      setMyBusinessId(business.id);
    } catch {
      setMyBusinessId(null);
    } finally {
      myBusinessInflight.current = false;
    }
  }, []);

  useEffect(() => {
    void refetchConversations(1);
    void fetchMyBusiness();

    return () => {
      conversationsInflight.current = false;
      myBusinessInflight.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: MessagesContextValue = {
    conversations,
    meta,
    loading,
    error,
    myBusinessId,
    refetchConversations,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}
