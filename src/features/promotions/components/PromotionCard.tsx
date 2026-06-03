'use client';

import { Pause, Pencil, Play, Trash2 } from 'lucide-react';
import {
  crossTypeLabel,
  paidDurationLabel,
  paidPlacementLabel,
} from '../constants';
import type { CrossPromotionDetails, PaidPromotionDetails, Promotion } from '../types';
import { resolvePromotionMediaUrl } from '../utils/mediaUrl';

interface PromotionCardProps {
  promotion: Promotion;
  actionLoading?: boolean;
  onEdit: (promotion: Promotion) => void;
  onPublish: (id: number) => void;
  onPause: (id: number) => void;
  onDelete: (id: number) => void;
}

function statusBadgeClass(status: Promotion['status']): string {
  switch (status) {
    case 'published':
      return 'bg-success';
    case 'paused':
      return 'bg-warning text-dark';
    default:
      return 'bg-secondary';
  }
}

function formatPrice(details: PaidPromotionDetails): string {
  const price = details.price;
  if (!price) return '—';
  if (price.is_custom_quote) return 'Custom quote';
  if (price.amount != null) return `₹${price.amount}`;
  return '—';
}

export function PromotionCard({
  promotion,
  actionLoading = false,
  onEdit,
  onPublish,
  onPause,
  onDelete,
}: PromotionCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete "${promotion.title}"? This cannot be undone.`)) {
      onDelete(promotion.id);
    }
  };

  const summary =
    promotion.category === 'paid' ? (
      <p className="text-muted small mb-3">
        <strong>{paidPlacementLabel((promotion.details as PaidPromotionDetails).placement_type)}</strong>
        {' · '}
        {formatPrice(promotion.details as PaidPromotionDetails)}
        {' · '}
        {paidDurationLabel(
          (promotion.details as PaidPromotionDetails).duration?.unit,
          (promotion.details as PaidPromotionDetails).duration?.value,
        )}
      </p>
    ) : (
      <p className="text-muted small mb-3">
        <strong>{crossTypeLabel((promotion.details as CrossPromotionDetails).promotion_type)}</strong>
        {(promotion.details as CrossPromotionDetails).target_partner_category && (
          <>
            {' · '}
            {(promotion.details as CrossPromotionDetails).target_partner_category}
          </>
        )}
        {promotion.description && (
          <>
            <br />
            <span className="fst-italic">{promotion.description}</span>
          </>
        )}
        {(promotion.details as CrossPromotionDetails).notes && !promotion.description && (
          <>
            <br />
            <span className="fst-italic">{(promotion.details as CrossPromotionDetails).notes}</span>
          </>
        )}
      </p>
    );

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
          <div>
            <h5 className="card-title mb-1">{promotion.title}</h5>
            <span className={`badge ${statusBadgeClass(promotion.status)} me-1`}>
              {promotion.status}
            </span>
            <span className="badge bg-light text-dark border">
              {promotion.category === 'paid' ? 'Paid' : 'Cross'}
            </span>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => onEdit(promotion)}
              disabled={actionLoading}
            >
              <Pencil size={14} className="me-1" />
              Edit
            </button>
            {(promotion.status === 'draft' || promotion.status === 'paused') && (
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => onPublish(promotion.id)}
                disabled={actionLoading}
                title={promotion.media.length === 0 ? 'Add media before publishing' : undefined}
              >
                <Play size={14} className="me-1" />
                Publish
              </button>
            )}
            {promotion.status === 'published' && (
              <button
                type="button"
                className="btn btn-sm btn-warning"
                onClick={() => onPause(promotion.id)}
                disabled={actionLoading}
              >
                <Pause size={14} className="me-1" />
                Pause
              </button>
            )}
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              <Trash2 size={14} className="me-1" />
              Delete
            </button>
          </div>
        </div>

        {summary}

        {promotion.media.length > 0 ? (
          <div className="row g-2">
            {promotion.media.map((media) => {
              const isImage = media.mime_type?.startsWith('image/');
              return (
                <div key={media.id} className="col-4 col-md-3 col-lg-2">
                  {isImage ? (
                    <img
                      src={resolvePromotionMediaUrl(media)}
                      alt={media.file_name}
                      className="img-fluid rounded border"
                      style={{ height: 72, width: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="border rounded bg-light d-flex align-items-center justify-content-center small text-muted px-1 text-center"
                      style={{ height: 72, fontSize: '0.65rem' }}
                    >
                      {media.file_name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-muted small mb-0">No media uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
