'use client';

import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { BusinessFormData } from '../../types';
import { useBusinessCategories } from '../../hooks/useBusinessCategories';
import { buildCategoryTree, CategoryTreeNode } from '../../utils/categoryTree';

interface Step1BasicDetailsProps {
  form: UseFormReturn<BusinessFormData>;
}

/**
 * Render category option recursively
 */
function renderCategoryOption(category: CategoryTreeNode, level: number = 0): JSX.Element[] {
  const indent = '  '.repeat(level);
  const prefix = level > 0 ? '└─ ' : '';
  const displayName = level > 0 ? `${prefix}${category.name}` : category.name;

  const options: JSX.Element[] = [
    <option key={category.id} value={category.name}>
      {indent}{displayName}
    </option>
  ];

  if (category.children && category.children.length > 0) {
    category.children.forEach((child) => {
      options.push(...renderCategoryOption(child, level + 1));
    });
  }

  return options;
}

/**
 * Step 1: Basic Business Details
 */
export function Step1BasicDetails({ form }: Step1BasicDetailsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const { categories, loading, error } = useBusinessCategories();

  // Build tree structure
  const categoryTree = useMemo(() => {
    console.log('Building category tree, categories:', categories);
    
    if (!Array.isArray(categories) || categories.length === 0) {
      console.log('No categories available');
      return [];
    }
    
    try {
      const tree = buildCategoryTree(categories);
      console.log('Category tree built:', tree.length, 'root categories');
      return tree;
    } catch (err) {
      console.error('Error building category tree:', err);
      return [];
    }
  }, [categories]);

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Basic Business Details</h5>
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
              placeholder="Enter your business name"
              {...register('name')}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="category" className="form-label">
              Category <span className="text-danger">*</span>
            </label>
            <select
              id="category"
              className={`form-select ${errors.category ? 'is-invalid' : ''}`}
              {...register('category')}
              disabled={loading}
            >
              <option value="">{loading ? 'Loading categories...' : 'Select a category'}</option>
              {!loading && categoryTree.length > 0 && (
                categoryTree.flatMap((category) => renderCategoryOption(category))
              )}
              {!loading && categoryTree.length === 0 && categories.length > 0 && (
                categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {error && (
              <div className="text-danger small mt-1">{error}</div>
            )}
            {errors.category && (
              <div className="invalid-feedback">{errors.category.message}</div>
            )}
            {!loading && categories.length > 0 && (
              <small className="form-text text-muted">
                {categories.length} categories loaded
              </small>
            )}
          </div>

          <div className="col-12">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              id="location"
              type="text"
              className={`form-control ${errors.location ? 'is-invalid' : ''}`}
              placeholder="Enter business location (optional)"
              {...register('location')}
            />
            {errors.location && (
              <div className="invalid-feedback">{errors.location.message}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

