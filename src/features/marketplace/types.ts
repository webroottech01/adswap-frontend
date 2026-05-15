/**
 * TypeScript types for Marketplace module
 */

/**
 * Marketplace Listing Interface
 */
export interface MarketplaceListing {
  id: number;
  name: string;
  category: string;
  description: string | null;
  address: string | null;
  logo_path: string | null;
  brand_size: string | null;
  annual_revenue_range: string | null;
  services: string[];
  created_at: string;
}

/**
 * Marketplace Filters Interface
 */
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

/**
 * Filter Metadata Interface
 */
export interface MarketplaceFilterMetadata {
  categories: string[];
  cities: string[];
  revenue_ranges: string[];
}




