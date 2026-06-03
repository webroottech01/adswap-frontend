'use client';

import Image from 'next/image';
import { MapPin, Star, BadgeCheck, Building2 } from 'lucide-react';
import { Badge } from '@/ui/Badge';
import { resolveLogoUrl } from '@/features/business/utils/businessAssetUrl';
import type { MarketplaceBusinessSummary } from '../types';

interface MarketplaceBusinessSummaryHeaderProps {
  business: MarketplaceBusinessSummary;
  promotionTitle?: string;
}

export function MarketplaceBusinessSummaryHeader({
  business,
  promotionTitle,
}: MarketplaceBusinessSummaryHeaderProps) {
  const logoUrl = resolveLogoUrl({ logo_url: business.logo_url });
  const headline = promotionTitle
    ? `${business.name} - ${promotionTitle}`
    : business.name;

  return (
    <div className="d-flex align-items-start gap-2 mb-3 pb-2 border-bottom">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={business.name}
          width={40}
          height={40}
          className="rounded border flex-shrink-0"
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      ) : (
        <div
          className="rounded border bg-light d-flex align-items-center justify-content-center text-primary flex-shrink-0"
          style={{ width: 40, height: 40 }}
        >
          <Building2 size={20} />
        </div>
      )}
      <div className="flex-grow-1 min-w-0">
        <div className="d-flex flex-wrap align-items-center gap-1 mb-1">
          <span className="small fw-semibold text-truncate" title={headline}>
            {headline}
          </span>
          {business.is_verified && (
            <BadgeCheck size={14} className="text-success flex-shrink-0" aria-label="Verified" />
          )}
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2 small text-muted">
          <Badge variant="secondary" className="py-0" style={{ fontSize: '0.65rem' }}>
            {business.category}
          </Badge>
          {business.address && (
            <span className="text-truncate d-inline-flex align-items-center gap-1">
              <MapPin size={12} />
              {business.address}
            </span>
          )}
          <span className="d-inline-flex align-items-center gap-1">
            <Star size={12} className="text-warning" />
            {business.average_rating != null ? business.average_rating : 'Not rated'}
          </span>
        </div>
      </div>
    </div>
  );
}
