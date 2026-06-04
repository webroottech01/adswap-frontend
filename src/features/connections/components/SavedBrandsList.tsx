'use client';

import { useRouter } from 'next/navigation';
import { BookmarkX } from 'lucide-react';
import type { MarketplaceListing, MarketplaceCollaborationTarget } from '@/features/marketplace/types';
import { MarketplaceCard } from '@/features/marketplace/components/MarketplaceCard';
import { MarketplaceSkeleton } from '@/features/marketplace/components/MarketplaceSkeleton';
import { ConnectionsEmptyState } from './ConnectionsEmptyState';
import { Button } from '@/ui/Button';

interface SavedBrandsListProps {
  listings: MarketplaceListing[];
  loading: boolean;
  unsavingId: number | null;
  isAuthenticated?: boolean;
  myBusinessId?: number | null;
  onUnsave: (businessId: number) => void;
  onCollaborateClick?: (target: MarketplaceCollaborationTarget) => void;
}

export function SavedBrandsList({
  listings,
  loading,
  unsavingId,
  isAuthenticated,
  myBusinessId,
  onUnsave,
  onCollaborateClick,
}: SavedBrandsListProps) {
  const router = useRouter();

  if (loading && listings.length === 0) {
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

  if (!loading && listings.length === 0) {
    return (
      <ConnectionsEmptyState
        title="No saved brands yet"
        description="Save brands from the marketplace to build your shortlist and collaborate later."
      />
    );
  }

  return (
    <div className="row g-4">
      {listings.flatMap((listing) =>
        (listing.promotions?.length ? listing.promotions : []).map((promotion) => (
          <div key={`${listing.id}-${promotion.id}`} className="col-12 col-lg-6">
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
                  onClick={() => onUnsave(listing.id)}
                  loading={unsavingId === listing.id}
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
                      router.push(`/marketplace/business/${listing.id}/${promotion.slug}`);
                    }
                  }}
                >
                  View profile
                </Button>
              </div>
            </div>
          </div>
        )),
      )}
    </div>
  );
}
