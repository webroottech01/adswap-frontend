'use client';

import { useRouter } from 'next/navigation';
import { MarketplaceListing, MarketplaceCollaborationTarget } from '../types';
import { Card } from '@/ui/Card';
import { MarketplaceBusinessSummaryHeader } from './MarketplaceBusinessSummaryHeader';
import { MarketplacePromotionMiniCard } from './MarketplacePromotionMiniCard';
import type { Promotion } from '@/features/promotions/types';

interface MarketplaceCardProps {
  listing: MarketplaceListing;
  promotion: Promotion;
  isAuthenticated?: boolean;
  myBusinessId?: number | null;
  onCollaborateClick?: (target: MarketplaceCollaborationTarget) => void;
}

export function MarketplaceCard({
  listing,
  promotion,
  isAuthenticated,
  myBusinessId,
  onCollaborateClick,
}: MarketplaceCardProps) {
  const router = useRouter();
  const isOwnListing = myBusinessId != null && myBusinessId === listing.id;
  const showActions = !isOwnListing;

  const handleView = () => {
    if (promotion.slug) {
      router.push(`/marketplace/business/${listing.id}/${promotion.slug}`);
    } else {
      router.push('/marketplace');
    }
  };

  const handleCollaborate = () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent('/marketplace')}`);
      return;
    }
    onCollaborateClick?.({
      businessId: listing.id,
      businessName: listing.name,
      promotion: {
        id: promotion.id,
        category: promotion.category,
        title: promotion.title,
      },
    });
  };

  return (
    <Card className="h-100">
      <div className="card-body d-flex flex-column">
        <MarketplaceBusinessSummaryHeader
          business={{
            id: listing.id,
            name: listing.name,
            category: listing.category,
            logo_url: listing.logo_url,
            address: listing.address,
            is_verified: listing.is_verified,
            average_rating: listing.average_rating,
          }}
          promotionTitle={promotion.title}
        />

        <MarketplacePromotionMiniCard
          promotion={promotion}
          businessName={listing.name}
          showHeadline={false}
          showActions={showActions}
          onView={handleView}
          onCollaborate={showActions && onCollaborateClick ? handleCollaborate : undefined}
        />
      </div>
    </Card>
  );
}
