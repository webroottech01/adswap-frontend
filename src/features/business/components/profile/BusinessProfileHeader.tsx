'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Building2, MapPin, Star, BadgeCheck } from 'lucide-react';
import { Button } from '@/ui/Button';
import { Edit } from 'lucide-react';
import type { Business } from '../../api';
import { resolveLogoUrl } from '../../utils/businessAssetUrl';

interface BusinessProfileHeaderProps {
  business: Business;
  onEdit?: () => void;
  showOwnerActions?: boolean;
}

export function BusinessProfileHeader({
  business,
  onEdit,
  showOwnerActions = false,
}: BusinessProfileHeaderProps) {
  const logoUrl = resolveLogoUrl(business);
  const isVerified = business.status === 'approved';

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body p-4">
        <div className="row align-items-center g-4">
          <div className="col-auto">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={business.name}
                width={96}
                height={96}
                className="rounded border"
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            ) : (
              <div
                className="rounded border bg-light d-flex align-items-center justify-content-center text-primary"
                style={{ width: 96, height: 96 }}
              >
                <Building2 size={40} />
              </div>
            )}
          </div>
          <div className="col">
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <h2 className="h3 mb-0">{business.name}</h2>
              {isVerified && (
                <span className="badge bg-success d-inline-flex align-items-center gap-1">
                  <BadgeCheck size={14} />
                  Verified
                </span>
              )}
            </div>
            <p className="mb-2">
              <span className="badge bg-primary">{business.category}</span>
            </p>
            {business.address && (
              <p className="text-muted mb-2 d-flex align-items-center gap-1">
                <MapPin size={16} />
                {business.address}
              </p>
            )}
            <div className="d-flex flex-wrap gap-3 small text-muted">
              <span className="d-inline-flex align-items-center gap-1">
                <Star size={14} className="text-warning" />
                {business.average_rating != null
                  ? `${business.average_rating} / 5`
                  : 'Not rated yet'}
              </span>
            </div>
          </div>
          <div className="col-12 col-md-auto d-flex flex-column gap-2">
            {onEdit && (
              <Button variant="primary" outline size="sm" icon={Edit} onClick={onEdit}>
                Edit profile
              </Button>
            )}
            {showOwnerActions && (
              <Link href="/inventory" className="btn btn-sm btn-outline-primary">
                Manage promotions
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
