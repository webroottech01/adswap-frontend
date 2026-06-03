'use client';

import type {
  CrossPromotionDetails,
  PaidPromotionDetails,
  Promotion,
} from '@/features/promotions/types';
import { paidDurationLabel } from '@/features/promotions/constants';

function parseDate(value: string): Date | null {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDuration(start: Date, unit: string, value: number): Date | null {
  const end = new Date(start);
  switch (unit) {
    case 'day':
      end.setDate(end.getDate() + value);
      break;
    case 'week':
      end.setDate(end.getDate() + value * 7);
      break;
    case 'month':
      end.setMonth(end.getMonth() + value);
      break;
    case 'event':
      end.setDate(end.getDate() + Math.max(value, 1));
      break;
    default:
      return null;
  }
  return end;
}

function formatShortDate(d: Date): string {
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

interface PromotionValidityBarProps {
  promotion: Promotion;
}

export function PromotionValidityBar({ promotion }: PromotionValidityBarProps) {
  const now = new Date();

  if (promotion.category === 'cross') {
    const duration = (promotion.details as CrossPromotionDetails).available_duration;
    const start = duration?.start_date ? parseDate(duration.start_date) : null;
    const end = duration?.end_date ? parseDate(duration.end_date) : null;

    if (start && end && end > start) {
      const total = end.getTime() - start.getTime();
      const elapsed = Math.min(Math.max(now.getTime() - start.getTime(), 0), total);
      const pct = Math.round((elapsed / total) * 100);
      const expired = now > end;

      return (
        <div className="mt-2">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>{formatShortDate(start)}</span>
            <span>{expired ? 'Expired' : `${pct}%`}</span>
            <span>{formatShortDate(end)}</span>
          </div>
          <div className="progress" style={{ height: 4 }}>
            <div
              className={`progress-bar ${expired ? 'bg-secondary' : 'bg-success'}`}
              style={{ width: `${expired ? 100 : pct}%` }}
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="mt-2">
        <div className="progress" style={{ height: 4 }}>
          <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" style={{ width: '100%' }} />
        </div>
        <span className="small text-muted">Open availability</span>
      </div>
    );
  }

  const paid = promotion.details as PaidPromotionDetails;
  const unit = paid.duration?.unit;
  const value = paid.duration?.value;
  const publishedAt = promotion.published_at ? parseDate(promotion.published_at) : null;

  if (publishedAt && unit && value != null && value > 0) {
    const end = addDuration(publishedAt, unit, value);
    if (end && end > publishedAt) {
      const total = end.getTime() - publishedAt.getTime();
      const elapsed = Math.min(Math.max(now.getTime() - publishedAt.getTime(), 0), total);
      const pct = Math.round((elapsed / total) * 100);
      const expired = now > end;

      return (
        <div className="mt-2">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>{paidDurationLabel(unit, value)}</span>
            <span>{expired ? 'Ended' : `${pct}%`}</span>
          </div>
          <div className="progress" style={{ height: 4 }}>
            <div
              className={`progress-bar ${expired ? 'bg-secondary' : 'bg-warning'}`}
              style={{ width: `${expired ? 100 : pct}%` }}
            />
          </div>
        </div>
      );
    }
  }

  if (unit) {
    return (
      <p className="small text-muted mb-0 mt-2">
        Duration: {paidDurationLabel(unit, value)}
      </p>
    );
  }

  return null;
}
