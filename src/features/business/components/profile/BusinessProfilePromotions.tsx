'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, Plus } from 'lucide-react';
import { promotionsApi } from '@/features/promotions/api';
import { marketplaceApi } from '@/features/marketplace/api';
import type { Promotion } from '@/features/promotions/types';
import type { Business, BusinessServiceItem } from '../../api';
import { BusinessProfileSection } from './BusinessProfileSection';
import { PromotionOpportunityCard } from './PromotionOpportunityCard';

interface BusinessProfilePromotionsProps {
  business: Business;
  showOwnerActions?: boolean;
  mode?: 'owner' | 'public';
  publicBusinessId?: number;
}

function ServicesByCategory({ services }: { services: BusinessServiceItem[] }) {
  const grouped = services.reduce<Record<string, BusinessServiceItem[]>>((acc, s) => {
    const key = s.category_name || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="pt-3 mt-3 border-top">
      <h6 className="small text-muted text-uppercase mb-3">Advertising formats you offer</h6>
      {Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([category, items]) => (
          <div key={category} className="mb-3">
            <span className="small fw-semibold">{category}</span>
            <div className="d-flex flex-wrap gap-2 mt-1">
              {items.map((s) => (
                <span key={s.id} className="badge bg-white text-dark border">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

function PromotionGroup({
  title,
  promotions,
}: {
  title: string;
  promotions: Promotion[];
}) {
  if (promotions.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="small text-muted text-uppercase mb-0">{title}</h6>
        <span className="badge bg-secondary">{promotions.length}</span>
      </div>
      <div className="row g-4">
        {promotions.map((p) => (
          <div key={p.id} className="col-12 col-md-6 col-xl-4">
            <PromotionOpportunityCard promotion={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BusinessProfilePromotions({
  business,
  showOwnerActions = false,
  mode = 'owner',
  publicBusinessId,
}: BusinessProfilePromotionsProps) {
  const isPublic = mode === 'public';
  const shouldLoadPromos = showOwnerActions || (isPublic && publicBusinessId != null);

  const [crossPromos, setCrossPromos] = useState<Promotion[]>([]);
  const [paidPromos, setPaidPromos] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(shouldLoadPromos);
  const [loadError, setLoadError] = useState(false);

  const services = business.services ?? [];

  useEffect(() => {
    if (!shouldLoadPromos) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setLoadError(false);

    const loadPromise = isPublic && publicBusinessId
      ? marketplaceApi.getBusinessPromotions(publicBusinessId).then((all) => {
          const cross = all.filter((p) => p.category === 'cross');
          const paid = all.filter((p) => p.category === 'paid');
          return [cross, paid] as const;
        })
      : Promise.all([
          promotionsApi.list('cross', 'published'),
          promotionsApi.list('paid', 'published'),
        ]);

    loadPromise
      .then(([cross, paid]) => {
        if (!cancelled) {
          setCrossPromos(cross);
          setPaidPromos(paid);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadError(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shouldLoadPromos, isPublic, publicBusinessId]);

  const hasPromos = crossPromos.length > 0 || paidPromos.length > 0;
  const hasServices = services.length > 0;

  if (!showOwnerActions && !isPublic && !hasServices) {
    return null;
  }

  if (isPublic && !loading && !loadError && !hasPromos && !hasServices) {
    return null;
  }

  return (
    <BusinessProfileSection
      id="promotions"
      title="Promotion opportunities"
      icon={Megaphone}
      emphasized
    >
      {showOwnerActions && (
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <p className="text-muted small mb-0">
            Published listings partners see when exploring collaborations.
          </p>
          <Link href="/inventory" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1">
            <Plus size={16} />
            Manage promotions
          </Link>
        </div>
      )}

      {(showOwnerActions || isPublic) && (
        <>
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading promotions…</span>
              </div>
            </div>
          )}

          {loadError && !loading && (
            <div className="alert alert-light border mb-0">
              Unable to load published promotions. Try refreshing the page.
            </div>
          )}

          {!loading && !loadError && hasPromos && (
            <>
              <PromotionGroup title="Cross promotions" promotions={crossPromos} />
              <PromotionGroup title="Paid packages" promotions={paidPromos} />
            </>
          )}

          {!loading && !loadError && !hasPromos && showOwnerActions && (
            <div className="text-center py-5 px-3 border rounded bg-white">
              <Megaphone size={40} className="text-muted mb-3 opacity-50" />
              <h6 className="mb-2">No published promotions yet</h6>
              <p className="text-muted small mb-3">
                Publish cross or paid packages with photos so partners can see what you offer.
              </p>
              <Link href="/inventory" className="btn btn-primary btn-sm">
                Create promotions
              </Link>
            </div>
          )}

          {!loading && !loadError && !hasPromos && isPublic && (
            <p className="text-muted small mb-0">No published promotions yet.</p>
          )}
        </>
      )}

      {hasServices && <ServicesByCategory services={services} />}
    </BusinessProfileSection>
  );
}
