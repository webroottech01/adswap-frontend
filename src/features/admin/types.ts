/**
 * TypeScript types for Admin module
 */

export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface BusinessProfile {
  scale?: string;
  industry_experience_years?: number;
  key_products_services?: string[];
  geographic_reach?: string[];
  social_media_handles?: Record<string, string>;
  additional_info?: string;
}

export interface BusinessAsset {
  id: number;
  asset_type: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at?: string | null;
}

export interface BusinessDocument {
  id: number;
  document_type: string;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  status: string;
  uploaded_at?: string | null;
}

export interface Business {
  id: number;
  user_id: number | null;
  name: string;
  category: string;
  status: BusinessStatus;
  is_provider: boolean;
  is_buyer: boolean;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_path: string | null;
  service_ids: number[];
  business_type?: string;
  registration_number?: string;
  founded_year?: number;
  employee_count?: number;
  annual_revenue_range?: string;
  target_audience?: string[];
  collaboration_preferences?: Record<string, any> | null;
  profile?: BusinessProfile | null;
  assets?: BusinessAsset[];
  documents?: BusinessDocument[];
  created_at: string;
  updated_at: string;
}

export interface BusinessFormData {
  name: string;
  category: string;
  status: BusinessStatus;
  is_provider: boolean;
  is_buyer: boolean;
}

export interface BusinessFilters {
  search?: string;
  status?: BusinessStatus | 'all';
  is_provider?: boolean | 'all';
  is_buyer?: boolean | 'all';
}




