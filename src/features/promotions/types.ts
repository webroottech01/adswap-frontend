export type PromotionStatus = 'draft' | 'published' | 'paused';
export type PromotionCategory = 'cross' | 'paid';

export type CrossPromotionType =
  | 'coupon_exchange'
  | 'poster_placement'
  | 'social_media_shoutout'
  | 'event_tieup'
  | 'lead_exchange'
  | 'product_placement';

export type PaidPlacementType =
  | 'counter_display'
  | 'standee'
  | 'table_tent'
  | 'billing_counter'
  | 'whatsapp_blast'
  | 'instagram_post'
  | 'screen_display'
  | 'event_stall';

export type PaidDurationUnit = 'day' | 'week' | 'month' | 'event';

export interface CrossAvailableDuration {
  start_date?: string;
  end_date?: string;
  notes?: string;
}

export interface CrossPromotionDetails {
  promotion_type?: CrossPromotionType;
  what_i_can_offer?: string;
  what_i_expect_in_return?: string;
  target_partner_category?: string;
  target_location?: string;
  available_duration?: CrossAvailableDuration;
  terms_and_conditions?: string;
  notes?: string;
}

export interface PaidPrice {
  amount?: number;
  is_custom_quote?: boolean;
}

export interface PaidDuration {
  unit?: PaidDurationUnit;
  value?: number;
}

export interface PaidPromotionDetails {
  placement_type?: PaidPlacementType;
  price?: PaidPrice;
  duration?: PaidDuration;
  available_slots?: string;
  expected_reach?: string;
  approval_required?: boolean;
  refund_cancellation_terms?: string;
}

export interface PromotionMedia {
  id: number;
  promotion_id: number;
  file_path: string;
  file_url: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  sort_order: number;
}

export interface Promotion {
  id: number;
  business_id: number;
  category: PromotionCategory;
  title: string;
  description: string | null;
  details: CrossPromotionDetails | PaidPromotionDetails;
  status: PromotionStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  media: PromotionMedia[];
}

export type CreatePromotionPayload =
  | { category: 'cross'; title: string; details: CrossPromotionDetails }
  | { category: 'paid'; title: string; details: PaidPromotionDetails };

export interface UpdatePromotionPayload {
  title?: string;
  details?: CrossPromotionDetails | PaidPromotionDetails;
}

export type PromotionStatusFilter = PromotionStatus | 'all';

export interface PromotionFormData {
  title: string;
  details: CrossPromotionDetails | PaidPromotionDetails;
  files: File[];
}
