import api from '@/lib/api';
import axios from 'axios';
import type {
  ConversationDetailResponse,
  ConversationListItem,
  ConversationsResponse,
  Message,
  SendMessagePayload,
} from './types';

interface LaravelPaginator<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.theadswap.com';
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const token = api.getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export const messagingApi = {
  async getConversations(page = 1, perPage = 15): Promise<ConversationsResponse> {
    const response = await axios.get<LaravelPaginator<ConversationListItem>>(
      `${apiBaseUrl()}/api/v1/messages/conversations`,
      {
        params: { page, per_page: perPage },
        headers: authHeaders(),
      },
    );
    const body = response.data;

    return {
      data: Array.isArray(body.data) ? body.data : [],
      meta: {
        current_page: body.current_page ?? page,
        last_page: body.last_page ?? 1,
        per_page: body.per_page ?? perPage,
        total: body.total ?? 0,
      },
    };
  },

  async getConversation(
    id: number,
    page = 1,
    perPage = 20,
  ): Promise<ConversationDetailResponse> {
    const response = await api.get<ConversationDetailResponse>(
      `/api/v1/messages/conversations/${id}`,
      {
        params: { page, per_page: perPage },
        skipGlobalLoading: true,
      },
    );
    return response.data;
  },

  async sendMessage(conversationId: number, payload: SendMessagePayload): Promise<Message> {
    const text = payload.text?.trim() ?? '';
    const files = payload.files ?? [];

    if (files.length > 0) {
      let lastMessage: Message | null = null;
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        if (text) {
          formData.append('message_text', text);
        }
        const response = await api.postMultipart<Message>(
          `/api/v1/messages/${conversationId}`,
          formData,
          { skipGlobalLoading: true },
        );
        lastMessage = response.data;
      }
      if (!lastMessage) {
        throw new Error('Failed to send message');
      }
      return lastMessage;
    }

    if (!text) {
      throw new Error('A message or file is required');
    }

    const response = await api.post<Message>(
      `/api/v1/messages/${conversationId}`,
      { message_text: text },
      { skipGlobalLoading: true },
    );
    return response.data;
  },
};

