import api from '@/lib/api';

/**
 * Service Category Interface
 */
export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Service Interface
 */
export interface Service {
  id: number;
  service_category_id: number;
  category_name: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  order: number;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Create Service Category Data
 */
export interface CreateServiceCategoryData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order?: number;
  is_enabled?: boolean;
}

/**
 * Create Service Data
 */
export interface CreateServiceData {
  service_category_id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order?: number;
  is_enabled?: boolean;
}

/**
 * Update Service Category Data
 */
export interface UpdateServiceCategoryData extends Partial<CreateServiceCategoryData> {}

/**
 * Update Service Data
 */
export interface UpdateServiceData extends Partial<CreateServiceData> {}

/**
 * Feature-level API wrapper for service catalog endpoints.
 * This abstraction allows easy migration to microservices later.
 */
export const serviceCatalogApi = {
  /**
   * Get all service categories
   */
  async getCategories(): Promise<ServiceCategory[]> {
    const response = await api.get<ServiceCategory[]>('/api/v1/admin/service-categories');
    // Handle both wrapped and direct array responses
    const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
    return Array.isArray(data) ? data : [];
  },

  /**
   * Create a new service category
   */
  async createCategory(data: CreateServiceCategoryData): Promise<ServiceCategory> {
    const response = await api.post<ServiceCategory>('/api/v1/admin/service-categories', data);
    return response.data;
  },

  /**
   * Get all services
   */
  async getServices(): Promise<Service[]> {
    const response = await api.get<Service[]>('/api/v1/admin/services');
    // Handle both wrapped and direct array responses
    const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
    return Array.isArray(data) ? data : [];
  },

  /**
   * Get enabled services for app users (non-admin).
   */
  async getEnabledServices(): Promise<Service[]> {
    const response = await api.get<Service[]>('/api/v1/services');
    const data = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
    return Array.isArray(data) ? data : [];
  },

  /**
   * Create a new service
   */
  async createService(data: CreateServiceData): Promise<Service> {
    const response = await api.post<Service>('/api/v1/admin/services', data);
    return response.data;
  },

  /**
   * Update a service
   */
  async updateService(id: number, data: UpdateServiceData): Promise<Service> {
    const response = await api.put<Service>(`/api/v1/admin/services/${id}`, data);
    return response.data;
  },

  /**
   * Toggle service enabled status
   */
  async toggleService(id: number): Promise<Service> {
    const response = await api.patch<Service>(`/api/v1/admin/services/${id}/toggle`);
    return response.data;
  },
};

