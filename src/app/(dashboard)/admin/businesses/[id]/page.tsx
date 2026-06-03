'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/features/admin/api';
import type { Business } from '@/features/admin/types';
import { BusinessProfile } from '@/features/business/components/BusinessProfile';
import { Button } from '@/ui/Button';
import { ArrowLeft, CheckCircle, XCircle, Ban } from 'lucide-react';

/**
 * Admin Business Details Page
 * Read-only details view matching /business UI
 */
export default function AdminBusinessDetailsPage() {
  const params = useParams();
  const businessId = useMemo(() => parseInt(params.id as string), [params.id]);

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBusiness();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const fetchBusiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBusiness(businessId);
      setBusiness(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load business');
      setBusiness(null);
      console.error('Error fetching business:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!business) return;

    setActionLoading('approve');
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.approveBusiness(business.id);
      setSuccessMessage(`Business "${business.name}" has been approved.`);
      await fetchBusiness();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve business');
      console.error('Error approving business:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!business) return;

    setActionLoading('reject');
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.rejectBusiness(business.id);
      setSuccessMessage(`Business "${business.name}" has been rejected.`);
      await fetchBusiness();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject business');
      console.error('Error rejecting business:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async () => {
    if (!business) return;

    setActionLoading('suspend');
    setError(null);
    setSuccessMessage(null);
    try {
      await adminApi.suspendBusiness(business.id);
      setSuccessMessage(`Business "${business.name}" has been suspended.`);
      await fetchBusiness();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to suspend business');
      console.error('Error suspending business:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const renderActionButtons = () => {
    if (!business) return null;

    const disabled = actionLoading !== null;

    if (business.status === 'pending') {
      return (
        <div className="d-flex gap-2 flex-wrap">
          <Button
            variant="success"
            outline
            icon={CheckCircle}
            loading={actionLoading === 'approve'}
            disabled={disabled}
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            outline
            icon={XCircle}
            loading={actionLoading === 'reject'}
            disabled={disabled}
            onClick={handleReject}
          >
            Reject
          </Button>
        </div>
      );
    }

    if (business.status === 'approved') {
      return (
        <Button
          variant="warning"
          outline
          icon={Ban}
          loading={actionLoading === 'suspend'}
          disabled={disabled}
          onClick={handleSuspend}
        >
          Suspend
        </Button>
      );
    }

    if (business.status === 'suspended') {
      return (
        <Button
          variant="success"
          outline
          icon={CheckCircle}
          loading={actionLoading === 'approve'}
          disabled={disabled}
          onClick={handleApprove}
        >
          Approve
        </Button>
      );
    }

    return null;
  };

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

  if (error && !business) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="mt-3">
          <Link href="/admin/businesses">
            <Button variant="secondary" outline icon={ArrowLeft}>
              Back to Businesses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <>
      <div className="container-fluid py-4">
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <Link href="/admin/businesses" className="text-decoration-none">
            <Button variant="secondary" outline icon={ArrowLeft}>
              Back to Businesses
            </Button>
          </Link>

          {renderActionButtons()}
        </div>

        {successMessage && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
            {successMessage}
            <button
              type="button"
              className="btn-close"
              onClick={() => setSuccessMessage(null)}
              aria-label="Close"
            />
          </div>
        )}

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button
              type="button"
              className="btn-close"
              onClick={() => setError(null)}
              aria-label="Close"
            />
          </div>
        )}
      </div>

      <BusinessProfile business={business as any} title="Business Details" showStatusMessage={false} />
    </>
  );
}











