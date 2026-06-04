'use client';

import { useRouter } from 'next/navigation';
import { BookmarkX } from 'lucide-react';
import type { SavedPromotionItem } from '../types';
import type { MarketplaceCollaborationTarget } from '@/features/marketplace/types';
import { MarketplaceCard } from '@/features/marketplace/components/MarketplaceCard';
import { MarketplaceSkeleton } from '@/features/marketplace/components/MarketplaceSkeleton';
import { ConnectionsEmptyState } from './ConnectionsEmptyState';
import { Button } from '@/ui/Button';
import type { MarketplaceListing } from '@/features/marketplace/types';

interface SavedPromotionsListProps {
  items: SavedPromotionItem[];
  loading: boolean;
  unsavingId: number | null;
  isAuthenticated?: boolean;
  myBusinessId?: number | null;
  onUnsave: (promotionId: number) => void;
  onCollaborateClick?: (target: MarketplaceCollaborationTarget) => void;
}

function toListing(item: SavedPromotionItem): MarketplaceListing {
  const { business, promotion } = item;
  return {
    id: business.id,
    name: business.name,
    category: business.category,
    logo_url: business.logo_url,
    address: business.address,
    is_verified: business.is_verified,
    average_rating: business.average_rating,
    promotions: [promotion],
  };
}

export function SavedPromotionsList({
  items,
  loading,
  unsavingId,
  isAuthenticated,
  myBusinessId,
  onUnsave,
  onCollaborateClick,
}: SavedPromotionsListProps) {
  const router = useRouter();

  if (loading && items.length === 0) {
    return (
      <div className="row g-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-12 col-lg-6">
            <MarketplaceSkeleton />
          </div>
        ))}
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <ConnectionsEmptyState
        title="No saved promotions yet"
        description="Save specific promotions from the marketplace to track opportunities you care about."
      />
    );
  }

  return (
    <div className="row g-4">
      {items.map((item) => {
        const listing = toListing(item);
        const { promotion, business } = item;
        return (
          <div key={promotion.id} className="col-12 col-lg-6">
            <div className="d-flex flex-column gap-2">
              <MarketplaceCard
                listing={listing}
                promotion={promotion}
                isAuthenticated={isAuthenticated}
                myBusinessId={myBusinessId}
                onCollaborateClick={onCollaborateClick}
              />
              <div className="d-flex justify-content-end gap-2 px-1">
                <Button
                  variant="secondary"
                  outline
                  size="sm"
                  onClick={() => onUnsave(promotion.id)}
                  loading={unsavingId === promotion.id}
                  icon={BookmarkX}
                >
                  Remove from saved
                </Button>
                <Button
                  variant="secondary"
                  outline
                  size="sm"
                  onClick={() => {
                    if (promotion.slug) {
                      router.push(`/marketplace/business/${business.id}/${promotion.slug}`);
                    }
                  }}
                >
                  View promotion
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
