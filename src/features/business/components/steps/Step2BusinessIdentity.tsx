'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { BUSINESS_TYPE_OPTIONS } from '../../constants';
import { WordCountTextarea } from '@/shared/forms/WordCountTextarea';

interface Step2BusinessIdentityProps {
  form: UseFormReturn<BusinessFormData>;
}

export function Step2BusinessIdentity({ form }: Step2BusinessIdentityProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const businessType = watch('businessType');
  const description = watch('description') || '';
  const currentYear = new Date().getFullYear();

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Business Identity</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label className="form-label">Business Type <span className="text-danger">*</span></label>
          <div className="d-flex flex-wrap gap-2">
            {BUSINESS_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`btn btn-sm ${businessType === opt.value ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setValue('businessType', opt.value, { shouldValidate: true })}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <input type="hidden" {...register('businessType')} />
          {errors.businessType && <div className="text-danger small mt-1">{errors.businessType.message}</div>}
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">Registration Number</label>
            <input className="form-control" {...register('registrationNumber')} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Founded Year <span className="text-danger">*</span></label>
            <input
              type="number"
              className={`form-control ${errors.foundedYear ? 'is-invalid' : ''}`}
              min={1800}
              max={currentYear}
              {...register('foundedYear', { valueAsNumber: true })}
            />
            {errors.foundedYear && <div className="invalid-feedback">{errors.foundedYear.message}</div>}
          </div>
        </div>

        <WordCountTextarea
          label="Short Description"
          value={description}
          onChange={(v) => setValue('description', v, { shouldValidate: true })}
          helperText="Tell businesses who you are, what you offer and what makes your business unique."
          error={errors.description?.message}
        />
      </div>
    </div>
  );
}
