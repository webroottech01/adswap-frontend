import api from '@/lib/api';
import axios from 'axios';
import { Business, BusinessFilters } from './types';

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

/**
 * Business Statistics Response
 */
export interface BusinessStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
}

/**
 * Admin API client for business management.
 * Feature-level API wrapper for admin endpoints.
 */
export const adminApi = {
  /**
   * Get paginated list of all businesses
   */
  async getBusinesses(
    page: number = 1,
    filters?: BusinessFilters
  ): Promise<PaginatedResponse<Business>> {
    const params = new URLSearchParams();
    params.append('per_page', '15');
    params.append('page', page.toString());

    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.is_provider !== undefined && filters.is_provider !== 'all') {
      params.append('is_provider', filters.is_provider.toString());
    }
    if (filters?.is_buyer !== undefined && filters.is_buyer !== 'all') {
      params.append('is_buyer', filters.is_buyer.toString());
    }

    // Use raw axios call to get the full paginated response without data extraction
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.theadswap.com';
    const token = localStorage.getItem('auth_token');
    
    const axiosResponse = await axios.get<PaginatedResponse<Business>>(
      `${baseURL}/api/v1/admin/businesses?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    
    // Return the full paginated response object
    return axiosResponse.data;
  },

  /**
   * Get business statistics with optional filters
   */
  async getStatistics(filters?: BusinessFilters): Promise<BusinessStatistics> {
    const params = new URLSearchParams();

    if (filters?.search) {
      params.append('search', filters.search);
    }
    if (filters?.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters?.is_provider !== undefined && filters.is_provider !== 'all') {
      params.append('is_provider', filters.is_provider.toString());
    }
    if (filters?.is_buyer !== undefined && filters.is_buyer !== 'all') {
      params.append('is_buyer', filters.is_buyer.toString());
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://api.theadswap.com';
    const token = localStorage.getItem('auth_token');
    
    const axiosResponse = await axios.get<BusinessStatistics>(
      `${baseURL}/api/v1/admin/businesses/statistics?${params.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );
    
    return axiosResponse.data;
  },

  /**
   * Approve a business
   */
  async approveBusiness(id: number): Promise<Business> {
    const response = await api.patch<Business>(`/api/v1/admin/businesses/${id}/approve`);
    return response.data;
  },

  /**
   * Reject a business
   */
  async rejectBusiness(id: number): Promise<Business> {
    const response = await api.patch<Business>(`/api/v1/admin/businesses/${id}/reject`);
    return response.data;
  },

  /**
   * Suspend a business
   */
  async suspendBusiness(id: number): Promise<Business> {
    const response = await api.patch<Business>(`/api/v1/admin/businesses/${id}/suspend`);
    return response.data;
  },
};

