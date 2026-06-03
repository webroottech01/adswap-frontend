'use client';

import Link from 'next/link';
import type { Promotion } from '@/features/promotions/types';

interface CollaborationSenderPromotionPickerProps {
  promotions: Promotion[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  loading?: boolean;
  disabled?: boolean;
}

export function CollaborationSenderPromotionPicker({
  promotions,
  selectedId,
  onSelect,
  loading = false,
  disabled = false,
}: CollaborationSenderPromotionPickerProps) {
  if (loading) {
    return <p className="small text-muted mb-0">Loading your cross marketing promotions…</p>;
  }

  if (promotions.length === 0) {
    return (
      <div className="alert alert-warning mb-0">
        Please create and publish a cross marketing promotion before sending this collaboration
        request.{' '}
        <Link href="/inventory" className="alert-link">
          Go to promotions
        </Link>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2" role="radiogroup" aria-label="Your cross marketing promotions">
      {promotions.map((p) => {
        const selected = selectedId === p.id;
        return (
          <label
            key={p.id}
            className={`d-flex align-items-center gap-2 border rounded p-2 mb-0 cursor-pointer ${
              selected ? 'border-primary bg-primary bg-opacity-10' : 'border-secondary-subtle'
            } ${disabled ? 'opacity-50' : ''}`}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            <input
              type="radio"
              name="sender-promotion"
              className="form-check-input mt-0"
              checked={selected}
              onChange={() => onSelect(p.id)}
              disabled={disabled}
            />
            <span className="flex-grow-1 small fw-semibold text-truncate">{p.title}</span>
            <span className="badge bg-secondary flex-shrink-0">Cross Marketing</span>
          </label>
        );
      })}
    </div>
  );
}
