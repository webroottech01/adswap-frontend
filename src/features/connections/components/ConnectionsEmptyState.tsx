'use client';

import Link from 'next/link';
import { Store } from 'lucide-react';

interface ConnectionsEmptyStateProps {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function ConnectionsEmptyState({
  title,
  description,
  ctaHref = '/marketplace',
  ctaLabel = 'Browse marketplace',
}: ConnectionsEmptyStateProps) {
  return (
    <div className="card">
      <div className="card-body text-center py-5">
        <Store size={40} className="text-muted mb-3" />
        <h5 className="text-muted mb-2">{title}</h5>
        <p className="text-muted mb-4">{description}</p>
        <Link href={ctaHref} className="btn btn-primary">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
