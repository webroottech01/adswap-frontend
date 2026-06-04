'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { businessApi, Business } from '@/features/business/api';
import { promotionsApi } from '../api';
import { usePromotionMutations, usePromotions } from '../hooks';
import type {
  CreatePromotionPayload,
  CrossPromotionDetails,
  PaidPromotionDetails,
  Promotion,
  PromotionCategory,
  PromotionFormData,
  PromotionStatusFilter,
} from '../types';
import { PromotionCard } from './PromotionCard';
import { PromotionFormModal } from './PromotionFormModal';

const CATEGORY_TABS: { key: PromotionCategory; label: string }[] = [
  { key: 'cross', label: 'Cross Promotions' },
  { key: 'paid', label: 'Paid Promotions' },
];

const STATUS_TABS: { key: PromotionStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'published', label: 'Published' },
  { key: 'paused', label: 'Paused' },
];

export function PromotionsPage() {
  const [categoryFilter, setCategoryFilter] = useState<PromotionCategory>('cross');
  const [statusFilter, setStatusFilter] = useState<PromotionStatusFilter>('all');
  const [myBusiness, setMyBusiness] = useState<Business | null>(null);
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);

  const { data, loading, error, refetch } = usePromotions(categoryFilter, statusFilter);
  const mutations = usePromotionMutations({
    onSuccess: () => {
      refetch();
      setModalOpen(false);
      setEditingPromotion(null);
    },
  });

  useEffect(() => {
    businessApi
      .getMyBusiness()
      .then((b) => {
        setMyBusiness(b);
        setHasBusiness(true);
      })
      .catch(() => {
        setMyBusiness(null);
        setHasBusiness(false);
      });
  }, []);

  const canCreatePromotions =
    Boolean(myBusiness?.is_provider) &&
    myBusiness?.promotion_intent !== 'none' &&
    myBusiness?.promotion_intent != null;

  const visibleCategoryTabs = useMemo(() => {
    const intent = myBusiness?.promotion_intent;
    if (!intent || intent === 'none') return [];
    if (intent === 'cross') return CATEGORY_TABS.filter((t) => t.key === 'cross');
    if (intent === 'paid') return CATEGORY_TABS.filter((t) => t.key === 'paid');
    return CATEGORY_TABS;
  }, [myBusiness?.promotion_intent]);

  useEffect(() => {
    if (visibleCategoryTabs.length > 0 && !visibleCategoryTabs.some((t) => t.key === categoryFilter)) {
      setCategoryFilter(visibleCategoryTabs[0].key);
    }
  }, [visibleCategoryTabs, categoryFilter]);

  const openCreate = () => {
    setEditingPromotion(null);
    setModalOpen(true);
    mutations.clearError();
  };

  const openEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setModalOpen(true);
    mutations.clearError();
  };

  const buildPayload = (
    formData: PromotionFormData,
    category: PromotionCategory,
  ): CreatePromotionPayload => {
    if (category === 'paid') {
      return {
        category: 'paid',
        title: formData.title,
        details: formData.details as PaidPromotionDetails,
      };
    }
    return {
      category: 'cross',
      title: formData.title,
      details: formData.details as CrossPromotionDetails,
    };
  };

  const handleFormSubmit = async (formData: PromotionFormData) => {
    if (editingPromotion) {
      await mutations.update(
        editingPromotion.id,
        {
          title: formData.title,
          details: formData.details,
        },
        formData.files,
      );
    } else {
      const payload = buildPayload(formData, categoryFilter);
      await mutations.create(payload, formData.files);
    }
  };

  const handleDeleteMedia = async (mediaId: number) => {
    if (!editingPromotion) return;
    setDeletingMediaId(mediaId);
    const ok = await mutations.deleteMedia(editingPromotion.id, mediaId);
    setDeletingMediaId(null);
    if (ok) {
      const updated = await promotionsApi.get(editingPromotion.id);
      setEditingPromotion(updated);
      refetch();
    }
  };

  if (hasBusiness === null) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    );
  }

  if (hasBusiness && !canCreatePromotions) {
    return (
      <div className="container-fluid py-4">
        <h1 className="h3 mb-3">Promotions</h1>
        <div className="card">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-3">
              Complete your Promotion Intent in your business profile to offer cross or paid promotions.
            </p>
            <Link href="/business" className="btn btn-primary">
              Update Business Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (hasBusiness === false) {
    return (
      <div className="container-fluid py-4">
        <h1 className="h3 mb-3">Promotions</h1>
        <div className="card">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-3">
              Set up your business profile before creating promotion opportunities.
            </p>
            <Link href="/business" className="btn btn-primary">
              Go to My Business
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayError = !modalOpen ? error || mutations.error : null;
  const isPaid = categoryFilter === 'paid';

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Promotions</h1>
          <p className="text-muted mb-0">
            {isPaid
              ? 'Paid placement packages you offer to partner businesses.'
              : 'Cross-promotion opportunities you offer to partner businesses.'}
          </p>
        </div>
        {canCreatePromotions && (
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            <Plus size={18} className="me-1" />
            {isPaid ? 'Create paid package' : 'Create cross promotion'}
          </button>
        )}
      </div>

      {displayError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {displayError}
          <button
            type="button"
            className="btn-close"
            onClick={() => mutations.clearError()}
            aria-label="Close"
          />
        </div>
      )}

      <ul className="nav nav-pills mb-3 gap-2">
        {visibleCategoryTabs.map((tab) => (
          <li key={tab.key} className="nav-item">
            <button
              type="button"
              className={`nav-link ${categoryFilter === tab.key ? 'active' : ''}`}
              onClick={() => setCategoryFilter(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <ul className="nav nav-tabs mb-4">
        {STATUS_TABS.map((tab) => (
          <li key={tab.key} className="nav-item">
            <button
              type="button"
              className={`nav-link ${statusFilter === tab.key ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.key)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>

      {loading && data.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-3">
              {statusFilter === 'all'
                ? `You have not created any ${isPaid ? 'paid' : 'cross'} promotions yet.`
                : `No ${statusFilter} ${isPaid ? 'paid' : 'cross'} promotions.`}
            </p>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              {isPaid ? 'Create your first paid package' : 'Create your first cross promotion'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {data.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              actionLoading={mutations.loading}
              onEdit={openEdit}
              onPublish={(id) => mutations.publish(id)}
              onPause={(id) => mutations.pause(id)}
              onDelete={(id) => mutations.remove(id)}
            />
          ))}
        </div>
      )}

      <PromotionFormModal
        show={modalOpen}
        category={categoryFilter}
        promotion={editingPromotion}
        loading={mutations.loading}
        submitError={mutations.error}
        fieldErrors={mutations.fieldErrors}
        onClose={() => {
          if (!mutations.loading) {
            setModalOpen(false);
            setEditingPromotion(null);
          }
        }}
        onSubmit={handleFormSubmit}
        onDeleteMedia={editingPromotion ? handleDeleteMedia : undefined}
        deletingMediaId={deletingMediaId}
      />
    </div>
  );
}
