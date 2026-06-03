import api, { ApiError } from '@/lib/api';
import axios from 'axios';
import type {
  Booking,
  BookingFilters,
  PaginatedResponse,
  SubmitReviewPayload,
  BookingReview,
} from './types';

interface LaravelPaginator<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
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

export const bookingsApi = {
  async getBookings(filters: BookingFilters = {}): Promise<PaginatedResponse<Booking>> {
    const params: Record<string, string | number> = {};

    if (filters.page) params.page = filters.page;
    if (filters.per_page) params.per_page = filters.per_page;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (typeof filters.business_id === 'number') params.business_id = filters.business_id;

    const response = await axios.get<LaravelPaginator<Booking>>(
      `${apiBaseUrl()}/api/v1/bookings`,
      {
        params,
        headers: authHeaders(),
      },
    );

    const body = response.data;

    return {
      data: Array.isArray(body.data) ? body.data : [],
      current_page: body.current_page ?? 1,
      last_page: body.last_page ?? 1,
      per_page: body.per_page ?? filters.per_page ?? 15,
      total: body.total ?? 0,
      from: body.from ?? null,
      to: body.to ?? null,
    };
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
