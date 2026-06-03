'use client';

import { useEffect, useState } from 'react';
import { CrossPromotionFormFields } from './CrossPromotionFormFields';
import { PaidPromotionFormFields } from './PaidPromotionFormFields';
import { PromotionMediaSection } from './PromotionMediaSection';
import { PendingFile } from './FileDropzone';
import type {
  CrossPromotionDetails,
  PaidPromotionDetails,
  Promotion,
  PromotionCategory,
  PromotionFormData,
} from '../types';
import {
  defaultDetailsForCategory,
  detailsFromPromotion,
} from '../utils/formDefaults';
import { slugifyPromotionTitle } from '../utils/slugify';

interface PromotionFormModalProps {
  show: boolean;
  category: PromotionCategory;
  promotion?: Promotion | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: PromotionFormData) => void | Promise<void>;
  onDeleteMedia?: (mediaId: number) => void | Promise<void>;
  deletingMediaId?: number | null;
}

function isCrossValid(title: string, details: CrossPromotionDetails): boolean {
  return (
    title.trim().length > 0 &&
    Boolean(details.promotion_type) &&
    Boolean(details.what_i_can_offer?.trim()) &&
    Boolean(details.what_i_expect_in_return?.trim()) &&
    Boolean(details.target_partner_category?.trim()) &&
    Boolean(details.target_location?.trim())
  );
}

function isPaidValid(title: string, details: PaidPromotionDetails): boolean {
  const price = details.price ?? {};
  const priceOk = price.is_custom_quote || (price.amount != null && price.amount >= 0);
  return (
    title.trim().length > 0 &&
    Boolean(details.placement_type) &&
    Boolean(details.available_slots?.trim()) &&
    Boolean(details.duration?.unit) &&
    priceOk
  );
}

export function PromotionFormModal({
  show,
  category,
  promotion,
  loading = false,
  onClose,
  onSubmit,
  onDeleteMedia,
  deletingMediaId = null,
}: PromotionFormModalProps) {
  const [title, setTitle] = useState('');
  const [crossDetails, setCrossDetails] = useState<CrossPromotionDetails>(
    defaultDetailsForCategory('cross') as CrossPromotionDetails,
  );
  const [paidDetails, setPaidDetails] = useState<PaidPromotionDetails>(
    defaultDetailsForCategory('paid') as PaidPromotionDetails,
  );
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);

  const effectiveCategory = promotion?.category ?? category;
  const isEdit = Boolean(promotion);

  useEffect(() => {
    if (show) {
      setTitle(promotion?.title ?? '');
      if (effectiveCategory === 'paid') {
        setPaidDetails(detailsFromPromotion(promotion) as PaidPromotionDetails);
      } else {
        setCrossDetails(detailsFromPromotion(promotion) as CrossPromotionDetails);
      }
      setPendingFiles([]);
    }
  }, [show, promotion, effectiveCategory]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveCategory === 'paid') {
      if (!isPaidValid(title, paidDetails)) return;
      onSubmit({
        title: title.trim(),
        details: {
          ...paidDetails,
          price: {
            is_custom_quote: Boolean(paidDetails.price?.is_custom_quote),
            amount: paidDetails.price?.is_custom_quote
              ? undefined
              : paidDetails.price?.amount,
          },
          approval_required: Boolean(paidDetails.approval_required),
        },
        files: pendingFiles.map((p) => p.file),
      });
    } else {
      if (!isCrossValid(title, crossDetails)) return;
      onSubmit({
        title: title.trim(),
        details: crossDetails,
        files: pendingFiles.map((p) => p.file),
      });
    }
  };

  const canSubmit =
    effectiveCategory === 'paid'
      ? isPaidValid(title, paidDetails)
      : isCrossValid(title, crossDetails);

  const slugPreview = !isEdit && title.trim() ? slugifyPromotionTitle(title) : null;

  const modalTitle = isEdit
    ? effectiveCategory === 'paid'
      ? 'Edit paid package'
      : 'Edit cross promotion'
    : effectiveCategory === 'paid'
      ? 'Create paid package'
      : 'Create cross promotion';

  return (
    <>
      <div className="modal fade show d-block" tabIndex={-1} role="dialog">
        <div className="modal-dialog modal-lg modal-dialog-scrollable my-3">
          <div
            className="modal-content d-flex flex-column"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          >
            <form
              onSubmit={handleSubmit}
              className="d-flex flex-column flex-grow-1"
              style={{ minHeight: 0 }}
            >
              <div className="modal-header flex-shrink-0">
                <h5 className="modal-title">{modalTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  disabled={loading}
                  aria-label="Close"
                />
              </div>
              <div
                className="modal-body overflow-auto flex-grow-1"
                style={{ maxHeight: 'calc(100vh - 12rem)' }}
              >
                {slugPreview && (
                  <p className="small text-muted mb-3">
                    URL slug: <code className="text-body">{slugPreview}</code>
                    <span className="d-block mt-1">
                      Assigned when you save; may include a number if this slug is already in use.
                    </span>
                  </p>
                )}

                {effectiveCategory === 'paid' ? (
                  <PaidPromotionFormFields
                    title={title}
                    details={paidDetails}
                    loading={loading}
                    onTitleChange={setTitle}
                    onDetailsChange={setPaidDetails}
                  />
                ) : (
                  <CrossPromotionFormFields
                    title={title}
                    details={crossDetails}
                    loading={loading}
                    onTitleChange={setTitle}
                    onDetailsChange={setCrossDetails}
                  />
                )}

                <hr className="my-4" />

                <PromotionMediaSection
                  promotion={promotion}
                  pendingFiles={pendingFiles}
                  onPendingFilesChange={setPendingFiles}
                  loading={loading}
                  onDeleteMedia={onDeleteMedia}
                  deletingMediaId={deletingMediaId}
                />
              </div>
              <div className="modal-footer flex-shrink-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading || !canSubmit}>
                  {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}
