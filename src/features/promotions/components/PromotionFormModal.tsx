'use client';

import { useEffect, useRef, useState } from 'react';
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
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { categoryLabelsFromIds } from '../utils/categoryLabels';
import { formatFieldErrors } from '../api';

interface PromotionFormModalProps {
  show: boolean;
  category: PromotionCategory;
  promotion?: Promotion | null;
  loading?: boolean;
  submitError?: string | null;
  fieldErrors?: Record<string, string[]>;
  onClose: () => void;
  onSubmit: (data: PromotionFormData) => void | Promise<void>;
  onDeleteMedia?: (mediaId: number) => void | Promise<void>;
  deletingMediaId?: number | null;
}

function isCrossValid(title: string, details: CrossPromotionDetails): boolean {
  const hasCategories = (details.target_partner_category_ids?.length ?? 0) > 0;
  return (
    title.trim().length > 0 &&
    Boolean(details.promotion_type) &&
    Boolean(details.what_i_can_offer?.trim()) &&
    Boolean(details.what_i_expect_in_return?.trim()) &&
    hasCategories &&
    Boolean(details.target_location?.trim())
  );
}

function isPaidValid(title: string, details: PaidPromotionDetails): boolean {
  const price = details.price ?? {};
  const priceOk = price.is_custom_quote || (price.amount != null && price.amount >= 0);
  const placement = String(details.placement_type ?? '').trim();
  return (
    title.trim().length > 0 &&
    placement.length > 0 &&
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
  submitError = null,
  fieldErrors = {},
  onClose,
  onSubmit,
  onDeleteMedia,
  deletingMediaId = null,
}: PromotionFormModalProps) {
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const { categories } = useBusinessCategories();
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

  useEffect(() => {
    if (!show || (!submitError && Object.keys(fieldErrors).length === 0)) return;
    modalBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [show, submitError, fieldErrors]);

  if (!show) return null;

  const fieldErrorLines = formatFieldErrors(fieldErrors);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveCategory === 'paid') {
      if (!isPaidValid(title, paidDetails)) return;
      onSubmit({
        title: title.trim(),
        details: {
          ...paidDetails,
          placement_type: String(paidDetails.placement_type ?? '').trim(),
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
      const ids = crossDetails.target_partner_category_ids ?? [];
      onSubmit({
        title: title.trim(),
        details: {
          ...crossDetails,
          target_partner_category_ids: ids,
          target_partner_category: categoryLabelsFromIds(categories, ids),
        },
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
                ref={modalBodyRef}
                className="modal-body overflow-auto flex-grow-1"
                style={{ maxHeight: 'calc(100vh - 12rem)' }}
              >
                {(submitError || fieldErrorLines.length > 0) && (
                  <div className="alert alert-danger" role="alert">
                    {submitError && <p className="mb-0 fw-semibold">{submitError}</p>}
                    {fieldErrorLines.length > 0 && (
                      <ul className={`mb-0 small ${submitError ? 'mt-2' : ''}`}>
                        {fieldErrorLines.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

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
