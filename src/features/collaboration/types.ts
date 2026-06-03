import type { Promotion } from '@/features/promotions/types';

export interface CollaborationRequest {
  id: number;
  sender_business_id: number;
  receiver_business_id: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  sender_business_name?: string | null;
  receiver_business_name?: string | null;
  conversation_id?: number | null;
  marked_negotiating?: boolean;
  target_promotion_id?: number | null;
  sender_promotion_id?: number | null;
  promotion_category?: 'cross' | 'paid' | null;
  sender_offer?: string | null;
  offered_price?: number | null;
  offered_price_is_custom?: boolean | null;
  sender_promotion?: Promotion | null;
  target_promotion?: Promotion | null;
}

export type CollaborationStatusFilter = 'all' | 'pending' | 'accepted' | 'rejected' | 'negotiate';

export interface SendCollaborationPayload {
  receiverBusinessId: number;
  targetPromotionId: number;
  senderPromotionId?: number;
  message?: string;
  offeredPrice?: number;
  offeredPriceIsCustom?: boolean;
}
