'use client';

import { MarketplaceListing } from '../types';
import { MarketplaceCard } from './MarketplaceCard';
import { MarketplaceSkeleton } from './MarketplaceSkeleton';

interface MarketplaceGridProps {
  listings: MarketplaceListing[];
  loading: boolean;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  isAuthenticated?: boolean;
  myBusinessId?: number | null;
  onCollaborateClick?: (listing: MarketplaceListing) => void;
}

/**
 * Marketplace Grid Component
 * Displays listings in a responsive grid with pagination
 */
export function MarketplaceGrid({
  listings,
  loading,
  pagination,
  onPageChange,
  isAuthenticated,
  myBusinessId,
  onCollaborateClick,
}: MarketplaceGridProps) {
  if (loading && listings.length === 0) {
    return (
      <>
        <div className="row g-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="col-md-4 col-lg-3">
              <MarketplaceSkeleton />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (!loading && listings.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <h5 className="text-muted mb-3">No listings found</h5>
          <p className="text-muted">
            Try adjusting your filters to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row g-4">
        {listings.map((listing) => (
          <div key={listing.id} className="col-md-4 col-lg-3">
            <MarketplaceCard
              listing={listing}
              isAuthenticated={isAuthenticated}
              myBusinessId={myBusinessId}
              onCollaborateClick={onCollaborateClick}
            />
          </div>
        ))}
      </div>

      {pagination.last_page > 1 && (
        <div className="mt-4">
          <nav aria-label="Marketplace pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => onPageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <li
                  key={page}
                  className={`page-item ${pagination.current_page === page ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => onPageChange(page)}>
                    {page}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  pagination.current_page === pagination.last_page ? 'disabled' : ''
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
          <div className="text-center mt-2">
            <small className="text-muted">
              Showing {pagination.current_page} of {pagination.last_page} pages ({pagination.total} total results)
            </small>
          </div>
        </div>
      )}
    </>
  );
}




