'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/ui/Button';
import { ArrowLeft, Plus } from 'lucide-react';
import { ServiceList } from '@/features/admin/components/ServiceList';
import { ServiceForm } from '@/features/admin/components/ServiceForm';
import { serviceCatalogApi, Service, CreateServiceData } from '@/features/serviceCatalog/api';

/**
 * Services Admin Page
 */
export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceCatalogApi.getServices();
      setServices(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load services');
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleToggle = async (service: Service) => {
    try {
      await serviceCatalogApi.toggleService(service.id);
      await loadServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle service');
    }
  };

  const handleSubmit = async (data: CreateServiceData) => {
    try {
      if (editingService) {
        await serviceCatalogApi.updateService(editingService.id, data);
      } else {
        await serviceCatalogApi.createService(data);
      }
      setShowForm(false);
      setEditingService(null);
      await loadServices();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save service');
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(null);
  };

  if (showForm) {
    return (
      <div className="container-fluid py-4">
        <div className="mb-4">
          <Link href="/admin/service-catalog/services" className="text-decoration-none">
            <Button variant="secondary" outline icon={ArrowLeft}>
              Back to Services
            </Button>
          </Link>
        </div>

        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="mb-4">
              <h1 className="h3 mb-1">
                {editingService ? 'Edit Service' : 'Create Service'}
              </h1>
              <p className="text-muted mb-0">Add or update a service</p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <ServiceForm
              initialData={editingService || undefined}
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
          <h1 className="h3 mb-1 d-inline">Services</h1>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleCreate}>
          Create Service
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <ServiceList
            services={services}
            loading={loading}
            onEdit={handleEdit}
            onToggle={handleToggle}
            onRefresh={loadServices}
          />
        </div>
      </div>
    </div>
  );
}




