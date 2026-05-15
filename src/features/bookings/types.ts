export type ProviderType = 'paid' | 'cross';

export interface Booking {
  id: number;
  collaboration_id: number;
  partner_business_id: number;
  partner_business_name: string;
  accepted_at: string;
  conversation_id: number | null;
  provider_type: ProviderType;
}

export interface BookingFilters {
  page?: number;
  per_page?: number;
  from?: string;
  to?: string;
  business_id?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

