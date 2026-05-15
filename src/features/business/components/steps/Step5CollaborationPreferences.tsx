'use client';

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';

interface Step5CollaborationPreferencesProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Step 5: Collaboration Preferences
 */
export function Step5CollaborationPreferences({ form }: Step5CollaborationPreferencesProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const [preferredTypeInput, setPreferredTypeInput] = useState('');
  const preferredCollaborationTypes = watch('preferredCollaborationTypes') || [];

  const addPreferredType = () => {
    if (preferredTypeInput.trim()) {
      setValue('preferredCollaborationTypes', [...preferredCollaborationTypes, preferredTypeInput.trim()]);
      setPreferredTypeInput('');
    }
  };

  const removePreferredType = (index: number) => {
    setValue('preferredCollaborationTypes', preferredCollaborationTypes.filter((_, i) => i !== index));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Collaboration Preferences</h5>
      </div>
      <div className="card-body">
        <div className="mb-4">
          <label htmlFor="preferredCollaborationTypes" className="form-label">
            Preferred Collaboration Types
          </label>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Add collaboration type"
              value={preferredTypeInput}
              onChange={(e) => setPreferredTypeInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredType())}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={addPreferredType}
            >
              Add
            </button>
          </div>
          {preferredCollaborationTypes.length > 0 && (
            <div className="d-flex flex-wrap gap-2">
              {preferredCollaborationTypes.map((item, index) => (
                <span key={index} className="badge bg-success d-flex align-items-center gap-1">
                  {item}
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    style={{ fontSize: '0.7rem' }}
                    onClick={() => removePreferredType(index)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="budgetRange" className="form-label">
            Budget Range
          </label>
          <select
            id="budgetRange"
            className={`form-select ${errors.budgetRange ? 'is-invalid' : ''}`}
            {...register('budgetRange')}
          >
            <option value="">Select budget range</option>
            <option value="0-10K">0 - 10K</option>
            <option value="10K-50K">10K - 50K</option>
            <option value="50K-1L">50K - 1 Lakh</option>
            <option value="1L-5L">1 Lakh - 5 Lakhs</option>
            <option value="5L+">5 Lakhs+</option>
          </select>
          {errors.budgetRange && (
            <div className="invalid-feedback">{errors.budgetRange.message}</div>
          )}
        </div>

        <div>
          <label htmlFor="collaborationNotes" className="form-label">
            Collaboration Notes
          </label>
          <textarea
            id="collaborationNotes"
            className={`form-control ${errors.collaborationNotes ? 'is-invalid' : ''}`}
            rows={4}
            placeholder="Any specific notes about your collaboration preferences (optional)"
            {...register('collaborationNotes')}
          />
          {errors.collaborationNotes && (
            <div className="invalid-feedback">{errors.collaborationNotes.message}</div>
          )}
        </div>
      </div>
    </div>
  );
}




