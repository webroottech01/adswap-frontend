import api, { ApiError } from '@/lib/api';
import type {
  Booking,
  BookingFilters,
  PaginatedResponse,
  SubmitReviewPayload,
  BookingReview,
} from './types';

export const bookingsApi = {
  async getBookings(filters: BookingFilters = {}): Promise<PaginatedResponse<Booking>> {
    const params: Record<string, any> = {};

    if (filters.page) params.page = filters.page;
    if (filters.per_page) params.per_page = filters.per_page;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (typeof filters.business_id === 'number') params.business_id = filters.business_id;

    const response = await api.get<PaginatedResponse<Booking>>('/api/v1/bookings', {
      params,
    });

    return response.data;
  },

  async submitReview(collaborationId: number, payload: SubmitReviewPayload): Promise<BookingReview> {
    const response = await api.post<BookingReview>(
      `/api/v1/bookings/${collaborationId}/review`,
      payload,
    );
    return response.data;
  },
};

export type { ApiError };

