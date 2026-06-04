'use client';

import type { PartnerRelationship, RelationshipFilter } from '../types';
import { PartnerRelationshipCard } from './PartnerRelationshipCard';
import { ConnectionsEmptyState } from './ConnectionsEmptyState';

interface RelationshipsListProps {
  partners: PartnerRelationship[];
  loading: boolean;
  filter: RelationshipFilter;
  onFilterChange: (filter: RelationshipFilter) => void;
  onCollaborate?: (businessId: number, businessName: string) => void;
}

const FILTER_OPTIONS: { key: RelationshipFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'saved', label: 'Saved' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
];

export function RelationshipsList({
  partners,
  loading,
  filter,
  onFilterChange,
  onCollaborate,
}: RelationshipsListProps) {
  return (
    <>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`btn btn-sm ${filter === opt.key ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => onFilterChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading && partners.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      ) : !loading && partners.length === 0 ? (
        <ConnectionsEmptyState
          title="No relationships yet"
          description="Save brands from the marketplace or send collaboration requests to build your network."
          ctaHref="/marketplace"
          ctaLabel="Discover businesses"
        />
      ) : (
        <div className="row g-4">
          {partners.map((partner) => (
            <div key={partner.businessId} className="col-12 col-md-6 col-lg-4">
              <PartnerRelationshipCard partner={partner} onCollaborate={onCollaborate} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
