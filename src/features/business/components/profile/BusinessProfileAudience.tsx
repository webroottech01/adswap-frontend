'use client';

import { Globe, Target, TrendingUp } from 'lucide-react';
import type { Business } from '../../api';
import { BusinessProfileSection } from './BusinessProfileSection';

interface BusinessProfileAudienceProps {
  business: Business;
}

function formatScale(scale?: string): string {
  if (!scale) return '';
  return scale.charAt(0).toUpperCase() + scale.slice(1);
}

function isUrlLike(value: string): boolean {
  return /^https?:\/\//i.test(value) || value.includes('.');
}

export function BusinessProfileAudience({ business }: BusinessProfileAudienceProps) {
  const profile = business.profile;
  const hasContent =
    (business.target_audience && business.target_audience.length > 0) ||
    (profile?.geographic_reach && profile.geographic_reach.length > 0) ||
    profile?.scale ||
    business.employee_count ||
    business.annual_revenue_range ||
    (profile?.social_media_handles &&
      Object.keys(profile.social_media_handles).length > 0) ||
    business.website;

  if (!hasContent) {
    return null;
  }

  const reachParts: string[] = [];
  if (profile?.scale) {
    reachParts.push(`Business scale: ${formatScale(profile.scale)}`);
  }
  if (business.employee_count) {
    reachParts.push(`Team size: ${business.employee_count}`);
  }
  if (business.annual_revenue_range) {
    reachParts.push(`Revenue range: ${business.annual_revenue_range}`);
  }

  return (
    <BusinessProfileSection title="Audience & reach" icon={Globe}>
      {business.target_audience && business.target_audience.length > 0 && (
        <div className="mb-3">
          <label className="form-label text-muted small d-flex align-items-center gap-1">
            <Target size={14} />
            Target audience
          </label>
          <div className="d-flex flex-wrap gap-2">
            {business.target_audience.map((audience, index) => (
              <span key={index} className="badge bg-primary">
                {audience}
              </span>
            ))}
          </div>
        </div>
      )}

      {profile?.geographic_reach && profile.geographic_reach.length > 0 && (
        <div className="mb-3">
          <label className="form-label text-muted small">Geographic reach</label>
          <div className="d-flex flex-wrap gap-2">
            {profile.geographic_reach.map((location, index) => (
              <span key={index} className="badge bg-info text-dark">
                {location}
              </span>
            ))}
          </div>
        </div>
      )}

      {reachParts.length > 0 && (
        <div className="mb-3">
          <label className="form-label text-muted small d-flex align-items-center gap-1">
            <TrendingUp size={14} />
            Reach indicators
          </label>
          <ul className="mb-0 ps-3">
            {reachParts.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>
        </div>
      )}

      {profile?.social_media_handles &&
        Object.keys(profile.social_media_handles).length > 0 && (
          <div className="mb-3">
            <label className="form-label text-muted small">Social media</label>
            <ul className="list-unstyled mb-0">
              {Object.entries(profile.social_media_handles).map(([platform, handle]) => {
                const href = isUrlLike(handle)
                  ? handle.startsWith('http')
                    ? handle
                    : `https://${handle}`
                  : undefined;
                return (
                  <li key={platform} className="mb-1">
                    <span className="text-capitalize fw-semibold me-2">{platform}:</span>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {handle}
                      </a>
                    ) : (
                      <span>{handle}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

      {business.website && (
        <div>
          <label className="form-label text-muted small">Website</label>
          <p className="mb-0">
            <a href={business.website} target="_blank" rel="noopener noreferrer">
              {business.website}
            </a>
          </p>
        </div>
      )}
    </BusinessProfileSection>
  );
}
