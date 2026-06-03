import api from '@/lib/api';
import type { CollaborationContext } from '@/features/marketplace/types';
import type { CollaborationRequest, SendCollaborationPayload } from './types';

export const collaborationApi = {
  async sendRequest(payload: SendCollaborationPayload): Promise<CollaborationRequest> {
    const body: Record<string, unknown> = {
      receiver_business_id: payload.receiverBusinessId,
      target_promotion_id: payload.targetPromotionId,
      message: payload.message,
    };
    if (payload.senderPromotionId != null) {
      body.sender_promotion_id = payload.senderPromotionId;
    }
    body.message = payload.message?.trim() ?? '';
    if (payload.offeredPrice !== undefined) {
      body.offered_price = payload.offeredPrice;
    }
    if (payload.offeredPriceIsCustom !== undefined) {
      body.offered_price_is_custom = payload.offeredPriceIsCustom;
    }

    const response = await api.post<CollaborationRequest>('/api/v1/collaborations/request', body);
    return response.data;
  },

  async getSent(status?: 'pending' | 'accepted' | 'rejected'): Promise<CollaborationRequest[]> {
    const params = status ? { status } : undefined;
    const response = await api.get<CollaborationRequest[]>('/api/v1/collaborations/sent', { params });
    return Array.isArray(response.data) ? response.data : [];
  },

  async getReceived(status?: 'pending' | 'accepted' | 'rejected'): Promise<CollaborationRequest[]> {
    const params = status ? { status } : undefined;
    const response = await api.get<CollaborationRequest[]>('/api/v1/collaborations/received', { params });
    return Array.isArray(response.data) ? response.data : [];
  },

  async setNegotiateFlag(id: number, marked: boolean): Promise<CollaborationRequest> {
    const response = await api.patch<CollaborationRequest>(
      `/api/v1/collaborations/${id}/negotiate-flag`,
      { marked },
    );
    return response.data;
  },

  async accept(id: number): Promise<CollaborationRequest> {
    const response = await api.patch<CollaborationRequest>(`/api/v1/collaborations/${id}/accept`);
    return response.data;
  },

  async reject(id: number): Promise<CollaborationRequest> {
    const response = await api.patch<CollaborationRequest>(`/api/v1/collaborations/${id}/reject`);
    return response.data;
  },

  async getContext(businessId: number): Promise<CollaborationContext> {
    const response = await api.get<CollaborationContext>(
      `/api/v1/collaborations/context/${businessId}`,
    );
    return response.data;
  },
};
