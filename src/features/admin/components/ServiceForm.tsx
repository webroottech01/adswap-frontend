'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Service, CreateServiceData, serviceCatalogApi } from '@/features/serviceCatalog/api';
import { Button } from '@/ui/Button';

interface ServiceFormProps {
  initialData?: Service;
  onSubmit: (data: CreateServiceData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

/**
 * Service Form Component
 */
export function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: ServiceFormProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await serviceCatalogApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateServiceData>({
    defaultValues: {
      service_category_id: initialData?.service_category_id || 0,
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      icon: initialData?.icon || '',
      order: initialData?.order || 0,
      is_enabled: initialData?.is_enabled ?? true,
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setValue('name', name);
    if (!initialData) {
      // Only auto-generate slug if creating new service
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  };

  const onFormSubmit = async (data: CreateServiceData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="card">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12">
              <label htmlFor="service_category_id" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                id="service_category_id"
                className={`form-select ${errors.service_category_id ? 'is-invalid' : ''}`}
                {...register('service_category_id', {
                  required: 'Category is required',
                  valueAsNumber: true,
                })}
                disabled={loadingCategories}
              >
                <option value={0}>
                  {loadingCategories ? 'Loading categories...' : 'Select a category'}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.service_category_id && (
                <div className="invalid-feedback">
                  {errors.service_category_id.message}
                </div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="name" className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'Name is required' })}
                onChange={handleNameChange}
              />
              {errors.name && (
                <div className="invalid-feedback">{errors.name.message}</div>
              )}
            </div>

            <div className="col-md-6">
              <label htmlFor="slug" className="form-label">
                Slug <span className="text-danger">*</span>
              </label>
              <input
                id="slug"
                type="text"
                className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                {...register('slug', { required: 'Slug is required' })}
              />
              {errors.slug && (
                <div className="invalid-feedback">{errors.slug.message}</div>
              )}
            </div>

            <div className="col-12">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                rows={3}
                {...register('description')}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="icon" className="form-label">
                Icon
              </label>
              <input
                id="icon"
                type="text"
                className="form-control"
                placeholder="Icon class or URL"
                {...register('icon')}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="order" className="form-label">
                Order
              </label>
              <input
                id="order"
                type="number"
                className="form-control"
                {...register('order', { valueAsNumber: true })}
              />
            </div>

            <div className="col-12">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_enabled"
                  {...register('is_enabled')}
                />
                <label className="form-check-label" htmlFor="is_enabled">
                  Enabled
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-end gap-2">
          <Button variant="secondary" outline onClick={onCancel} disabled={isSubmitting || loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </form>
  );
}




