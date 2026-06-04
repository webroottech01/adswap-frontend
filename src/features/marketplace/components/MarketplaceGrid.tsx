'use client';

import { MarketplaceListing, MarketplaceCollaborationTarget } from '../types';
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
  onCollaborateClick?: (target: MarketplaceCollaborationTarget) => void;
  savedBrandIds?: Set<number>;
  savedPromotionIds?: Set<number>;
  onToggleSaveBrand?: (businessId: number) => void;
  onToggleSavePromotion?: (promotionId: number) => void;
  saveBrandLoadingId?: number | null;
  savePromotionLoadingId?: number | null;
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
  savedBrandIds,
  savedPromotionIds,
  onToggleSaveBrand,
  onToggleSavePromotion,
  saveBrandLoadingId,
  savePromotionLoadingId,
}: MarketplaceGridProps) {
  if (loading && listings.length === 0) {
    return (
      <>
        <div className="row g-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="col-12 col-lg-6">
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
          <h5 className="text-muted mb-3">No published promotions yet</h5>
          <p className="text-muted">
            Try adjusting your filters or check back when providers publish promotions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row g-4">
        {listings.flatMap((listing) =>
          (listing.promotions?.length ? listing.promotions : []).map((promotion) => (
            <div key={`${listing.id}-${promotion.id}`} className="col-12 col-lg-6">
              <MarketplaceCard
                listing={listing}
                promotion={promotion}
                isAuthenticated={isAuthenticated}
                myBusinessId={myBusinessId}
                onCollaborateClick={onCollaborateClick}
                brandSaved={savedBrandIds?.has(listing.id)}
                promotionSaved={savedPromotionIds?.has(promotion.id)}
                onToggleSaveBrand={
                  onToggleSaveBrand ? () => onToggleSaveBrand(listing.id) : undefined
                }
                onToggleSavePromotion={
                  onToggleSavePromotion ? () => onToggleSavePromotion(promotion.id) : undefined
                }
                saveBrandLoading={saveBrandLoadingId === listing.id}
                savePromotionLoading={savePromotionLoadingId === promotion.id}
              />
            </div>
          )),
        )}
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




