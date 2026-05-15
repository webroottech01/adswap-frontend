'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BusinessForm } from '@/features/admin/components/BusinessForm';
import { BusinessFormData, Business } from '@/features/admin/types';
import { mockBusinesses } from '@/features/admin/mockData';
import { Button } from '@/ui/Button';
import { ArrowLeft, Trash2 } from 'lucide-react';

/**
 * Edit Business Page
 * Form to edit an existing business
 */
export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = parseInt(params.id as string);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    // Find business from mock data
    const found = mockBusinesses.find((b) => b.id === businessId);
    setBusiness(found || null);
  }, [businessId]);

  const handleSubmit = async (data: BusinessFormData) => {
    setLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Update business:', businessId, data);
    alert(`Business "${data.name}" would be updated (mock action)`);
    setLoading(false);
    // Redirect to business list
    router.push('/admin/businesses');
  };

  const handleDelete = async () => {
    if (!business) return;

    if (!window.confirm(`Are you sure you want to delete "${business.name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Delete business:', businessId);
    alert(`Business "${business.name}" would be deleted (mock action)`);
    setDeleteLoading(false);
    // Redirect to business list
    router.push('/admin/businesses');
  };

  const handleCancel = () => {
    router.push('/admin/businesses');
  };

  if (!business) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <h3>Business Not Found</h3>
          <p className="text-muted">The business you're looking for doesn't exist.</p>
          <Link href="/admin/businesses">
            <Button variant="primary">Back to Businesses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const initialData: BusinessFormData = {
    name: business.name,
    category: business.category,
    status: business.status,
    is_provider: business.is_provider,
    is_buyer: business.is_buyer,
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Link href="/admin/businesses" className="text-decoration-none">
          <Button variant="secondary" outline icon={ArrowLeft}>
            Back to Businesses
          </Button>
        </Link>
        <Button
          variant="danger"
          outline
          icon={Trash2}
          onClick={handleDelete}
          loading={deleteLoading}
        >
          Delete Business
        </Button>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="mb-4">
            <h1 className="h3 mb-1">Edit Business</h1>
            <p className="text-muted mb-0">Update business information</p>
          </div>

          <BusinessForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}











