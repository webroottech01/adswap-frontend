'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';

interface Step2BusinessIdentityProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 2: Business Identity
 */
export function Step2BusinessIdentity({ form }: Step2BusinessIdentityProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const businessType = watch('businessType');
  const currentYear = new Date().getFullYear();

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Business Identity</h5>
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

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <label htmlFor="registrationNumber" className="form-label">
              Registration Number
            </label>
            <input
              id="registrationNumber"
              type="text"
              className={`form-control ${errors.registrationNumber ? 'is-invalid' : ''}`}
              placeholder="Enter registration number (optional)"
              {...register('registrationNumber')}
            />
            {errors.registrationNumber && (
              <div className="invalid-feedback">{errors.registrationNumber.message}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="foundedYear" className="form-label">
              Founded Year
            </label>
            <input
              id="foundedYear"
              type="number"
              className={`form-control ${errors.foundedYear ? 'is-invalid' : ''}`}
              placeholder="e.g., 2020"
              min={1800}
              max={currentYear}
              {...register('foundedYear', { valueAsNumber: true })}
            />
            {errors.foundedYear && (
              <div className="invalid-feedback">{errors.foundedYear.message}</div>
            )}
          </div>
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




