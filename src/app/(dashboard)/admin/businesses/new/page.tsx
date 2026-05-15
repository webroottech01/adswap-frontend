'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { BusinessForm } from '@/features/admin/components/BusinessForm';
import { BusinessFormData } from '@/features/admin/types';
import { Button } from '@/ui/Button';
import { ArrowLeft } from 'lucide-react';

/**
 * Create Business Page
 * Form to create a new business
 */
export default function CreateBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: BusinessFormData) => {
    setLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Create business:', data);
    alert(`Business "${data.name}" would be created (mock action)`);
    setLoading(false);
    // Redirect to business list
    router.push('/admin/businesses');
  };

  const handleCancel = () => {
    router.push('/admin/businesses');
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <Link href="/admin/businesses" className="text-decoration-none">
          <Button variant="secondary" outline icon={ArrowLeft}>
            Back to Businesses
          </Button>
        </Link>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="mb-4">
            <h1 className="h3 mb-1">Create New Business</h1>
            <p className="text-muted mb-0">Add a new business to the system</p>
          </div>

          <BusinessForm onSubmit={handleSubmit} onCancel={handleCancel} loading={loading} />
        </div>
      </div>
    </div>
  );
}











