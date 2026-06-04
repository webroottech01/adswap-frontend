import api, { ApiError } from '@/lib/api';
import type {
  CreatePromotionPayload,
  Promotion,
  PromotionCategory,
  PromotionMedia,
  PromotionStatus,
  UpdatePromotionPayload,
} from './types';

export interface PromotionApiError {
  message: string;
  fieldErrors: Record<string, string[]>;
}

const FIELD_ERROR_LABELS: Record<string, string> = {
  'details.target_partner_category_ids': 'Target partner category',
  'details.target_location': 'Target location',
  'details.placement_type': 'Placement type',
  'details.what_i_can_offer': 'What I can offer',
  'details.what_i_expect_in_return': 'What I expect in return',
  title: 'Title',
};

function parseAxiosData(data: unknown): { message: string; fieldErrors: Record<string, string[]> } {
  const body = data as { message?: string; errors?: Record<string, string[]> } | undefined;
  const fieldErrors = body?.errors && typeof body.errors === 'object' ? body.errors : {};
  const message =
    body?.message ||
    (Object.keys(fieldErrors).length > 0 ? 'Please fix the errors below.' : 'Request failed');
  return { message, fieldErrors };
}

export function extractApiError(error: unknown): PromotionApiError {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: unknown } };
    const parsed = parseAxiosData(axiosError.response?.data);
    return { message: parsed.message, fieldErrors: parsed.fieldErrors };
  }
  return { message: 'Request failed', fieldErrors: {} };
}

function extractMessage(error: unknown): string {
  return extractApiError(error).message;
}

export function formatFieldErrors(fieldErrors: Record<string, string[]>): string[] {
  return Object.entries(fieldErrors).flatMap(([key, messages]) => {
    const label = FIELD_ERROR_LABELS[key] ?? key.replace(/^details\./, '').replace(/_/g, ' ');
    return messages.map((m) => `${label}: ${m}`);
  });
}

export const promotionsApi = {
  async list(category: PromotionCategory, status?: PromotionStatus): Promise<Promotion[]> {
    const params: Record<string, string> = { category };
    if (status) {
      params.status = status;
    }
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
