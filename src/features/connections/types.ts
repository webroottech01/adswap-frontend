import type { MarketplaceListing, SavedPromotionItem } from '@/features/marketplace/types';

export type { MarketplaceListing, SavedPromotionItem };

export type PartnerRelationshipStatus =
  | 'saved'
  | 'request_sent'
  | 'request_received'
  | 'active'
  | 'rejected';

export type RelationshipFilter = 'all' | 'saved' | 'pending' | 'active';

export interface PartnerRelationship {
  businessId: number;
  businessName: string;
  category: string;
  logoUrl: string | null;
  isVerified: boolean;
  status: PartnerRelationshipStatus;
  conversationId: number | null;
  collaborationId: number | null;
  firstPromotionSlug: string | null;
}
