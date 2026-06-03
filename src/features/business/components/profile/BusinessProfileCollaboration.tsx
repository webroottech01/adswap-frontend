'use client';

import { Handshake } from 'lucide-react';
import type { Business } from '../../api';
import { BusinessProfileSection } from './BusinessProfileSection';
import { CollaborationPreferencesDisplay } from './CollaborationPreferencesDisplay';
import { getCollaborationInterestLabels } from '../../utils/profileLabels';

interface BusinessProfileCollaborationProps {
  business: Business;
}

export function BusinessProfileCollaboration({ business }: BusinessProfileCollaborationProps) {
  const preferences = business.collaboration_preferences ?? {};
  const hasPrefs = Object.keys(preferences).length > 0;
  const services = business.services ?? [];
  const interestLabels = getCollaborationInterestLabels(
    business.is_provider,
    business.is_buyer,
  );

  if (!hasPrefs && services.length === 0 && !business.is_provider && !business.is_buyer) {
    return null;
  }

  return (
    <BusinessProfileSection
      id="collaboration"
      title="Collaboration preferences"
      icon={Handshake}
      emphasized
    >
      <div className="mb-3">
        <label className="form-label text-muted small">Interested in</label>
        <div className="d-flex flex-wrap gap-2">
          {interestLabels.map((label) => (
            <span key={label} className="badge bg-primary">
              {label}
            </span>
          ))}
        </div>
      </div>

      {services.length > 0 && (
        <div className="mb-4">
          <label className="form-label text-muted small">Services you offer</label>
          <div className="d-flex flex-wrap gap-2">
            {services.map((s) => (
              <span key={s.id} className="badge bg-secondary">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {hasPrefs && <CollaborationPreferencesDisplay preferences={preferences} />}
    </BusinessProfileSection>
  );
}
