import api from '@/lib/api';
import type {
  ConversationDetailResponse,
  ConversationsResponse,
  Message,
} from './types';

export const messagingApi = {
  async getConversations(page = 1, perPage = 15): Promise<ConversationsResponse> {
    const response = await api.get<ConversationsResponse>('/api/v1/messages/conversations', {
      params: { page, per_page: perPage },
    });
    return response.data;
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
      },
    );
    return response.data;
  },

  async sendMessage(conversationId: number, messageText: string): Promise<Message> {
    const response = await api.post<Message>(`/api/v1/messages/${conversationId}`, {
      message_text: messageText,
    });
    return response.data;
  },
};

