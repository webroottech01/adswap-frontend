'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/ui/Button';
import { ArrowLeft, Plus } from 'lucide-react';
import { ServiceCategoryList } from '@/features/admin/components/ServiceCategoryList';
import { ServiceCategoryForm } from '@/features/admin/components/ServiceCategoryForm';
import { serviceCatalogApi, ServiceCategory, CreateServiceCategoryData } from '@/features/serviceCatalog/api';

/**
 * Service Categories Admin Page
 */
export default function ServiceCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceCatalogApi.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load categories');
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category: ServiceCategory) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (data: CreateServiceCategoryData) => {
    try {
      if (editingCategory) {
        // Update not implemented in backend yet, but prepare for it
        await serviceCatalogApi.createCategory(data);
      } else {
        await serviceCatalogApi.createCategory(data);
      }
      setShowForm(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category');
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  if (showForm) {
    return (
      <div className="container-fluid py-4">
        <div className="mb-4">
          <Link href="/admin/service-catalog/categories" className="text-decoration-none">
            <Button variant="secondary" outline icon={ArrowLeft}>
              Back to Categories
            </Button>
          </Link>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="mb-4">
              <h1 className="h3 mb-1">
                {editingCategory ? 'Edit Service Category' : 'Create Service Category'}
              </h1>
              <p className="text-muted mb-0">Add or update a service category</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <ServiceCategoryForm
              initialData={editingCategory || undefined}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link href="/admin/service-catalog" className="text-decoration-none me-3">
            <Button variant="secondary" outline icon={ArrowLeft} size="sm">
              Back
            </Button>
          </Link>
          <h1 className="h3 mb-1 d-inline">Service Categories</h1>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Create Category
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <ServiceCategoryList
            categories={categories}
            loading={loading}
            onEdit={handleEdit}
            onRefresh={loadCategories}
          />
        </div>
      </div>
    </div>
  );
}




