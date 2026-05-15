'use client';

import { Service } from '@/features/serviceCatalog/api';
import { Button } from '@/ui/Button';
import { Edit, RefreshCw, Power } from 'lucide-react';
import { useMemo } from 'react';

interface ServiceListProps {
  services: Service[];
  loading?: boolean;
  onEdit?: (service: Service) => void;
  onToggle?: (service: Service) => void;
  onRefresh?: () => void;
}

/**
 * Service List Component
 */
export function ServiceList({
  services,
  loading = false,
  onEdit,
  onToggle,
  onRefresh,
}: ServiceListProps) {
  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, Service[]> = {};
    services.forEach((service) => {
      const categoryName = service.category_name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(service);
    });
    return grouped;
  }, [services]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted mb-3">No services found</p>
        {onRefresh && (
          <Button variant="secondary" outline icon={RefreshCw} onClick={onRefresh}>
            Refresh
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      {Object.entries(servicesByCategory).map(([categoryName, categoryServices]) => (
        <div key={categoryName} className="mb-4">
          <h5 className="mb-3">{categoryName}</h5>
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
                {categoryServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                    </td>
                    <td>
                      <code className="small">{service.slug}</code>
                    </td>
                    <td>
                      <span className="text-muted small">
                        {service.description || '-'}
                      </span>
                    </td>
                    <td>{service.order}</td>
                    <td>
                      {service.is_enabled ? (
                        <span className="badge bg-success">Enabled</span>
                      ) : (
                        <span className="badge bg-secondary">Disabled</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        {onToggle && (
                          <Button
                            variant={service.is_enabled ? 'secondary' : 'success'}
                            size="sm"
                            outline
                            icon={Power}
                            onClick={() => onToggle(service)}
                            title={service.is_enabled ? 'Disable' : 'Enable'}
                          >
                            {service.is_enabled ? 'Disable' : 'Enable'}
                          </Button>
                        )}
                        {onEdit && (
                          <Button
                            variant="secondary"
                            size="sm"
                            outline
                            icon={Edit}
                            onClick={() => onEdit(service)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}




