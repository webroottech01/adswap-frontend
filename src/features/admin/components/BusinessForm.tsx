'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BusinessFormData, BusinessStatus } from '../types';
import { Button } from '@/ui/Button';

const businessSchema = z.object({
  name: z.string().min(1, 'Business name is required').min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
  is_provider: z.boolean(),
  is_buyer: z.boolean(),
});

interface BusinessFormProps {
  initialData?: BusinessFormData;
  onSubmit: (data: BusinessFormData) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

/**
 * Business Form Component
 * Reusable form for both creating and editing businesses
 */
export function BusinessForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: BusinessFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: initialData || {
      name: '',
      category: '',
      status: 'pending',
      is_provider: false,
      is_buyer: true,
    },
  });

  const handleFormSubmit = async (data: BusinessFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Business Name <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Enter business name"
                {...register('name')}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <input
                id="category"
                type="text"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                placeholder="Enter category"
                {...register('category')}
              />
              {errors.category && (
                <div className="invalid-feedback">{errors.category.message}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="status" className="form-label">
                Status <span className="text-danger">*</span>
              </label>
              <select
                id="status"
                className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                {...register('status')}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
              {errors.status && (
                <div className="invalid-feedback">{errors.status.message}</div>
              )}
            </div>

            <div className="col-md-6"></div>

            <div className="col-md-6">
              <div className="form-check">
                <input
                  id="is_provider"
                  type="checkbox"
                  className={`form-check-input ${errors.is_provider ? 'is-invalid' : ''}`}
                  {...register('is_provider')}
                />
                <label htmlFor="is_provider" className="form-check-label">
                  Is Provider
                </label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-check">
                <input
                  id="is_buyer"
                  type="checkbox"
                  className={`form-check-input ${errors.is_buyer ? 'is-invalid' : ''}`}
                  {...register('is_buyer')}
                />
                <label htmlFor="is_buyer" className="form-check-label">
                  Is Buyer
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-white d-flex justify-content-end gap-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Update Business' : 'Create Business'}
          </Button>
        </div>
      </div>
    </form>
  );
}











