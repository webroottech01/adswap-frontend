'use client';

import Image from 'next/image';
import { Eye, Handshake, FileText, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Promotion } from '@/features/promotions/types';
import {
  crossTypeLabel,
  paidDurationLabel,
  paidPlacementLabel,
  promotionCategoryLabel,
} from '@/features/promotions/constants';
import { resolvePromotionMediaUrl } from '@/features/promotions/utils/mediaUrl';
import { PromotionValidityBar } from './PromotionValidityBar';
import type {
  CrossPromotionDetails,
  PaidPromotionDetails,
} from '@/features/promotions/types';

function isImageMedia(mime?: string): boolean {
  return Boolean(mime?.startsWith('image/'));
}

export interface MarketplacePromotionMiniCardProps {
  promotion: Promotion;
  businessName?: string;
  showHeadline?: boolean;
  showActions?: boolean;
  onView?: () => void;
  onCollaborate?: () => void;
  promotionSaved?: boolean;
  onToggleSavePromotion?: () => void;
  savePromotionLoading?: boolean;
  brandSaved?: boolean;
  onToggleSaveBrand?: () => void;
  saveBrandLoading?: boolean;
}

export function MarketplacePromotionMiniCard({
  promotion,
  businessName,
  showHeadline = true,
  showActions = true,
  onView,
  onCollaborate,
  promotionSaved = false,
  onToggleSavePromotion,
  savePromotionLoading = false,
  brandSaved = false,
  onToggleSaveBrand,
  saveBrandLoading = false,
}: MarketplacePromotionMiniCardProps) {
  const isPaid = promotion.category === 'paid';
  const thumb = promotion.media[0];
  const categoryBadgeClass = isPaid ? 'bg-warning text-dark' : 'bg-success';

  const chips: string[] = [];
  if (isPaid) {
    const d = promotion.details as PaidPromotionDetails;
    if (d.placement_type) chips.push(paidPlacementLabel(d.placement_type));
    if (d.price?.is_custom_quote) chips.push('Custom quote');
    else if (d.price?.amount != null) chips.push(`₹${d.price.amount}`);
    if (d.duration?.unit) chips.push(paidDurationLabel(d.duration.unit, d.duration.value));
  } else {
    const d = promotion.details as CrossPromotionDetails;
    if (d.promotion_type) chips.push(crossTypeLabel(d.promotion_type));
    const offer = d.what_i_can_offer?.trim();
    if (offer) {
      chips.push(offer.length > 40 ? `${offer.slice(0, 40)}…` : offer);
    }
  }

  return (
    <div className="border rounded p-2 mb-2 bg-light bg-opacity-50">
      <div className="d-flex gap-2">
        <div className="flex-shrink-0 rounded border overflow-hidden bg-white" style={{ width: 72, height: 72 }}>
          {thumb && isImageMedia(thumb.mime_type) ? (
            <Image
              src={resolvePromotionMediaUrl(thumb)}
              alt=""
              width={72}
              height={72}
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          ) : (
            <div className="w-100 h-100 d-flex align-items-center justify-content-center text-muted">
              <FileText size={24} />
            </div>
          )}
        </div>
        <div className="flex-grow-1 min-w-0">
          {showHeadline && (
            <div className="d-flex justify-content-between align-items-start gap-1 mb-1">
              <div className="min-w-0 flex-grow-1">
                <span
                  className="small fw-semibold text-truncate d-block"
                  title={businessName ? `${businessName} - ${promotion.title}` : promotion.title}
                >
                  {businessName ? `${businessName} - ${promotion.title}` : promotion.title}
                </span>
              </div>
              <span className={`badge ${categoryBadgeClass} flex-shrink-0`} style={{ fontSize: '0.65rem' }}>
                {promotionCategoryLabel(promotion.category)}
              </span>
            </div>
          )}
          {!showHeadline && (
            <div className="d-flex justify-content-end mb-1">
              <span className={`badge ${categoryBadgeClass} flex-shrink-0`} style={{ fontSize: '0.65rem' }}>
                {promotionCategoryLabel(promotion.category)}
              </span>
            </div>
          )}
          {chips.length > 0 && (
            <div className="d-flex flex-wrap gap-1">
              {chips.slice(0, 3).map((c) => (
                <span key={c} className="badge bg-white text-dark border fw-normal" style={{ fontSize: '0.65rem' }}>
                  {c}
                </span>
              ))}
            </div>
          )}
          <PromotionValidityBar promotion={promotion} />
        </div>
      </div>

      {showActions && (
        <div className="d-flex justify-content-end gap-1 mt-2 pt-2 border-top">
          {onView && (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm py-0 px-2"
              title="View business"
              aria-label="View business"
              onClick={onView}
            >
              <Eye size={16} />
            </button>
          )}
          {onCollaborate && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm py-0 px-2"
              title="Collaborate"
              aria-label="Collaborate"
              onClick={onCollaborate}
            >
              <Handshake size={16} />
            </button>
          )}
          {onToggleSavePromotion && (
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 ${promotionSaved ? 'btn-success' : 'btn-outline-secondary'}`}
              title={promotionSaved ? 'Saved promotion' : 'Save promotion'}
              aria-label={promotionSaved ? 'Saved promotion' : 'Save promotion'}
              onClick={onToggleSavePromotion}
              disabled={savePromotionLoading}
            >
              {promotionSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
          {onToggleSaveBrand && (
            <button
              type="button"
              className={`btn btn-sm py-0 px-2 ${brandSaved ? 'btn-success' : 'btn-outline-secondary'}`}
              title={brandSaved ? 'Saved brand' : 'Save brand'}
              aria-label={brandSaved ? 'Saved brand' : 'Save brand'}
              onClick={onToggleSaveBrand}
              disabled={saveBrandLoading}
            >
              {brandSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
