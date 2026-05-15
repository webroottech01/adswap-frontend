'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';

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

  const [targetAudienceInput, setTargetAudienceInput] = useState('');
  const [keyProductsInput, setKeyProductsInput] = useState('');
  const [geographicInput, setGeographicInput] = useState('');

  const targetAudience = watch('targetAudience') || [];
  const keyProductsServices = watch('keyProductsServices') || [];
  const geographicReach = watch('geographicReach') || [];

  const addTargetAudience = () => {
    if (targetAudienceInput.trim()) {
      setValue('targetAudience', [...targetAudience, targetAudienceInput.trim()]);
      setTargetAudienceInput('');
    }
  };

  const removeTargetAudience = (index: number) => {
    setValue('targetAudience', targetAudience.filter((_, i) => i !== index));
  };

  const addKeyProduct = () => {
    if (keyProductsInput.trim()) {
      setValue('keyProductsServices', [...keyProductsServices, keyProductsInput.trim()]);
      setKeyProductsInput('');
    }
  };

  const removeKeyProduct = (index: number) => {
    setValue('keyProductsServices', keyProductsServices.filter((_, i) => i !== index));
  };

  const addGeographic = () => {
    if (geographicInput.trim()) {
      setValue('geographicReach', [...geographicReach, geographicInput.trim()]);
      setGeographicInput('');
    }
  };

  const removeGeographic = (index: number) => {
    setValue('geographicReach', geographicReach.filter((_, i) => i !== index));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Business Profile Info</h5>
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
            <option value="0-1L">0 - 1 Lakh</option>
            <option value="1L-10L">1 Lakh - 10 Lakhs</option>
            <option value="10L-50L">10 Lakhs - 50 Lakhs</option>
            <option value="50L-1C">50 Lakhs - 1 Crore</option>
            <option value="1C+">1 Crore+</option>
          </select>
          {errors.annualRevenueRange && (
            <div className="invalid-feedback">{errors.annualRevenueRange.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="targetAudience" className="form-label">
            Target Audience
          </label>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add target audience"
              value={targetAudienceInput}
              onChange={(e) => setTargetAudienceInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetAudience())}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addTargetAudience}
            >
              Add
            </button>
          </div>
          {targetAudience.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {targetAudience.map((item, index) => (
                <span key={index} className="badge bg-primary d-flex align-items-center gap-1">
                  {item}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => removeTargetAudience(index)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

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

        <div className="mb-4">
          <label htmlFor="keyProductsServices" className="form-label">
            Key Products/Services
          </label>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add product or service"
              value={keyProductsInput}
              onChange={(e) => setKeyProductsInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyProduct())}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addKeyProduct}
            >
              Add
            </button>
          </div>
          {keyProductsServices.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {keyProductsServices.map((item, index) => (
                <span key={index} className="badge bg-secondary d-flex align-items-center gap-1">
                  {item}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => removeKeyProduct(index)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="geographicReach" className="form-label">
            Geographic Reach
          </label>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add location"
              value={geographicInput}
              onChange={(e) => setGeographicInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGeographic())}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addGeographic}
            >
              Add
            </button>
          </div>
          {geographicReach.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {geographicReach.map((item, index) => (
                <span key={index} className="badge bg-info d-flex align-items-center gap-1">
                  {item}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => removeGeographic(index)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

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




