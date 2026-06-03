import api, { ApiError } from '@/lib/api';
import type {
  CreatePromotionPayload,
  Promotion,
  PromotionMedia,
  PromotionStatus,
  UpdatePromotionPayload,
} from './types';

function extractMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || 'Request failed';
  }
  return 'Request failed';
}

export const promotionsApi = {
  async list(status?: PromotionStatus): Promise<Promotion[]> {
    const params = status ? { status } : undefined;
    const response = await api.get<Promotion[]>('/api/v1/promotions', { params });
    return Array.isArray(response.data) ? response.data : [];
  },

  async get(id: number): Promise<Promotion> {
    const response = await api.get<Promotion>(`/api/v1/promotions/${id}`);
    return response.data;
  },

  async create(payload: CreatePromotionPayload): Promise<Promotion> {
    const response = await api.post<Promotion>('/api/v1/promotions', payload);
    return response.data;
  },

  async update(id: number, payload: UpdatePromotionPayload): Promise<Promotion> {
    const response = await api.put<Promotion>(`/api/v1/promotions/${id}`, payload);
    return response.data;
  },

  async publish(id: number): Promise<Promotion> {
    const response = await api.patch<Promotion>(`/api/v1/promotions/${id}/publish`);
    return response.data;
  },

  async pause(id: number): Promise<Promotion> {
    const response = await api.patch<Promotion>(`/api/v1/promotions/${id}/pause`);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/api/v1/promotions/${id}`);
  },

  async uploadMedia(promotionId: number, files: File[]): Promise<PromotionMedia[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files[]', file);
    });
    const response = await api.postMultipart<PromotionMedia[]>(
      `/api/v1/promotions/${promotionId}/media`,
      formData,
    );
    return Array.isArray(response.data) ? response.data : [];
  },

  async deleteMedia(promotionId: number, mediaId: number): Promise<void> {
    await api.delete(`/api/v1/promotions/${promotionId}/media/${mediaId}`);
  },
};

export { extractMessage, type ApiError };
