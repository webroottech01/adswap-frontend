import api from '@/lib/api';
import axios from 'axios';
import type { Promotion } from '@/features/promotions/types';
import type { Business } from '@/features/business/api';
import {
  MarketplaceListing,
  MarketplaceFilters,
  MarketplaceFilterMetadata,
  MarketplacePromotionDetail,
  SavedBrandCheck,
} from './types';

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export const marketplaceApi = {
  async getListings(filters: MarketplaceFilters = {}): Promise<PaginatedResponse<MarketplaceListing>> {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());
    if (filters.city) params.append('city', filters.city);
    if (filters.category) params.append('category', filters.category);
    if (filters.provider_type) params.append('provider_type', filters.provider_type);
    if (filters.promotion_format) params.append('promotion_format', filters.promotion_format);
    if (filters.brand_size) params.append('brand_size', filters.brand_size);
    if (filters.revenue_range) params.append('revenue_range', filters.revenue_range);

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.theadswap.com';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const token = api.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const axiosResponse = await axios.get<PaginatedResponse<MarketplaceListing>>(
      `${baseURL}/api/v1/marketplace?${params.toString()}`,
      { headers },
    );

    return axiosResponse.data;
  },

  async getFilterMetadata(): Promise<MarketplaceFilterMetadata> {
    const response = await api.get<MarketplaceFilterMetadata>('/api/v1/marketplace/metadata');
    return response.data;
  },

  async getBusiness(id: number): Promise<Business> {
    const response = await api.get<Business>(`/api/v1/marketplace/businesses/${id}`);
    return response.data;
  },

  async getBusinessPromotions(id: number): Promise<Promotion[]> {
    const response = await api.get<{ data: Promotion[] }>(
      `/api/v1/marketplace/businesses/${id}/promotions`,
    );
    return response.data?.data ?? [];
  },

  async getPromotionDetail(businessId: number, slug: string): Promise<MarketplacePromotionDetail> {
    const response = await api.get<MarketplacePromotionDetail>(
      `/api/v1/marketplace/businesses/${businessId}/promotions/${encodeURIComponent(slug)}`,
    );
    return response.data;
  },

  async getSavedBrands(): Promise<MarketplaceListing[]> {
    const response = await api.get<{ data: MarketplaceListing[] }>('/api/v1/marketplace/saved-brands');
    return response.data?.data ?? [];
  },

  async saveBrand(savedBusinessId: number): Promise<void> {
    await api.post('/api/v1/marketplace/saved-brands', { saved_business_id: savedBusinessId });
  },

  async unsaveBrand(businessId: number): Promise<void> {
    await api.delete(`/api/v1/marketplace/saved-brands/${businessId}`);
  },

  async checkSavedBrand(businessId: number): Promise<boolean> {
    const response = await api.get<SavedBrandCheck>(
      `/api/v1/marketplace/saved-brands/check/${businessId}`,
    );
    return response.data?.saved ?? false;
  },
};
