import { useState, useEffect, useCallback, useRef } from 'react';
import { marketplaceApi, PaginatedResponse } from './api';
import { MarketplaceListing, MarketplaceFilters, MarketplaceFilterMetadata } from './types';
import { ApiError } from '@/lib/api';

/**
 * Custom hook for debouncing values
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for fetching marketplace listings with filters
 */
export const useMarketplace = (filters: MarketplaceFilters = {}) => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: null as number | null,
    to: null as number | null,
  });

  const debouncedFilters = useDebounce(filters, 300);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: PaginatedResponse<MarketplaceListing> = await marketplaceApi.getListings({
        ...debouncedFilters,
        page: debouncedFilters.page || 1,
        per_page: debouncedFilters.per_page || 15,
      });

      setListings(Array.isArray(response.data) ? response.data : []);
      setPagination({
        current_page: response.current_page || 1,
        last_page: response.last_page || 1,
        per_page: response.per_page || 15,
        total: response.total || 0,
        from: response.from ?? null,
        to: response.to ?? null,
      });
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      const errorMessage = apiError?.message || 'Failed to load marketplace listings. Please try again.';
      setError(errorMessage);
      setListings([]);
      console.error('Error fetching marketplace listings:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    loading,
    error,
    pagination,
    refetch: fetchListings,
  };
};

/**
 * Hook for managing marketplace filter state with debouncing
 */
export const useMarketplaceFilters = () => {
  const [filters, setFilters] = useState<MarketplaceFilters>({
    page: 1,
    per_page: 15,
  });
  const [metadata, setMetadata] = useState<MarketplaceFilterMetadata | null>(null);
  const [metadataLoading, setMetadataLoading] = useState(false);
  const prevFiltersRef = useRef<MarketplaceFilters>({});

  // Load filter metadata on mount
  useEffect(() => {
    const loadMetadata = async () => {
      setMetadataLoading(true);
      try {
        const data = await marketplaceApi.getFilterMetadata();
        setMetadata(data);
      } catch (err) {
        console.error('Error loading filter metadata:', err);
      } finally {
        setMetadataLoading(false);
      }
    };

    loadMetadata();
  }, []);

  // Reset to page 1 when filters change (except page changes)
  useEffect(() => {
    const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
    const pageChanged = prevFiltersRef.current.page !== filters.page;

    if (filtersChanged && !pageChanged && filters.page !== 1) {
      setFilters((prev) => ({ ...prev, page: 1 }));
      prevFiltersRef.current = filters;
      return;
    }

    prevFiltersRef.current = filters;
  }, [filters]);

  const updateFilter = useCallback((key: keyof MarketplaceFilters, value: string | number | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      // Remove filter if value is empty/undefined
      if (value === undefined || value === '' || value === null) {
        delete newFilters[key];
      }
      return newFilters;
    });
  }, []);

  const updateFilters = useCallback((newFilters: Partial<MarketplaceFilters>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      // Remove filters with empty values
      Object.keys(updated).forEach((key) => {
        const value = updated[key as keyof MarketplaceFilters];
        if (value === undefined || value === '' || value === null) {
          delete updated[key as keyof MarketplaceFilters];
        }
      });
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      per_page: 15,
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    filters,
    metadata,
    metadataLoading,
    updateFilter,
    updateFilters,
    resetFilters,
    setPage,
  };
};




