import api from '@/lib/api';
import type { CollaborationRequest } from './types';

/**
 * Collaboration API. All methods use the shared API client (auth token attached).
 */
export const collaborationApi = {
  /**
   * Send a collaboration request to a business (by id).
   */
  async sendRequest(receiverBusinessId: number, message: string): Promise<CollaborationRequest> {
    const response = await api.post<CollaborationRequest>('/api/v1/collaborations/request', {
      receiver_business_id: receiverBusinessId,
      message,
    });
    return response.data;
  },

  /**
   * Get requests sent by the current user's business.
   */
  async getSent(): Promise<CollaborationRequest[]> {
    const response = await api.get<CollaborationRequest[]>('/api/v1/collaborations/sent');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get requests received by the current user's business.
   */
  async getReceived(): Promise<CollaborationRequest[]> {
    const response = await api.get<CollaborationRequest[]>('/api/v1/collaborations/received');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Accept a collaboration request (receiver only).
   */
  async accept(id: number): Promise<CollaborationRequest> {
    const response = await api.patch<CollaborationRequest>(`/api/v1/collaborations/${id}/accept`);
    return response.data;
  },

  /**
   * Reject a collaboration request (receiver only).
   */
  async reject(id: number): Promise<CollaborationRequest> {
    const response = await api.patch<CollaborationRequest>(`/api/v1/collaborations/${id}/reject`);
    return response.data;
  },
};
