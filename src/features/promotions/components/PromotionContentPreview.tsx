'use client';

import { MapPin, Tag } from 'lucide-react';
import {
  crossTypeLabel,
  paidDurationLabel,
  paidPlacementLabel,
  promotionCategoryLabel,
} from '../constants';
import type {
  CrossPromotionDetails,
  PaidPromotionDetails,
  Promotion,
} from '../types';
import { PromotionMediaGallery } from './PromotionMediaGallery';

function DetailChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="badge bg-white text-dark border me-1 mb-1 fw-normal">
      {children}
    </span>
  );
}

interface PromotionContentPreviewProps {
  promotion: Promotion;
  compact?: boolean;
  showTitle?: boolean;
}

export function PromotionContentPreview({
  promotion,
  compact = false,
  showTitle = true,
}: PromotionContentPreviewProps) {
  const isPaid = promotion.category === 'paid';
  const categoryBadgeClass = isPaid ? 'bg-warning text-dark' : 'bg-success';

  const detailChips: string[] = [];
  if (isPaid) {
    const d = promotion.details as PaidPromotionDetails;
    if (d.placement_type) detailChips.push(paidPlacementLabel(d.placement_type));
    if (d.price?.is_custom_quote) detailChips.push('Custom quote');
    else if (d.price?.amount != null) detailChips.push(`₹${d.price.amount}`);
    if (d.duration?.unit) detailChips.push(paidDurationLabel(d.duration.unit, d.duration.value));
  } else {
    const d = promotion.details as CrossPromotionDetails;
    if (d.promotion_type) detailChips.push(crossTypeLabel(d.promotion_type));
    if (d.what_i_can_offer?.trim()) detailChips.push('Includes offer details');
  }

  const crossDetails = !isPaid ? (promotion.details as CrossPromotionDetails) : null;
  const offerText = crossDetails?.what_i_can_offer?.trim();
  const description = promotion.description?.trim();

  return (
    <div className={`border rounded overflow-hidden bg-white ${compact ? '' : 'shadow-sm'}`}>
      <PromotionMediaGallery media={promotion.media ?? []} compact={compact} />
      <div className={compact ? 'p-2' : 'p-3'}>
        {showTitle && (
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <h6 className={`mb-0 lh-sm ${compact ? 'small' : ''}`}>{promotion.title}</h6>
            <span className={`badge ${categoryBadgeClass} flex-shrink-0`}>
              {promotionCategoryLabel(promotion.category)}
            </span>
          </div>
        )}

        {detailChips.length > 0 && (
          <div className="mb-2">
            {detailChips.map((chip) => (
              <DetailChip key={chip}>{chip}</DetailChip>
            ))}
          </div>
        )}

        {description && (
          <p className="text-muted small mb-2" style={{ lineHeight: 1.45 }}>
            {description}
          </p>
        )}

        {offerText && (
          <p className="small mb-2">
            <strong className="text-muted">What they offer:</strong>{' '}
            {offerText}
          </p>
        )}

        {!isPaid && crossDetails?.target_location && (
          <p className="text-muted small mb-0 d-flex align-items-center gap-1">
            <MapPin size={14} className="flex-shrink-0" />
            {crossDetails.target_location}
          </p>
        )}

        {isPaid && (promotion.details as PaidPromotionDetails).expected_reach && (
          <p className="text-muted small mb-0 d-flex align-items-center gap-1">
            <Tag size={14} className="flex-shrink-0" />
            {(promotion.details as PaidPromotionDetails).expected_reach}
          </p>
        )}
      </div>
    </div>
  );
}
