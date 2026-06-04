'use client';

import { useEffect, useState } from 'react';
import { useAuthSession } from '@/features/auth/public';
import { businessApi } from '@/features/business/api';
import { CollaborationModal, useSendRequest } from '@/features/collaboration';
import type { SendCollaborationPayload } from '@/features/collaboration/types';
import type { MarketplaceCollaborationTarget } from '@/features/marketplace/types';
import { marketplaceApi } from '@/features/marketplace/api';
import {
  SavedBrandsList,
  SavedPromotionsList,
  RelationshipsList,
  useSavedBrands,
  useSavedPromotions,
  usePartnerRelationships,
} from '@/features/connections';

type ConnectionsTab = 'saved_brands' | 'saved_promotions' | 'relationships';

export default function ConnectionsPage() {
  const { isAuthenticated } = useAuthSession();
  const [activeTab, setActiveTab] = useState<ConnectionsTab>('saved_brands');
  const [myBusinessId, setMyBusinessId] = useState<number | null>(null);
  const [collaborationTarget, setCollaborationTarget] =
    useState<MarketplaceCollaborationTarget | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const savedBrands = useSavedBrands();
  const savedPromotions = useSavedPromotions();
  const relationships = usePartnerRelationships();

  useEffect(() => {
    if (!isAuthenticated) {
      setMyBusinessId(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const mine = await businessApi.getMyBusiness();
        if (!cancelled) setMyBusinessId(mine.id);
      } catch {
        if (!cancelled) setMyBusinessId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const { send, loading: sendLoading, error: sendError, clearError } = useSendRequest({
    onSuccess: () => {
      setCollaborationTarget(null);
      setActionError(null);
      setSuccessMessage('Collaboration request sent successfully.');
      relationships.refetch();
    },
    onError: (message) => {
      setActionError(message);
    },
  });

  const handleCollaborateClick = (target: MarketplaceCollaborationTarget) => {
    setCollaborationTarget(target);
    setSuccessMessage(null);
    setActionError(null);
    clearError();
  };

  const handleRelationshipCollaborate = async (businessId: number, businessName: string) => {
    const listing = savedBrands.listings.find((l) => l.id === businessId);
    const promotion = listing?.promotions?.[0] ?? null;

    if (promotion) {
      handleCollaborateClick({
        businessId,
        businessName,
        promotion: {
          id: promotion.id,
          category: promotion.category,
          title: promotion.title,
        },
      });
      return;
    }

    const partner = relationships.allPartners.find((p) => p.businessId === businessId);
    if (partner?.firstPromotionSlug) {
      try {
        const promotions = await marketplaceApi.getBusinessPromotions(businessId);
        const match =
          promotions.find((p) => p.slug === partner.firstPromotionSlug) ?? promotions[0];
        if (match) {
          handleCollaborateClick({
            businessId,
            businessName,
            promotion: {
              id: match.id,
              category: match.category,
              title: match.title,
            },
          });
          return;
        }
      } catch {
        setActionError('Could not load promotion for collaboration request.');
        return;
      }
    }

    setActionError('No published promotion available to request collaboration.');
  };

  const handleCollaborationSubmit = async (payload: SendCollaborationPayload) => {
    return send(payload);
  };

  const modalTarget = collaborationTarget;

  const tabError =
    activeTab === 'saved_brands'
      ? savedBrands.error
      : activeTab === 'saved_promotions'
        ? savedPromotions.error
        : relationships.error;

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Connections</h1>
        <p className="text-muted mb-0">
          Your marketplace shortlist and relationship status with other businesses
        </p>
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

      {(actionError || sendError || tabError) && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {actionError ?? sendError ?? tabError}
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setActionError(null);
              clearError();
            }}
            aria-label="Close"
          />
        </div>
      )}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'saved_brands' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved_brands')}
          >
            Saved brands
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'saved_promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved_promotions')}
          >
            Saved promotions
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${activeTab === 'relationships' ? 'active' : ''}`}
            onClick={() => setActiveTab('relationships')}
          >
            Relationships
          </button>
        </li>
      </ul>

      {activeTab === 'saved_brands' && (
        <SavedBrandsList
          listings={savedBrands.listings}
          loading={savedBrands.loading}
          unsavingId={savedBrands.unsavingId}
          isAuthenticated={isAuthenticated}
          myBusinessId={myBusinessId}
          onUnsave={savedBrands.unsave}
          onCollaborateClick={handleCollaborateClick}
        />
      )}

      {activeTab === 'saved_promotions' && (
        <SavedPromotionsList
          items={savedPromotions.items}
          loading={savedPromotions.loading}
          unsavingId={savedPromotions.unsavingId}
          isAuthenticated={isAuthenticated}
          myBusinessId={myBusinessId}
          onUnsave={savedPromotions.unsave}
          onCollaborateClick={handleCollaborateClick}
        />
      )}

      {activeTab === 'relationships' && (
        <RelationshipsList
          partners={relationships.partners}
          loading={relationships.loading}
          filter={relationships.filter}
          onFilterChange={relationships.setFilter}
          onCollaborate={handleRelationshipCollaborate}
        />
      )}

      {modalTarget != null && (
        <CollaborationModal
          show
          onHide={() => setCollaborationTarget(null)}
          receiverBusinessId={modalTarget.businessId}
          receiverBusinessName={modalTarget.businessName}
          targetPromotion={modalTarget.promotion}
          onSubmit={handleCollaborationSubmit}
          loading={sendLoading}
          error={sendError}
          onClearError={clearError}
        />
      )}
    </div>
  );
}
