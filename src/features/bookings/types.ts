export type ProviderType = 'paid' | 'cross';

export interface BookingServiceItem {
  id: number;
  name: string;
  slug: string;
  category_name?: string | null;
}

export interface BookingDeliverables {
  preferred_collaboration_types: string[];
  budget_range: string | null;
  collaboration_notes: string | null;
  services: BookingServiceItem[];
}

export interface BookingReview {
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  collaboration_id: number;
  partner_business_id: number;
  partner_business_name: string;
  accepted_at: string;
  conversation_id: number | null;
  provider_type: ProviderType;
  period_ends_at: string;
  days_remaining: number;
  schedule_progress_percent: number;
  deliverables: BookingDeliverables;
  my_review: BookingReview | null;
  can_submit_review: boolean;
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

export interface SubmitReviewPayload {
  rating: number;
  comment?: string;
}
