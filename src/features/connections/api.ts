import { marketplaceApi } from '@/features/marketplace/api';
import type { MarketplaceListing } from '@/features/marketplace/types';
import type { SavedPromotionItem } from './types';

export const connectionsApi = {
  getSavedBrands(): Promise<MarketplaceListing[]> {
    return marketplaceApi.getSavedBrands();
  },

  unsaveBrand(businessId: number): Promise<void> {
    return marketplaceApi.unsaveBrand(businessId);
  },

  getSavedPromotions(): Promise<SavedPromotionItem[]> {
    return marketplaceApi.getSavedPromotions();
  },

  unsavePromotion(promotionId: number): Promise<void> {
    return marketplaceApi.unsavePromotion(promotionId);
  },
};
