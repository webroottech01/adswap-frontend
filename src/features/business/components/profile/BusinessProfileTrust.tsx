'use client';

import { Shield, FileText, BadgeCheck } from 'lucide-react';
import type { Business } from '../../api';
import { BusinessProfileSection } from './BusinessProfileSection';
import { BusinessStatusBadge } from '@/features/admin/components/BusinessStatusBadge';
import { BusinessStatus } from '@/features/admin/types';
import { resolveBusinessFileUrl } from '../../utils/businessAssetUrl';

interface BusinessProfileTrustProps {
  business: Business;
  publicMode?: boolean;
}

const FUTURE_BADGES = [
  'Trust score',
  'Top collaborator',
  'Premium brand',
];

export function BusinessProfileTrust({ business, publicMode = false }: BusinessProfileTrustProps) {
  const documents = business.documents ?? [];
  const isVerified = business.status === 'approved';

  return (
    <BusinessProfileSection title="Trust & verification" icon={Shield}>
      <div className="mb-4">
        {isVerified ? (
          <span className="badge bg-success d-inline-flex align-items-center gap-1 me-2">
            <BadgeCheck size={14} />
            Verified business
          </span>
        ) : (
          <span className="badge bg-secondary me-2">Not verified</span>
        )}
        {!publicMode && (
          <BusinessStatusBadge status={business.status as BusinessStatus} />
        )}
      </div>

      {!publicMode && documents.length > 0 ? (
        <div className="mb-4">
          <label className="form-label text-muted small">Verification documents</label>
          <div className="row g-3">
            {documents.map((document) => (
              <div key={document.id} className="col-md-6">
                <div className="card border">
                  <div className="card-body p-3 d-flex align-items-start gap-2">
                    <FileText size={20} className="text-muted flex-shrink-0" />
                    <div className="flex-grow-1 min-w-0">
                      <p className="mb-1 fw-semibold small text-truncate">{document.file_name}</p>
                      <p className="mb-1 small">
                        <span className="badge bg-primary text-uppercase me-1">
                          {document.document_type}
                        </span>
                        <span
                          className={`badge ${
                            document.status === 'verified'
                              ? 'bg-success'
                              : document.status === 'rejected'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                          }`}
                        >
                          {document.status}
                        </span>
                      </p>
                      <a
                        href={resolveBusinessFileUrl(document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                      >
                        View document
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !publicMode ? (
        <p className="text-muted small mb-4">No verification documents uploaded.</p>
      ) : null}

      <div>
        <label className="form-label text-muted small">Coming soon</label>
        <div className="d-flex flex-wrap gap-2">
          {FUTURE_BADGES.map((label) => (
            <span
              key={label}
              className="badge bg-light text-muted border"
              title="Coming soon"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </BusinessProfileSection>
  );
}
