'use client';

import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { useBusinessCategories } from '../../hooks/useBusinessCategories';
import { SearchableCategorySelect } from '../SearchableCategorySelect';

interface Step1BasicDetailsProps {
  form: UseFormReturn<BusinessFormData>;
}

export function Step1BasicDetails({ form }: Step1BasicDetailsProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const { categories, loading, error } = useBusinessCategories();
  const categoryId = watch('categoryId');
  const category = watch('category');

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Basic Account Info</h5>
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-12">
            <label htmlFor="name" className="form-label">
              Business Name <span className="text-danger">*</span>
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
              {...register('name')}
            />
            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          <div className="col-12">
            <SearchableCategorySelect
              categories={categories}
              valueId={categoryId}
              valueName={category}
              loading={loading}
              error={errors.category?.message || error || undefined}
              onChange={(id, name) => {
                setValue('categoryId', id, { shouldValidate: true });
                setValue('category', name, { shouldValidate: true });
              }}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">City <span className="text-danger">*</span></label>
            <input className={`form-control ${errors.city ? 'is-invalid' : ''}`} {...register('city')} />
            {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Area / Locality <span className="text-danger">*</span></label>
            <input className={`form-control ${errors.area ? 'is-invalid' : ''}`} {...register('area')} />
            {errors.area && <div className="invalid-feedback">{errors.area.message}</div>}
          </div>

          <div className="col-12">
            <label className="form-label">Contact Person <span className="text-danger">*</span></label>
            <input className={`form-control ${errors.contactPerson ? 'is-invalid' : ''}`} {...register('contactPerson')} />
            {errors.contactPerson && <div className="invalid-feedback">{errors.contactPerson.message}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email <span className="text-danger">*</span></label>
            <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} {...register('email')} />
            {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Mobile Number <span className="text-danger">*</span></label>
            <input className={`form-control ${errors.phone ? 'is-invalid' : ''}`} {...register('phone')} />
            {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
