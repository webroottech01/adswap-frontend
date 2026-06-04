'use client';

import { CROSS_PROMOTION_TYPE_OPTIONS } from '../constants';
import type { CrossPromotionDetails } from '../types';
import { SearchableCategoryChecklist } from '@/features/business/components/SearchableCategoryChecklist';
import { useBusinessCategories } from '@/features/business/hooks/useBusinessCategories';
import { LOCATION_RADIUS_OPTIONS } from '@/shared/constants/collaborationPreferences';

interface CrossPromotionFormFieldsProps {
  title: string;
  details: CrossPromotionDetails;
  loading?: boolean;
  onTitleChange: (title: string) => void;
  onDetailsChange: (details: CrossPromotionDetails) => void;
}

export function CrossPromotionFormFields({
  title,
  details,
  loading = false,
  onTitleChange,
  onDetailsChange,
}: CrossPromotionFormFieldsProps) {
  const { categories, loading: categoriesLoading } = useBusinessCategories();
  const duration = details.available_duration ?? {};
  const partnerIds = details.target_partner_category_ids ?? [];
  const legacyCategoryText =
    !partnerIds.length && details.target_partner_category?.trim()
      ? details.target_partner_category.trim()
      : null;

  const patch = (patchDetails: Partial<CrossPromotionDetails>) => {
    onDetailsChange({ ...details, ...patchDetails });
  };

  const patchDuration = (patchDuration: Partial<typeof duration>) => {
    onDetailsChange({
      ...details,
      available_duration: { ...duration, ...patchDuration },
    });
  };

  return (
    <>
      <div className="mb-3">
        <label htmlFor="crossPromotionTitle" className="form-label">
          Promotion title <span className="text-danger">*</span>
        </label>
        <input
          id="crossPromotionTitle"
          type="text"
          className="form-control"
          placeholder='e.g. "Place your coupons at my salon reception"'
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          maxLength={255}
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="promotionType" className="form-label">
          Promotion type <span className="text-danger">*</span>
        </label>
        <select
          id="promotionType"
          className="form-select"
          value={details.promotion_type ?? 'coupon_exchange'}
          onChange={(e) =>
            patch({ promotion_type: e.target.value as CrossPromotionDetails['promotion_type'] })
          }
          required
          disabled={loading}
        >
          {CROSS_PROMOTION_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="whatICanOffer" className="form-label">
          What I can offer <span className="text-danger">*</span>
        </label>
        <textarea
          id="whatICanOffer"
          className="form-control"
          rows={3}
          value={details.what_i_can_offer ?? ''}
          onChange={(e) => patch({ what_i_can_offer: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="whatIExpect" className="form-label">
          What I expect in return <span className="text-danger">*</span>
        </label>
        <textarea
          id="whatIExpect"
          className="form-control"
          rows={3}
          value={details.what_i_expect_in_return ?? ''}
          onChange={(e) => patch({ what_i_expect_in_return: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <SearchableCategoryChecklist
        label="Target partner category *"
        categories={categories}
        value={partnerIds}
        onChange={(ids) => patch({ target_partner_category_ids: ids })}
        loading={categoriesLoading || loading}
      />

      {legacyCategoryText && (
        <p className="small text-muted mb-3">
          Previously entered: <em>{legacyCategoryText}</em>. Select categories above to update.
        </p>
      )}

      <div className="mb-3">
        <label htmlFor="targetLocation" className="form-label">
          Target location <span className="text-danger">*</span>
        </label>
        <select
          id="targetLocation"
          className="form-select"
          value={details.target_location ?? ''}
          onChange={(e) => patch({ target_location: e.target.value })}
          required
          disabled={loading}
        >
          <option value="">Select radius</option>
          {LOCATION_RADIUS_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="mb-3">
        <legend className="form-label fs-6 mb-2">Available duration</legend>
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <label htmlFor="startDate" className="form-label small">
              Start date
            </label>
            <input
              id="startDate"
              type="date"
              className="form-control"
              value={duration.start_date ?? ''}
              onChange={(e) => patchDuration({ start_date: e.target.value || undefined })}
              disabled={loading}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="endDate" className="form-label small">
              End date
            </label>
            <input
              id="endDate"
              type="date"
              className="form-control"
              value={duration.end_date ?? ''}
              onChange={(e) => patchDuration({ end_date: e.target.value || undefined })}
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-2">
          <label htmlFor="durationNotes" className="form-label small">
            Duration notes
          </label>
          <input
            id="durationNotes"
            type="text"
            className="form-control"
            placeholder="e.g. Ongoing until filled"
            value={duration.notes ?? ''}
            onChange={(e) => patchDuration({ notes: e.target.value || undefined })}
            disabled={loading}
          />
        </div>
      </fieldset>

      <div className="mb-3">
        <label htmlFor="termsAndConditions" className="form-label">
          Terms and conditions
        </label>
        <textarea
          id="termsAndConditions"
          className="form-control"
          rows={3}
          value={details.terms_and_conditions ?? ''}
          onChange={(e) => patch({ terms_and_conditions: e.target.value })}
          disabled={loading}
        />
      </div>
    </>
  );
}
