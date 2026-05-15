'use client';

import { MarketplaceListing } from '../types';
import { Card } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import Image from 'next/image';

interface MarketplaceCardProps {
  listing: MarketplaceListing;
  isAuthenticated?: boolean;
  onCollaborateClick?: (listing: MarketplaceListing) => void;
}

/**
 * Marketplace Card Component
 * Displays individual business listing card
 */
export function MarketplaceCard({ listing, isAuthenticated, onCollaborateClick }: MarketplaceCardProps) {
  return (
    <Card className="h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start mb-3">
          {listing.logo_path ? (
            <div className="me-3 flex-shrink-0">
              <Image
                src={listing.logo_path}
                alt={listing.name}
                width={64}
                height={64}
                className="rounded"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <div
              className="me-3 flex-shrink-0 bg-secondary rounded d-flex align-items-center justify-content-center"
              style={{ width: 64, height: 64 }}
            >
              <span className="text-muted">{listing.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
          <div className="flex-grow-1">
            <h5 className="card-title mb-1">{listing.name}</h5>
            <Badge variant="secondary" className="mb-2">
              {listing.category}
            </Badge>
          </div>
        </div>

        {listing.description && (
          <p className="card-text text-muted small mb-3" style={{ minHeight: '3rem' }}>
            {listing.description.length > 120
              ? `${listing.description.substring(0, 120)}...`
              : listing.description}
          </p>
        )}

        <div className="mt-auto">
          {listing.address && (
            <div className="mb-2">
              <small className="text-muted">
                📍 {listing.address}
              </small>
            </div>
          )}

          {listing.brand_size && (
            <div className="mb-2">
              <small className="text-muted">
                <strong>Size:</strong> {listing.brand_size.charAt(0).toUpperCase() + listing.brand_size.slice(1)}
              </small>
            </div>
          )}

          {listing.annual_revenue_range && (
            <div className="mb-2">
              <small className="text-muted">
                <strong>Revenue:</strong> {listing.annual_revenue_range}
              </small>
            </div>
          )}

          {listing.services && listing.services.length > 0 && (
            <div className="mt-3">
              <div className="d-flex flex-wrap gap-1">
                {listing.services.slice(0, 3).map((service) => (
                  <Badge key={service} variant="outline" className="small">
                    {service}
                  </Badge>
                ))}
                {listing.services.length > 3 && (
                  <Badge variant="outline" className="small">
                    +{listing.services.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {isAuthenticated && onCollaborateClick && (
            <div className="mt-3 pt-2 border-top">
              <button
                type="button"
                className="btn btn-primary btn-sm w-100"
                onClick={() => onCollaborateClick(listing)}
              >
                Collaborate
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

