'use client';

import { formatCollaborationLabel } from '../../utils/profileLabels';

export function CollaborationPreferencesDisplay({
  preferences,
}: {
  preferences: Record<string, unknown>;
}) {
  const {
    preferred_collaboration_types,
    budget_range,
    collaboration_notes,
    ...rest
  } = preferences;

  const types = Array.isArray(preferred_collaboration_types)
    ? preferred_collaboration_types
    : [];

  const otherEntries = Object.entries(rest).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== '' &&
      !(Array.isArray(value) && value.length === 0)
  );

  return (
    <div className="row">
      {types.length > 0 && (
        <div className="col-12 mb-3">
          <label className="form-label text-muted small">Preferred collaboration types</label>
          <div className="d-flex flex-wrap gap-2">
            {types.map((type, index) => (
              <span key={index} className="badge bg-success">
                {formatCollaborationLabel(String(type))}
              </span>
            ))}
          </div>
        </div>
      )}
      {budget_range != null && budget_range !== '' && (
        <div className="col-md-6 mb-3">
          <label className="form-label text-muted small">Budget range</label>
          <p className="mb-0">{String(budget_range)}</p>
        </div>
      )}
      {collaboration_notes != null && collaboration_notes !== '' && (
        <div className="col-12 mb-3">
          <label className="form-label text-muted small">Collaboration notes</label>
          <p className="mb-0">{String(collaboration_notes)}</p>
        </div>
      )}
      {otherEntries.map(([key, value]) => (
        <div key={key} className="col-md-6 mb-3">
          <label className="form-label text-muted small">{formatCollaborationLabel(key)}</label>
          {Array.isArray(value) ? (
            <div className="d-flex flex-wrap gap-2">
              {value.map((item, index) => (
                <span key={index} className="badge bg-secondary">
                  {formatCollaborationLabel(String(item))}
                </span>
              ))}
            </div>
          ) : (
            <p className="mb-0">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
