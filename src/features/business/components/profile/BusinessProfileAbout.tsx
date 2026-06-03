'use client';

import { Briefcase } from 'lucide-react';
import type { Business } from '../../api';
import { BusinessProfileSection } from './BusinessProfileSection';
import { getBusinessTypeLabel } from '../../utils/profileLabels';

interface BusinessProfileAboutProps {
  business: Business;
}

export function BusinessProfileAbout({ business }: BusinessProfileAboutProps) {
  const hasContent =
    business.description ||
    business.founded_year ||
    business.business_type;

  if (!hasContent) {
    return null;
  }

  return (
    <BusinessProfileSection title="About the business" icon={Briefcase}>
      {business.description && (
        <p className="mb-3">{business.description}</p>
      )}
      <div className="row">
        {business.founded_year && (
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="form-label text-muted small">Year established</label>
            <p className="mb-0 fw-semibold">{business.founded_year}</p>
          </div>
        )}
        {business.business_type && (
          <div className="col-md-6">
            <label className="form-label text-muted small">Business type</label>
            <p className="mb-0">{getBusinessTypeLabel(business.business_type)}</p>
          </div>
        )}
      </div>
    </BusinessProfileSection>
  );
}
