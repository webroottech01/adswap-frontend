'use client';

import { useEffect, useState } from 'react';
import { useMarketplace, useMarketplaceFilters } from '@/features/marketplace/hooks';
import { MarketplaceFilters } from '@/features/marketplace/components/MarketplaceFilters';
import { MarketplaceGrid } from '@/features/marketplace/components/MarketplaceGrid';
import { useAuthSession } from '@/features/auth/public';
import { CollaborationModal, useSendRequest } from '@/features/collaboration';
import type { MarketplaceListing } from '@/features/marketplace/types';
import { businessApi } from '@/features/business/api';

/**
 * Marketplace Page
 * Discover approved ad providers with filtering and pagination
 */
export default function MarketplacePage() {
  const { isAuthenticated } = useAuthSession();
  const [collaborationTarget, setCollaborationTarget] = useState<MarketplaceListing | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [collaborationError, setCollaborationError] = useState<string | null>(null);
  const [myBusinessId, setMyBusinessId] = useState<number | null>(null);

  const {
    filters,
    metadata,
    metadataLoading,
    updateFilters,
    setPage,
  } = useMarketplaceFilters();

  const {
    listings,
    loading,
    error,
    pagination,
  } = useMarketplace(filters);

  useEffect(() => {
    if (!isAuthenticated) {
      setMyBusinessId(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const myBusiness = await businessApi.getMyBusiness();
        if (!cancelled) setMyBusinessId(myBusiness.id);
      } catch (err: any) {
        // If user doesn't have a business yet (404), keep current behavior:
        // Collaborate button remains visible (myBusinessId stays null).
        if (!cancelled) setMyBusinessId(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const {
    send,
    loading: sendLoading,
    error: sendError,
    clearError,
  } = useSendRequest({
    onSuccess: () => {
      setCollaborationTarget(null);
      setCollaborationError(null);
      setSuccessMessage('Collaboration request sent successfully.');
    },
    onError: (message) => {
      setCollaborationError(message);
    },
  });

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleCollaborateClick = (listing: MarketplaceListing) => {
    setCollaborationTarget(listing);
    setSuccessMessage(null);
    setCollaborationError(null);
    clearError();
  };

  const handleCollaborationSubmit = async (message: string) => {
    if (!collaborationTarget) return;
    await send(collaborationTarget.id, message);
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Marketplace</h1>
        <p className="text-muted mb-0">Discover approved ad providers</p>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          />
        </div>
      )}

      {collaborationError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {collaborationError}
          <button
            type="button"
            className="btn-close"
            onClick={() => setCollaborationError(null)}
            aria-label="Close"
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => {}}
            aria-label="Close"
          />
        </div>
      )}

      {/* Filters */}
      <MarketplaceFilters
        filters={filters}
        metadata={metadata}
        metadataLoading={metadataLoading}
        onFiltersChange={updateFilters}
      />

      {/* Listings Grid */}
      <MarketplaceGrid
        listings={listings}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        isAuthenticated={isAuthenticated}
        myBusinessId={myBusinessId}
        onCollaborateClick={handleCollaborateClick}
      />

      {collaborationTarget && (
        <CollaborationModal
          show={!!collaborationTarget}
          onHide={() => setCollaborationTarget(null)}
          receiverBusinessId={collaborationTarget.id}
          receiverBusinessName={collaborationTarget.name}
          onSubmit={handleCollaborationSubmit}
          loading={sendLoading}
          error={sendError}
          onClearError={clearError}
        />
      )}
    </div>
  );
}
