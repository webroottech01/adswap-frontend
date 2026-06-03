'use client';

import { Business } from '../api';
import { BusinessStatusBadge } from '@/features/admin/components/BusinessStatusBadge';
import { BusinessStatus } from '@/features/admin/types';
import { AlertCircle, XCircle, Ban } from 'lucide-react';
import { BusinessProfileView } from './profile/BusinessProfileView';

interface BusinessProfileProps {
  business: Business;
  onEdit?: () => void;
  title?: string;
  showStatusMessage?: boolean;
}

export function BusinessProfile({
  business,
  onEdit,
  title = 'My Business',
  showStatusMessage = true,
}: BusinessProfileProps) {
  const showOwnerActions = Boolean(onEdit);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const renderStatusMessage = () => {
    switch (business.status) {
      case 'pending':
        return (
          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <AlertCircle className="me-2" size={20} />
            <div>
              <strong>Awaiting approval</strong>
              <p className="mb-0 small">
                Your business profile is pending review. We will notify you once it has been reviewed.
              </p>
            </div>
          </div>
        );
      case 'rejected':
        return (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <XCircle className="me-2" size={20} />
            <div>
              <strong>Business rejected</strong>
              <p className="mb-0 small">
                Your business profile has been rejected. Please review your information and resubmit if needed.
              </p>
            </div>
          </div>
        );
      case 'suspended':
        return (
          <div className="alert alert-secondary d-flex align-items-center" role="alert">
            <Ban className="me-2" size={20} />
            <div>
              <strong>Business suspended</strong>
              <p className="mb-0 small">
                Your business profile has been suspended. Please contact support for more information.
              </p>
            </div>
          </div>
        );
      case 'approved':
        return (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <AlertCircle className="me-2" size={20} />
            <div>
              <strong>Business approved</strong>
              <p className="mb-0 small">Your business profile is active and visible to other users.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-fluid py-4">
      <h3 className="mb-4">{title}</h3>

      {showStatusMessage ? renderStatusMessage() : null}

      <BusinessProfileView
        business={business}
        onEdit={onEdit}
        showOwnerActions={showOwnerActions}
      />

      <footer className="border-top pt-3 mt-2">
        <div className="row small text-muted">
          {business.phone && (
            <div className="col-md-6 mb-2">
              <span className="fw-semibold">Phone: </span>
              <a href={`tel:${business.phone}`}>{business.phone}</a>
            </div>
          )}
          {business.email && (
            <div className="col-md-6 mb-2">
              <span className="fw-semibold">Email: </span>
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </div>
          )}
          <div className="col-md-6 mb-2">
            <span className="fw-semibold">Status: </span>
            <BusinessStatusBadge status={business.status as BusinessStatus} />
          </div>
          <div className="col-md-6 mb-2">
            <span className="fw-semibold">Created: </span>
            {formatDate(business.created_at)}
          </div>
          {business.updated_at && (
            <div className="col-md-6 mb-2">
              <span className="fw-semibold">Last updated: </span>
              {formatDate(business.updated_at)}
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
