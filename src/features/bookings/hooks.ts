'use client';

import { useCallback, useEffect, useState } from 'react';
import { bookingsApi, type ApiError } from './api';
import type { Booking, BookingFilters, PaginatedResponse } from './types';

interface PaginationState {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export function useBookings(initialFilters: BookingFilters = {}) {
  const [data, setData] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null,
    to: null,
  });
  const [filters, setFilters] = useState<BookingFilters>({
    page: 1,
    per_page: 15,
    ...initialFilters,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (override?: Partial<BookingFilters>) => {
      const nextFilters: BookingFilters = { ...filters, ...override };

      setLoading(true);
      setError(null);

      try {
        const response: PaginatedResponse<Booking> = await bookingsApi.getBookings(nextFilters);

        setData(Array.isArray(response.data) ? response.data : []);
        setPagination({
          current_page: response.current_page || 1,
          last_page: response.last_page || 1,
          per_page: response.per_page || nextFilters.per_page || 15,
          total: response.total || 0,
          from: response.from ?? null,
          to: response.to ?? null,
        });
        setFilters(nextFilters);
      } catch (err: unknown) {
        const message =
          err && typeof err === 'object' && 'response' in err
            ? ((err as { response?: { data?: ApiError } }).response?.data?.message ??
              'Failed to load bookings')
            : 'Failed to load bookings';
        setError(message);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isEmpty = !loading && data.length === 0;

  return {
    data,
    pagination,
    filters,
    setFilters,
    loading,
    isEmpty,
    error,
    refetch,
  };
}

