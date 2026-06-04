'use client';

import { CompletionSection } from '../types';

interface ProfileCompletionBannerProps {
  percentage: number;
  sections?: CompletionSection[];
}

export function ProfileCompletionBanner({ percentage, sections = [] }: ProfileCompletionBannerProps) {
  const missing = sections.flatMap((s) => s.missing_fields);

  return (
    <div className="alert alert-light border mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <strong>Complete your profile to get better collaboration matches.</strong>
        <span className="badge bg-primary">{percentage}%</span>
      </div>
      <div className="progress mb-2" style={{ height: 8 }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${percentage}%` }}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {missing.length > 0 && (
        <p className="small text-muted mb-0">
          Missing: {missing.slice(0, 5).join(', ')}
          {missing.length > 5 ? ` (+${missing.length - 5} more)` : ''}
        </p>
      )}
    </div>
  );
}
