'use client';

import { useEffect, useState } from 'react';
import { useMarketplace, useMarketplaceFilters } from '@/features/marketplace/hooks';
import { MarketplaceFilters } from '@/features/marketplace/components/MarketplaceFilters';
import { MarketplaceGrid } from '@/features/marketplace/components/MarketplaceGrid';
import { useAuthSession } from '@/features/auth/public';
import { CollaborationModal, useSendRequest } from '@/features/collaboration';
import type { MarketplaceCollaborationTarget } from '@/features/marketplace/types';
import type { SendCollaborationPayload } from '@/features/collaboration/types';
import { businessApi } from '@/features/business/api';

export default function MarketplacePage() {
  const { isAuthenticated } = useAuthSession();
  const [collaborationTarget, setCollaborationTarget] =
    useState<MarketplaceCollaborationTarget | null>(null);
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
      } catch {
        if (!cancelled) setMyBusinessId(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const { listings: rawListings, loading, error, pagination } = useMarketplace(filters);

  const listings =
    myBusinessId != null
      ? rawListings.filter((listing) => listing.id !== myBusinessId)
      : rawListings;

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

  const handleCollaborateClick = (target: MarketplaceCollaborationTarget) => {
    setCollaborationTarget(target);
    setSuccessMessage(null);
    setCollaborationError(null);
    clearError();
  };

  const handleCollaborationSubmit = async (payload: SendCollaborationPayload) => {
    return send(payload);
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Marketplace</h1>
        <p className="text-muted mb-0">Discover published promotion opportunities from providers</p>
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

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => {}} aria-label="Close" />
        </div>
      )}

      <MarketplaceFilters
        filters={filters}
        metadata={metadata}
        metadataLoading={metadataLoading}
        onFiltersChange={updateFilters}
      />

      <MarketplaceGrid
        listings={listings}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        isAuthenticated={isAuthenticated}
        myBusinessId={myBusinessId}
        onCollaborateClick={handleCollaborateClick}
      />

      {collaborationTarget != null && (
        <CollaborationModal
          show
          onHide={() => setCollaborationTarget(null)}
          receiverBusinessId={collaborationTarget.businessId}
          receiverBusinessName={collaborationTarget.businessName}
          targetPromotion={collaborationTarget.promotion}
          onSubmit={handleCollaborationSubmit}
          loading={sendLoading}
          error={sendError}
          onClearError={clearError}
        />
      )}
    </div>
  );
}
