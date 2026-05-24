import api from '@/lib/api';
import axios from 'axios';
import { MarketplaceListing, MarketplaceFilters, MarketplaceFilterMetadata } from './types';

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

/**
 * Feature-level API wrapper for marketplace endpoints.
 * This abstraction allows easy migration to microservices later.
 */
export const marketplaceApi = {
  /**
   * Get paginated marketplace listings with filters
   */
  async getListings(filters: MarketplaceFilters = {}): Promise<PaginatedResponse<MarketplaceListing>> {
    const params = new URLSearchParams();

    // Add pagination params
    if (filters.page) {
      params.append('page', filters.page.toString());
    }
    if (filters.per_page) {
      params.append('per_page', filters.per_page.toString());
    }

    // Add filter params
    if (filters.city) {
      params.append('city', filters.city);
    }
    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.provider_type) {
      params.append('provider_type', filters.provider_type);
    }
    if (filters.promotion_format) {
      params.append('promotion_format', filters.promotion_format);
    }
    if (filters.brand_size) {
      params.append('brand_size', filters.brand_size);
    }
    if (filters.revenue_range) {
      params.append('revenue_range', filters.revenue_range);
    }

    // Use raw axios call to get the full paginated response without data extraction
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    
    const axiosResponse = await axios.get<PaginatedResponse<MarketplaceListing>>(
      `${baseURL}/v1/marketplace?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    
    // Return the full paginated response object
    return axiosResponse.data;
  },

  /**
   * Get filter metadata (categories, cities, revenue ranges)
   */
  async getFilterMetadata(): Promise<MarketplaceFilterMetadata> {
    const response = await api.get<MarketplaceFilterMetadata>('/v1/marketplace/metadata');
    return response.data;
  },
};




