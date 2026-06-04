import api from '@/lib/api';

/**
 * Business Category Interface
 */
export interface BusinessCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  sort_order: number;
  parent_category_id: number | null;
}

/**
 * Business Profile Interface
 */
export interface BusinessProfile {
  scale?: string;
  industry_experience_years?: number;
  key_products_services?: string[];
  geographic_reach?: string[];
  social_media_handles?: Record<string, string>;
  additional_info?: string;
}

/**
 * Business Asset Interface
 */
export interface BusinessAsset {
  id: number;
  asset_type: string;
  file_path: string;
  file_url?: string | null;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at?: string;
}

/**
 * Business Document Interface
 */
export interface BusinessDocument {
  id: number;
  document_type: string;
  file_path: string;
  file_url?: string | null;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  status: string;
  uploaded_at?: string;
}

export interface BusinessServiceItem {
  id: number;
  name: string;
  slug: string;
  category_name: string;
}

/**
 * Business Interface
 */
export interface CompletionSection {
  key: string;
  label: string;
  weight: number;
  filled: number;
  missing_fields: string[];
}

export interface Business {
  id: number;
  user_id: number | null;
  name: string;
  category: string;
  category_id?: number | null;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  is_provider: boolean;
  is_buyer: boolean;
  promotion_intent?: 'cross' | 'paid' | 'both' | 'none' | null;
  description: string | null;
  address: string | null;
  city?: string | null;
  area?: string | null;
  contact_person?: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_path: string | null;
  logo_url?: string | null;
  service_ids: number[];
  supported_category_ids?: number[];
  services?: BusinessServiceItem[];
  average_rating?: number | null;
  business_type?: string;
  registration_number?: string;
  founded_year?: number;
  employee_count?: number;
  annual_revenue_range?: string;
  target_audience?: string[];
  collaboration_preferences?: Record<string, any>;
  preferred_partner_category_ids?: number[];
  preferred_location_radius?: string | null;
  onboarding_step?: number;
  onboarding_completed_at?: string | null;
  profile_completion_percentage?: number;
  verification_status?: 'not_submitted' | 'under_review' | 'verified' | 'rejected';
  completion_sections?: CompletionSection[];
  profile?: BusinessProfile;
  assets?: BusinessAsset[];
  documents?: BusinessDocument[];
  created_at: string;
  updated_at: string;
}

/**
 * Create Business Data Interface
 */
export interface CreateBusinessData {
  name: string;
  category?: string;
  category_id?: number;
  address?: string;
  city?: string;
  area?: string;
  contact_person?: string;
  business_type?: 'individual' | 'proprietorship' | 'partnership' | 'llp' | 'company';
  promotion_intent?: 'cross' | 'paid' | 'both' | 'none';
  supported_category_ids?: number[];
  preferred_partner_category_ids?: number[];
  preferred_location_radius?: string;
  onboarding_step?: number;
  is_draft?: boolean;
  submit_for_review?: boolean;
  registration_number?: string;
  founded_year?: number;
  description?: string;
  is_provider: boolean;
  is_buyer: boolean;
  collaboration_preferences?: Record<string, any>;
  service_ids?: number[];
  // Step 4
  employee_count?: number;
  annual_revenue_range?: string;
  target_audience?: string[];
  profile?: {
    scale?: 'micro' | 'small' | 'medium' | 'large';
    industry_experience_years?: number;
    key_products_services?: string[];
    geographic_reach?: string[];
    social_media_handles?: Record<string, string>;
    additional_info?: string;
  };
  // Step 5
  preferred_collaboration_types?: string[];
  budget_range?: string;
  collaboration_notes?: string;
  // Step 6
  assets?: Array<{
    asset_type: 'logo' | 'brand_image' | 'promotional_material';
    file_path: string;
    file_name: string;
    file_size?: number;
    mime_type?: string;
  }>;
  // Step 7
  documents?: Array<{
    document_type: 'gst' | 'shop_act' | 'pan' | 'registration' | 'license' | 'tax_id' | 'other';
    file_path: string;
    file_name: string;
    file_size?: number;
    mime_type?: string;
  }>;
  // Legacy fields
  phone?: string;
  email?: string;
  website?: string;
  logo_path?: string;
}

/**
 * Update Business Data Interface
 */
export interface UpdateBusinessData extends Partial<CreateBusinessData> {}

/**
 * API Response for Categories
 */
export interface CategoriesResponse {
  data: BusinessCategory[];
}

/**
 * Feature-level API wrapper for business endpoints.
 * This abstraction allows easy migration to microservices later.
 */
export const businessApi = {
  /**
   * Get all active business categories
   */
  async getCategories(): Promise<BusinessCategory[]> {
    const response = await api.get<BusinessCategory[]>('/api/v1/business/categories');
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Create a new business for the authenticated user
   * Handles both JSON data and FormData for file uploads
   */
  async createBusiness(data: CreateBusinessData | FormData): Promise<Business> {
    const config: any = {};
    // For FormData, don't set Content-Type - axios will set it with boundary
    // For JSON, the default Content-Type from api client is fine
    if (data instanceof FormData) {
      // Remove Content-Type header to let axios set it with boundary
      config.headers = { 'Content-Type': undefined };
    }
    
    const response = await api.post<Business>('/api/v1/business', data, config);
    // The api.post already extracts response.data, so response.data is the Business object
    return response.data;
  },

  /**
   * Get the authenticated user's business
   */
  async getMyBusiness(options?: { skipGlobalLoading?: boolean }): Promise<Business> {
    const response = await api.get<Business>('/api/v1/business/me', {
      skipGlobalLoading: options?.skipGlobalLoading,
    });
    return response.data;
  },

  /**
   * Update the authenticated user's business
   */
  async updateBusiness(data: UpdateBusinessData): Promise<Business> {
    const response = await api.put<Business>('/api/v1/business/me', data);
    return response.data;
  },

  async saveDraft(data: UpdateBusinessData): Promise<Business> {
    const response = await api.patch<Business>('/api/v1/business/me', { ...data, is_draft: true });
    return response.data;
  },

  async submitForReview(data: UpdateBusinessData): Promise<Business> {
    const response = await api.post<Business>('/api/v1/business/me/submit', data);
    return response.data;
  },

  async createDraft(name: string, onboardingStep = 1): Promise<Business> {
    const response = await api.post<Business>('/api/v1/business', {
      name,
      is_draft: true,
      onboarding_step: onboardingStep,
    });
    return response.data;
  },

  async uploadLogo(file: File): Promise<Business> {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post<Business>('/api/v1/business/me/logo', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  async uploadAssets(files: File[], assetType = 'outlet_image'): Promise<Business> {
    const formData = new FormData();
    files.forEach((f) => formData.append('files[]', f));
    formData.append('asset_type', assetType);
    const response = await api.post<Business>('/api/v1/business/me/assets', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },

  async uploadDocument(file: File, documentType: string): Promise<Business> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);
    const response = await api.post<Business>('/api/v1/business/me/documents', formData, {
      headers: { 'Content-Type': undefined },
    });
    return response.data;
  },
};

