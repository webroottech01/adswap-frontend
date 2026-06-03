export type PromotionStatus = 'draft' | 'published' | 'paused';

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
  title: string;
  description: string | null;
  status: PromotionStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  media: PromotionMedia[];
}

export interface CreatePromotionPayload {
  title: string;
  description?: string;
}

export interface UpdatePromotionPayload {
  title?: string;
  description?: string;
}

export type PromotionStatusFilter = PromotionStatus | 'all';
