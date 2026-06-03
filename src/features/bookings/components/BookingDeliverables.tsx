'use client';

import type { BookingDeliverables as DeliverablesType } from '../types';

interface BookingDeliverablesProps {
  deliverables: DeliverablesType;
}

export function BookingDeliverables({ deliverables }: BookingDeliverablesProps) {
  const hasTypes = deliverables.preferred_collaboration_types.length > 0;
  const hasServices = deliverables.services.length > 0;
  const hasNotes = Boolean(deliverables.collaboration_notes);
  const hasBudget = Boolean(deliverables.budget_range);

  if (!hasTypes && !hasServices && !hasNotes && !hasBudget) {
    return (
      <div className="mb-3">
        <h6 className="small fw-semibold mb-1">Deliverables</h6>
        <p className="text-muted small mb-0">No deliverables listed by partner yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-3">
      <h6 className="small fw-semibold mb-2">Deliverables (partner commitment)</h6>
      {hasTypes && (
        <div className="mb-2">
          <small className="text-muted d-block">Preferred collaboration types</small>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {deliverables.preferred_collaboration_types.map((type) => (
              <span key={type} className="badge bg-light text-dark border">
                {type}
              </span>
            ))}
          </div>
        </div>
      )}
      {hasBudget && (
        <p className="small mb-2">
          <span className="text-muted">Budget range:</span> {deliverables.budget_range}
        </p>
      )}
      {hasNotes && (
        <p className="small mb-2 text-muted">{deliverables.collaboration_notes}</p>
      )}
      {hasServices && (
        <div>
          <small className="text-muted d-block mb-1">Catalog services offered</small>
          <ul className="small mb-0 ps-3">
            {deliverables.services.map((service) => (
              <li key={service.id}>
                {service.name}
                {service.category_name ? (
                  <span className="text-muted"> ({service.category_name})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
