'use client';

import { useState, useEffect } from 'react';
import { BusinessEmptyState } from '@/features/business/components/BusinessEmptyState';
import { BusinessFormWizard } from '@/features/business/components/BusinessFormWizard';
import { BusinessProfile } from '@/features/business/components/BusinessProfile';
import { businessApi, Business } from '@/features/business/api';

/**
 * My Business Page
 * Shows empty state if no business exists, or business profile if exists
 */
export default function BusinessPage() {
  const [showForm, setShowForm] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await businessApi.getMyBusiness();
      setBusiness(data);
    } catch (err: any) {
      // 404 means no business exists - this is expected
      if (err.response?.status === 404) {
        setBusiness(null);
      } else {
        setError(err.response?.data?.message || 'Failed to load business');
        console.error('Error fetching business:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchBusiness();
  };

  if (showForm) {
    return (
      <BusinessFormWizard 
        onClose={() => setShowForm(false)} 
        onSuccess={handleFormSuccess}
        business={business || undefined}
      />
    );
  }

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!business) {
    return <BusinessEmptyState onCreateClick={() => setShowForm(true)} />;
  }

  return (
    <BusinessProfile
      business={business}
      onEdit={() => setShowForm(true)}
    />
  );
}


