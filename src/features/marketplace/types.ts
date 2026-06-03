import type { Promotion } from '@/features/promotions/types';

export interface MarketplaceBusinessSummary {
  id: number;
  name: string;
  category: string;
  logo_url: string | null;
  address: string | null;
  is_verified: boolean;
  average_rating: number | null;
}

export interface MarketplacePromotionDetail {
  business: MarketplaceBusinessSummary;
  promotion: Promotion;
}

export interface MarketplaceListing {
  id: number;
  name: string;
  category: string;
  logo_url: string | null;
  address: string | null;
  is_verified: boolean;
  average_rating: number | null;
  promotions: Promotion[];
}

export interface MarketplaceCollaborationTarget {
  businessId: number;
  businessName: string;
  promotion: Pick<Promotion, 'id' | 'category' | 'title'>;
}

export interface MarketplaceFilters {
  city?: string;
  category?: string;
  provider_type?: 'paid' | 'cross' | 'both';
  promotion_format?: string;
  brand_size?: 'micro' | 'small' | 'medium' | 'large';
  revenue_range?: string;
  page?: number;
  per_page?: number;
}

export interface MarketplaceFilterMetadata {
  categories: string[];
  cities: string[];
  revenue_ranges: string[];
}

export interface CollaborationContext {
  collaboration_id: number | null;
  conversation_id: number | null;
  status: string | null;
  can_message: boolean;
}

export interface SavedBrandCheck {
  saved: boolean;
}
