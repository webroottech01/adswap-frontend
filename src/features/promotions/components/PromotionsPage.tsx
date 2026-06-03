'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { businessApi } from '@/features/business/api';
import { promotionsApi } from '../api';
import { usePromotionMutations, usePromotions } from '../hooks';
import type { Promotion, PromotionStatusFilter } from '../types';
import { PromotionCard } from './PromotionCard';
import { PromotionFormModal } from './PromotionFormModal';

const TABS: { key: PromotionStatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'published', label: 'Published' },
  { key: 'paused', label: 'Paused' },
];

export function PromotionsPage() {
  const [statusFilter, setStatusFilter] = useState<PromotionStatusFilter>('all');
  const [hasBusiness, setHasBusiness] = useState<boolean | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [deletingMediaId, setDeletingMediaId] = useState<number | null>(null);

  const { data, loading, error, refetch } = usePromotions(statusFilter);
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
      .then(() => setHasBusiness(true))
      .catch(() => setHasBusiness(false));
  }, []);

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

  const handleFormSubmit = async (formData: {
    title: string;
    description: string;
    files: File[];
  }) => {
    if (editingPromotion) {
      await mutations.update(
        editingPromotion.id,
        {
          title: formData.title,
          description: formData.description || undefined,
        },
        formData.files,
      );
    } else {
      await mutations.create(
        {
          title: formData.title,
          description: formData.description || undefined,
        },
        formData.files,
      );
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

  const displayError = error || mutations.error;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Promotions</h1>
          <p className="text-muted mb-0">
            Promotion opportunities you offer to partner businesses — e.g. coupon placement,
            Instagram story features, and more.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} className="me-1" />
          Create promotion
        </button>
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

      <ul className="nav nav-tabs mb-4">
        {TABS.map((tab) => (
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
                ? 'You have not created any promotions yet.'
                : `No ${statusFilter} promotions.`}
            </p>
            <button type="button" className="btn btn-primary" onClick={openCreate}>
              Create your first promotion
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
        promotion={editingPromotion}
        loading={mutations.loading}
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
