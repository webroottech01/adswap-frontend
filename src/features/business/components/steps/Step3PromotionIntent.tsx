'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData, PromotionIntent } from '../../types';
import { useBusinessCategories } from '../../hooks/useBusinessCategories';
import { PROMOTION_INTENT_OPTIONS } from '../../constants';
import { SearchableCategoryChecklist } from '../SearchableCategoryChecklist';

interface Step3PromotionIntentProps {
  form: UseFormReturn<BusinessFormData>;
}

export function Step3PromotionIntent({ form }: Step3PromotionIntentProps) {
  const { watch, setValue, formState: { errors } } = form;
  const { categories, loading } = useBusinessCategories();

  const providesAdServices = watch('providesAdServices');
  const isBuyer = watch('isBuyer');
  const promotionIntent = watch('promotionIntent');
  const supportedCategoryIds = watch('supportedCategoryIds') || [];

  const setRole = (provider: boolean, buyer: boolean) => {
    setValue('providesAdServices', provider, { shouldValidate: true });
    setValue('isBuyer', buyer, { shouldValidate: true });
    if (!provider) {
      setValue('promotionIntent', 'none');
      setValue('supportedCategoryIds', []);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Promotion Intent</h5>
      </div>
      <div className="card-body">
        <p className="text-muted small">Define your role on the platform.</p>

        <div className="mb-4">
          <label className="form-label">Do you offer promotion space?</label>
          <div className="d-flex gap-2">
            <button type="button" className={`btn btn-sm ${providesAdServices ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setRole(true, isBuyer)}>Yes</button>
            <button type="button" className={`btn btn-sm ${!providesAdServices ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setRole(false, isBuyer)}>No</button>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Do you buy promotion space?</label>
          <div className="d-flex gap-2">
            <button type="button" className={`btn btn-sm ${isBuyer ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setValue('isBuyer', true, { shouldValidate: true })}>Yes</button>
            <button type="button" className={`btn btn-sm ${!isBuyer ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setValue('isBuyer', false, { shouldValidate: true })}>No</button>
          </div>
        </div>

        {providesAdServices && (
          <>
            <div className="mb-4">
              <label className="form-label">Promotion models</label>
              <div className="d-flex flex-wrap gap-2">
                {PROMOTION_INTENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`btn btn-sm ${promotionIntent === opt.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setValue('promotionIntent', opt.value as PromotionIntent, { shouldValidate: true })}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <SearchableCategoryChecklist
              label="Business categories you support"
              categories={categories}
              value={supportedCategoryIds}
              onChange={(ids) => setValue('supportedCategoryIds', ids, { shouldValidate: true })}
              loading={loading}
              error={errors.supportedCategoryIds?.message}
            />
          </>
        )}
      </div>
    </div>
  );
}
