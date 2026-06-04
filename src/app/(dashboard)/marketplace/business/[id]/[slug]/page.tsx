'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuthSession } from '@/features/auth/public';
import { businessApi } from '@/features/business/api';
import { VisitorActionBar } from '@/features/business/components/profile/VisitorActionBar';
import { marketplaceApi } from '@/features/marketplace/api';
import { MarketplaceBusinessSummaryHeader } from '@/features/marketplace/components/MarketplaceBusinessSummaryHeader';
import type { MarketplacePromotionDetail } from '@/features/marketplace/types';
import { PromotionContentPreview } from '@/features/promotions/components/PromotionContentPreview';
import { CollaborationModal, useSendRequest, collaborationApi } from '@/features/collaboration';
import type { SendCollaborationPayload } from '@/features/collaboration/types';

export default function MarketplacePromotionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = Number(params.id);
  const slug = typeof params.slug === 'string' ? params.slug : '';

  const { isAuthenticated } = useAuthSession();

  const [detail, setDetail] = useState<MarketplacePromotionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myBusinessId, setMyBusinessId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [promotionSaved, setPromotionSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savePromotionLoading, setSavePromotionLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const detailPath = `/marketplace/business/${businessId}/${slug}`;
  const isOwnBusiness = myBusinessId != null && myBusinessId === businessId;

  useEffect(() => {
    if (isOwnBusiness) {
      router.replace('/business');
    }
  }, [isOwnBusiness, router]);

  useEffect(() => {
    if (!Number.isFinite(businessId) || !slug) {
      setError('Invalid promotion link.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    marketplaceApi
      .getPromotionDetail(businessId, slug)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError('Promotion not found or not available on the marketplace.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [businessId, slug]);

  useEffect(() => {
    if (!isAuthenticated) {
      setMyBusinessId(null);
      setSaved(false);
      setPromotionSaved(false);
      setConversationId(null);
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

      try {
        const isSaved = await marketplaceApi.checkSavedBrand(businessId);
        if (!cancelled) setSaved(isSaved);
      } catch {
        if (!cancelled) setSaved(false);
      }

      try {
        const ctx = await collaborationApi.getContext(businessId);
        if (!cancelled && ctx.can_message && ctx.conversation_id) {
          setConversationId(ctx.conversation_id);
        } else if (!cancelled) {
          setConversationId(null);
        }
      } catch {
        if (!cancelled) setConversationId(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, businessId]);

  useEffect(() => {
    if (!isAuthenticated || !detail?.promotion?.id) {
      setPromotionSaved(false);
      return;
    }

    let cancelled = false;
    marketplaceApi
      .checkSavedPromotion(detail.promotion.id)
      .then((isSaved) => {
        if (!cancelled) setPromotionSaved(isSaved);
      })
      .catch(() => {
        if (!cancelled) setPromotionSaved(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, detail?.promotion?.id]);

  const { send, loading: sendLoading, error: sendError, clearError } = useSendRequest({
    onSuccess: () => {
      setShowCollaborationModal(false);
      setActionError(null);
      setSuccessMessage('Collaboration request sent successfully.');
    },
    onError: (message) => {
      setActionError(message);
    },
  });

  const handleToggleSave = async () => {
    if (!isAuthenticated || isOwnBusiness) return;
    setSaveLoading(true);
    setActionError(null);
    try {
      if (saved) {
        await marketplaceApi.unsaveBrand(businessId);
        setSaved(false);
      } else {
        await marketplaceApi.saveBrand(businessId);
        setSaved(true);
      }
    } catch {
      setActionError('Could not update saved brand. Make sure you have a business profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleSavePromotion = async () => {
    if (!isAuthenticated || isOwnBusiness || !detail?.promotion) return;
    setSavePromotionLoading(true);
    setActionError(null);
    try {
      if (promotionSaved) {
        await marketplaceApi.unsavePromotion(detail.promotion.id);
        setPromotionSaved(false);
      } else {
        await marketplaceApi.savePromotion(detail.promotion.id);
        setPromotionSaved(true);
      }
    } catch {
      setActionError('Could not update saved promotion.');
    } finally {
      setSavePromotionLoading(false);
    }
  };

  const handleLoginRequired = () => {
    router.push(`/login?next=${encodeURIComponent(detailPath)}`);
  };

  const handleCollaborationSubmit = async (payload: SendCollaborationPayload) => {
    return send(payload);
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="container-fluid py-4">
        <Link href="/marketplace" className="btn btn-link text-decoration-none ps-0 mb-3">
          <ArrowLeft size={16} className="me-1" />
          Back to marketplace
        </Link>
        <div className="alert alert-warning">{error ?? 'Promotion not found.'}</div>
      </div>
    );
  }

  const { business, promotion } = detail;

  return (
    <div className="container-fluid py-4">
      <Link href="/marketplace" className="btn btn-link text-decoration-none ps-0 mb-3">
        <ArrowLeft size={16} className="me-1" />
        Back to marketplace
      </Link>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show">
          {successMessage}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage(null)}
            aria-label="Close"
          />
        </div>
      )}

      {(actionError || sendError) && (
        <div className="alert alert-danger alert-dismissible fade show">
          {actionError ?? sendError}
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

      <MarketplaceBusinessSummaryHeader business={business} promotionTitle={promotion.title} />

      <VisitorActionBar
        businessName={business.name}
        saved={saved}
        saveLoading={saveLoading}
        promotionSaved={promotionSaved}
        savePromotionLoading={savePromotionLoading}
        collaborateLoading={sendLoading}
        isOwnBusiness={isOwnBusiness}
        isAuthenticated={isAuthenticated}
        onMessage={
          conversationId != null
            ? () => router.push(`/messages/${conversationId}`)
            : undefined
        }
        onCollaborate={() => {
          if (!isAuthenticated) {
            handleLoginRequired();
            return;
          }
          setShowCollaborationModal(true);
          clearError();
        }}
        onToggleSave={handleToggleSave}
        onToggleSavePromotion={handleToggleSavePromotion}
        onLoginRequired={handleLoginRequired}
      />

      <div className="mt-3">
        <PromotionContentPreview promotion={promotion} showTitle />
      </div>

      {showCollaborationModal && (
        <CollaborationModal
          show={showCollaborationModal}
          onHide={() => setShowCollaborationModal(false)}
          receiverBusinessId={businessId}
          receiverBusinessName={business.name}
          targetPromotion={{
            id: promotion.id,
            category: promotion.category,
            title: promotion.title,
          }}
          onSubmit={handleCollaborationSubmit}
          loading={sendLoading}
          error={sendError}
          onClearError={clearError}
        />
      )}
    </div>
  );
}
