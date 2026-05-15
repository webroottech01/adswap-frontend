'use client';

import { ServiceCategory } from '@/features/serviceCatalog/api';
import { Button } from '@/ui/Button';
import { Edit, RefreshCw } from 'lucide-react';

interface ServiceCategoryListProps {
  categories: ServiceCategory[];
  loading?: boolean;
  onEdit?: (category: ServiceCategory) => void;
  onRefresh?: () => void;
}

/**
 * Service Category List Component
 */
export function ServiceCategoryList({
  categories,
  loading = false,
  onEdit,
  onRefresh,
}: ServiceCategoryListProps) {
  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted mb-3">No service categories found</p>
        {onRefresh && (
          <Button variant="secondary" outline icon={RefreshCw} onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Description</th>
            <th>Order</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>
                <strong>{category.name}</strong>
              </td>
              <td>
                <code className="small">{category.slug}</code>
              </td>
              <td>
                <span className="text-muted small">
                  {category.description || '-'}
                </span>
              </td>
              <td>{category.order}</td>
              <td>
                {category.is_enabled ? (
                  <span className="badge bg-success">Enabled</span>
                ) : (
                  <span className="badge bg-secondary">Disabled</span>
                )}
              </td>
              <td>
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    outline
                    icon={Edit}
                    onClick={() => onEdit(category)}
                  >
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




