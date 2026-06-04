'use client';

import { PAID_DURATION_UNIT_OPTIONS } from '../constants';
import type { PaidPromotionDetails } from '../types';
import { SearchablePlacementTypeInput } from './SearchablePlacementTypeInput';

interface PaidPromotionFormFieldsProps {
  title: string;
  details: PaidPromotionDetails;
  loading?: boolean;
  onTitleChange: (title: string) => void;
  onDetailsChange: (details: PaidPromotionDetails) => void;
}

export function PaidPromotionFormFields({
  title,
  details,
  loading = false,
  onTitleChange,
  onDetailsChange,
}: PaidPromotionFormFieldsProps) {
  const price = details.price ?? { is_custom_quote: false };
  const duration = details.duration ?? { unit: 'week', value: 1 };

  const patch = (patchDetails: Partial<PaidPromotionDetails>) => {
    onDetailsChange({ ...details, ...patchDetails });
  };

  return (
    <>
      <div className="mb-3">
        <label htmlFor="packageName" className="form-label">
          Package name <span className="text-danger">*</span>
        </label>
        <input
          id="packageName"
          type="text"
          className="form-control"
          placeholder='e.g. "Counter display — 2 weeks"'
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          maxLength={255}
          disabled={loading}
        />
      </div>

      <SearchablePlacementTypeInput
        value={details.placement_type ?? ''}
        onChange={(placement_type) => patch({ placement_type })}
        disabled={loading}
      />

      <fieldset className="mb-3 border rounded p-3">
        <legend className="form-label fs-6 mb-2">Price</legend>
        <div className="form-check mb-2">
          <input
            id="isCustomQuote"
            type="checkbox"
            className="form-check-input"
            checked={Boolean(price.is_custom_quote)}
            onChange={(e) =>
              patch({
                price: {
                  ...price,
                  is_custom_quote: e.target.checked,
                  amount: e.target.checked ? undefined : price.amount,
                },
              })
            }
            disabled={loading}
          />
          <label htmlFor="isCustomQuote" className="form-check-label">
            Custom quote (price on request)
          </label>
        </div>
        {!price.is_custom_quote && (
          <div>
            <label htmlFor="priceAmount" className="form-label">
              Amount (₹) <span className="text-danger">*</span>
            </label>
            <input
              id="priceAmount"
              type="number"
              className="form-control"
              min={0}
              step="0.01"
              value={price.amount ?? ''}
              onChange={(e) =>
                patch({
                  price: {
                    ...price,
                    amount: e.target.value === '' ? undefined : Number(e.target.value),
                  },
                })
              }
              required={!price.is_custom_quote}
              disabled={loading}
            />
          </div>
        )}
      </fieldset>

      <fieldset className="mb-3 border rounded p-3">
        <legend className="form-label fs-6 mb-2">Duration</legend>
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <label htmlFor="durationUnit" className="form-label">
              Unit <span className="text-danger">*</span>
            </label>
            <select
              id="durationUnit"
              className="form-select"
              value={duration.unit ?? 'week'}
              onChange={(e) =>
                patch({
                  duration: {
                    ...duration,
                    unit: e.target.value as NonNullable<typeof duration.unit>,
                  },
                })
              }
              required
              disabled={loading}
            >
              {PAID_DURATION_UNIT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {duration.unit !== 'event' && (
            <div className="col-md-6">
              <label htmlFor="durationValue" className="form-label">
                Value
              </label>
              <input
                id="durationValue"
                type="number"
                className="form-control"
                min={1}
                value={duration.value ?? ''}
                onChange={(e) =>
                  patch({
                    duration: {
                      ...duration,
                      value: e.target.value === '' ? undefined : Number(e.target.value),
                    },
                  })
                }
                disabled={loading}
              />
            </div>
          )}
        </div>
      </fieldset>

      <div className="mb-3">
        <label htmlFor="availableSlots" className="form-label">
          Available slots <span className="text-danger">*</span>
        </label>
        <input
          id="availableSlots"
          type="text"
          className="form-control"
          placeholder='e.g. "3 slots per month"'
          value={details.available_slots ?? ''}
          onChange={(e) => patch({ available_slots: e.target.value })}
          required
          disabled={loading}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="expectedReach" className="form-label">
          Expected reach
        </label>
        <input
          id="expectedReach"
          type="text"
          className="form-control"
          placeholder="e.g. 500 footfalls/day"
          value={details.expected_reach ?? ''}
          onChange={(e) => patch({ expected_reach: e.target.value })}
          disabled={loading}
        />
      </div>

      <div className="form-check mb-3">
        <input
          id="approvalRequired"
          type="checkbox"
          className="form-check-input"
          checked={Boolean(details.approval_required)}
          onChange={(e) => patch({ approval_required: e.target.checked })}
          disabled={loading}
        />
        <label htmlFor="approvalRequired" className="form-check-label">
          Approval required before booking
        </label>
      </div>

      <div className="mb-3">
        <label htmlFor="refundTerms" className="form-label">
          Refund / cancellation terms
        </label>
        <textarea
          id="refundTerms"
          className="form-control"
          rows={3}
          value={details.refund_cancellation_terms ?? ''}
          onChange={(e) => patch({ refund_cancellation_terms: e.target.value })}
          disabled={loading}
        />
      </div>
    </>
  );
}
