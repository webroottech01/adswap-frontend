'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';

interface Step2BusinessTypeProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 2: Business Type & Description
 */
export function Step2BusinessType({ form }: Step2BusinessTypeProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const businessType = watch('businessType');

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Business Type & Description</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label className="form-label">
            Business Type <span className="text-danger">*</span>
          </label>
          <div className="d-flex flex-column gap-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="businessType-individual"
                value="individual"
                {...register('businessType')}
                checked={businessType === 'individual'}
              />
              <label className="form-check-label" htmlFor="businessType-individual">
                Individual
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="businessType-partnership"
                value="partnership"
                {...register('businessType')}
                checked={businessType === 'partnership'}
              />
              <label className="form-check-label" htmlFor="businessType-partnership">
                Partnership
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                id="businessType-company"
                value="company"
                {...register('businessType')}
                checked={businessType === 'company'}
              />
              <label className="form-check-label" htmlFor="businessType-company">
                Company
              </label>
            </div>
          </div>
          {errors.businessType && (
            <div className="text-danger small mt-1">{errors.businessType.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            rows={5}
            placeholder="Tell us about your business (optional)"
            {...register('description')}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description.message}</div>
          )}
        </div>
      </div>
    </div>
  );
}









