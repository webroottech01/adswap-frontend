'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { TARGET_AUDIENCE_OPTIONS, REVENUE_SLABS } from '../../constants';
import { ChipMultiSelect } from '@/shared/forms/ChipMultiSelect';
import { TagInput } from '@/shared/forms/TagInput';

interface Step4BusinessProfileProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 4: Business Profile Info + Scale + Audience
 */
export function Step4BusinessProfile({ form }: Step4BusinessProfileProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const targetAudience = watch('targetAudience') || [];
  const keyProductsServices = watch('keyProductsServices') || [];
  const geographicReach = watch('geographicReach') || [];

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Business Profile</h5>
      </div>
      <div className="card-body">
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <label htmlFor="scale" className="form-label">
              Business Scale
            </label>
            <select
              id="scale"
              className={`form-select ${errors.scale ? 'is-invalid' : ''}`}
              {...register('scale')}
            >
              <option value="">Select scale</option>
              <option value="micro">Micro</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            {errors.scale && (
              <div className="invalid-feedback">{errors.scale.message}</div>
            )}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="employeeCount" className="form-label">
              Employee Count
            </label>
            <input
              id="employeeCount"
              type="number"
              className={`form-control ${errors.employeeCount ? 'is-invalid' : ''}`}
              placeholder="Number of employees"
              min={0}
              {...register('employeeCount', { valueAsNumber: true })}
            />
            {errors.employeeCount && (
              <div className="invalid-feedback">{errors.employeeCount.message}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="annualRevenueRange" className="form-label">
            Annual Revenue Range
          </label>
          <select
            id="annualRevenueRange"
            className={`form-select ${errors.annualRevenueRange ? 'is-invalid' : ''}`}
            {...register('annualRevenueRange')}
          >
            <option value="">Select range</option>
            {REVENUE_SLABS.map((slab) => (
              <option key={slab} value={slab}>{slab}</option>
            ))}
          </select>
          {errors.annualRevenueRange && (
            <div className="invalid-feedback">{errors.annualRevenueRange.message}</div>
          )}
        </div>

        <ChipMultiSelect
          label="Target Audience"
          options={TARGET_AUDIENCE_OPTIONS}
          value={targetAudience}
          onChange={(v) => setValue('targetAudience', v)}
        />

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <label htmlFor="industryExperienceYears" className="form-label">
              Industry Experience (Years)
            </label>
            <input
              id="industryExperienceYears"
              type="number"
              className={`form-control ${errors.industryExperienceYears ? 'is-invalid' : ''}`}
              placeholder="Years of experience"
              min={0}
              max={100}
              {...register('industryExperienceYears', { valueAsNumber: true })}
            />
            {errors.industryExperienceYears && (
              <div className="invalid-feedback">{errors.industryExperienceYears.message}</div>
            )}
          </div>
        </div>

        <TagInput
          label="Key Products / Services"
          value={keyProductsServices}
          onChange={(v) => setValue('keyProductsServices', v)}
        />

        <TagInput
          label="Geographic Reach"
          value={geographicReach}
          onChange={(v) => setValue('geographicReach', v)}
          placeholder="Add city or region"
        />

        <div className="mb-4">
          <label htmlFor="additionalInfo" className="form-label">
            Additional Information
          </label>
          <textarea
            id="additionalInfo"
            className={`form-control ${errors.additionalInfo ? 'is-invalid' : ''}`}
            rows={4}
            placeholder="Any additional information about your business (optional)"
            {...register('additionalInfo')}
          />
          {errors.additionalInfo && (
            <div className="invalid-feedback">{errors.additionalInfo.message}</div>
          )}
        </div>
      </div>
    </div>
  );
}




