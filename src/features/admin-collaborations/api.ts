import api from '@/lib/api';
import type { AdminCollaboration, AdminCollaborationListResponse } from './types';

export interface AdminCollaborationsQueryParams {
  status?: string;
  business?: string;
  from?: string;
  to?: string;
  page?: number;
  per_page?: number;
}

export const adminCollaborationsApi = {
  async getCollaborations(params: AdminCollaborationsQueryParams = {}): Promise<AdminCollaborationListResponse> {
    const response = await api.get<AdminCollaborationListResponse>('/api/v1/admin/collaborations', {
      params,
    });
    return response.data;
  },

  async getCollaboration(id: number): Promise<AdminCollaboration> {
    const response = await api.get<AdminCollaboration>(`/api/v1/admin/collaborations/${id}`);
    return response.data;
  },
};

