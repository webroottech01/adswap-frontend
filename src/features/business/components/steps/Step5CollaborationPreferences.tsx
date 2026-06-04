'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { BUDGET_RANGE_OPTIONS, COLLABORATION_TYPE_OPTIONS, LOCATION_RADIUS_OPTIONS } from '../../constants';
import { ChipMultiSelect } from '@/shared/forms/ChipMultiSelect';
import { useBusinessCategories } from '../../hooks/useBusinessCategories';
import { SearchableCategoryChecklist } from '../SearchableCategoryChecklist';

interface Step5CollaborationPreferencesProps {
  form: UseFormReturn<BusinessFormData>;
}

export function Step5CollaborationPreferences({ form }: Step5CollaborationPreferencesProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  const { categories, loading: categoriesLoading } = useBusinessCategories();
  const preferredTypes = watch('preferredCollaborationTypes') || [];
  const partnerIds = watch('preferredPartnerCategoryIds') || [];

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Collaboration Preferences</h5>
      </div>
      <div className="card-body">
        <ChipMultiSelect
          label="Preferred Collaboration Types"
          options={COLLABORATION_TYPE_OPTIONS}
          value={preferredTypes}
          onChange={(v) => setValue('preferredCollaborationTypes', v)}
        />

        <SearchableCategoryChecklist
          label="Preferred Partner Categories"
          categories={categories}
          value={partnerIds}
          onChange={(ids) => setValue('preferredPartnerCategoryIds', ids)}
          loading={categoriesLoading}
        />

        <div className="mb-3">
          <label className="form-label">Budget Range</label>
          <select className="form-select" {...register('budgetRange')}>
            <option value="">Select budget</option>
            {BUDGET_RANGE_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Preferred Location Radius</label>
          <select className="form-select" {...register('preferredLocationRadius')}>
            <option value="">Select radius</option>
            {LOCATION_RADIUS_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Collaboration Notes</label>
          <textarea className="form-control" rows={3} {...register('collaborationNotes')} />
          {errors.collaborationNotes && <div className="text-danger small">{errors.collaborationNotes.message}</div>}
        </div>
      </div>
    </div>
  );
}
