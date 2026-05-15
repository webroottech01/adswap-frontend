/**
 * TypeScript types for Admin module
 */

export type BusinessStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

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




