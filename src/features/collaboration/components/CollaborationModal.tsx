'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/ui/Modal';
import { promotionsApi } from '@/features/promotions/api';
import { marketplaceApi } from '@/features/marketplace/api';
import { promotionCategoryLabel } from '@/features/promotions/constants';
import { PromotionContentPreview } from '@/features/promotions/components/PromotionContentPreview';
import type { Promotion, PromotionCategory } from '@/features/promotions/types';
import type { SendCollaborationPayload } from '../types';
import { CollaborationSenderPromotionPicker } from './CollaborationSenderPromotionPicker';

export interface CollaborationTargetPromotion {
  id: number;
  category: PromotionCategory;
  title: string;
}

export interface CollaborationModalProps {
  show: boolean;
  onHide: () => void;
  receiverBusinessId: number;
  receiverBusinessName: string;
  targetPromotion?: CollaborationTargetPromotion;
  onSubmit: (payload: SendCollaborationPayload) => Promise<boolean | void>;
  loading: boolean;
  error: string | null;
  onClearError: () => void;
}

export function CollaborationModal({
  show,
  onHide,
  receiverBusinessId,
  receiverBusinessName,
  targetPromotion: targetPromotionProp,
  onSubmit,
  loading,
  error,
  onClearError,
}: CollaborationModalProps) {
  const [additionalNote, setAdditionalNote] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [offeredPriceIsCustom, setOfferedPriceIsCustom] = useState(false);
  const [receiverPromotions, setReceiverPromotions] = useState<Promotion[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [senderPromotions, setSenderPromotions] = useState<Promotion[]>([]);
  const [selectedSenderPromoId, setSelectedSenderPromoId] = useState<number | null>(null);
  const [promosLoading, setPromosLoading] = useState(false);

  const effectiveTarget: CollaborationTargetPromotion | null = targetPromotionProp
    ? targetPromotionProp
    : selectedTargetId
      ? (() => {
          const p = receiverPromotions.find((x) => x.id === selectedTargetId);
          return p ? { id: p.id, category: p.category, title: p.title } : null;
        })()
      : null;

  const category = effectiveTarget?.category;
  const receiverTargetPromo = useMemo(
    () => receiverPromotions.find((p) => p.id === effectiveTarget?.id) ?? null,
    [receiverPromotions, effectiveTarget?.id],
  );

  const selectedSenderPromo = useMemo(
    () => senderPromotions.find((p) => p.id === selectedSenderPromoId) ?? null,
    [senderPromotions, selectedSenderPromoId],
  );

  useEffect(() => {
    if (!show) return;

    setAdditionalNote('');
    setOfferedPrice('');
    setOfferedPriceIsCustom(false);
    onClearError();

    if (targetPromotionProp) {
      setSelectedTargetId(targetPromotionProp.id);
    } else {
      setSelectedTargetId(null);
    }
    setSelectedSenderPromoId(null);
    setSenderPromotions([]);

    let cancelled = false;
    setPromosLoading(true);

    (async () => {
      try {
        const promos = await marketplaceApi.getBusinessPromotions(receiverBusinessId);
        if (!cancelled) {
          setReceiverPromotions(promos);
          if (!targetPromotionProp && promos.length === 1) {
            setSelectedTargetId(promos[0].id);
          }
        }
      } catch {
        if (!cancelled) setReceiverPromotions([]);
      } finally {
        if (!cancelled) setPromosLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [show, receiverBusinessId, targetPromotionProp, onClearError]);

  useEffect(() => {
    if (!show || category !== 'cross') {
      if (!show) return;
      setSenderPromotions([]);
      setSelectedSenderPromoId(null);
      return;
    }

    let cancelled = false;
    setPromosLoading(true);

    promotionsApi
      .list('cross', 'published')
      .then((mine) => {
        if (!cancelled) {
          setSenderPromotions(mine);
          if (mine.length > 0) {
            setSelectedSenderPromoId(mine[0].id);
          } else {
            setSelectedSenderPromoId(null);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSenderPromotions([]);
          setSelectedSenderPromoId(null);
        }
      })
      .finally(() => {
        if (!cancelled) setPromosLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [show, category]);

  const isCross = category === 'cross';
  const isPaid = category === 'paid';
  const hasSenderPromo = senderPromotions.length > 0;
  const senderBlocked = isCross && !hasSenderPromo && !promosLoading;

  const paidPriceValid =
    offeredPriceIsCustom || (offeredPrice !== '' && !Number.isNaN(Number(offeredPrice)));

  const canSubmit =
    effectiveTarget &&
    !loading &&
    !promosLoading &&
    (isCross
      ? selectedSenderPromoId != null && hasSenderPromo && !senderBlocked
      : isPaid
        ? paidPriceValid
        : false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !effectiveTarget) return;
    if (isCross && selectedSenderPromoId == null) return;

    const payload: SendCollaborationPayload = {
      receiverBusinessId,
      targetPromotionId: effectiveTarget.id,
    };

    if (isCross) {
      payload.senderPromotionId = selectedSenderPromoId!;
    }

    const note = additionalNote.trim();
    if (note) payload.message = note;

    if (isPaid) {
      payload.offeredPriceIsCustom = offeredPriceIsCustom;
      if (!offeredPriceIsCustom) {
        payload.offeredPrice = Number(offeredPrice);
      }
    }

    const succeeded = await onSubmit(payload);
    if (succeeded !== false) {
      onHide();
    }
  };

  const footer = (
    <>
      <button type="button" className="btn btn-secondary" onClick={onHide} disabled={loading}>
        Cancel
      </button>
      <button
        type="submit"
        form="collaboration-form"
        className="btn btn-primary"
        disabled={!canSubmit}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            Sending…
          </>
        ) : (
          'Send request'
        )}
      </button>
    </>
  );

  const title = effectiveTarget
    ? `Collaborate on: ${effectiveTarget.title}`
    : `Collaborate with ${receiverBusinessName}`;

  return (
    <Modal show={show} onHide={onHide} title={title} footer={footer} size="lg">
      <form id="collaboration-form" onSubmit={handleSubmit}>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <section className="mb-4">
          <h6 className="small text-muted text-uppercase mb-2">Collaborating on</h6>
          {!targetPromotionProp && receiverPromotions.length > 1 && (
            <div className="mb-2">
              <select
                className="form-select form-select-sm"
                value={selectedTargetId ?? ''}
                onChange={(e) => setSelectedTargetId(Number(e.target.value))}
                disabled={loading || promosLoading}
              >
                <option value="">Select their promotion…</option>
                {receiverPromotions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({promotionCategoryLabel(p.category)})
                  </option>
                ))}
              </select>
            </div>
          )}
          {receiverTargetPromo ? (
            <PromotionContentPreview promotion={receiverTargetPromo} compact showTitle />
          ) : (
            <p className="small text-muted mb-0">
              {promosLoading ? 'Loading…' : 'Select a promotion to collaborate on.'}
            </p>
          )}
        </section>

        {isCross && (
          <section className="mb-4">
            <h6 className="small text-muted text-uppercase mb-2">
              Your {promotionCategoryLabel('cross')}
            </h6>
            <CollaborationSenderPromotionPicker
              promotions={senderPromotions}
              selectedId={selectedSenderPromoId}
              onSelect={setSelectedSenderPromoId}
              loading={promosLoading}
              disabled={loading}
            />
          </section>
        )}

        {isCross && selectedSenderPromo && !senderBlocked && (
          <section className="mb-4">
            <h6 className="small text-muted text-uppercase mb-2">Your promotion preview</h6>
            <PromotionContentPreview promotion={selectedSenderPromo} compact />
          </section>
        )}

        {!senderBlocked && (
          <div className="mb-3">
            <label htmlFor="collab-note" className="form-label">
              Additional note <span className="text-muted fw-normal">(optional)</span>
            </label>
            <textarea
              id="collab-note"
              className="form-control"
              rows={2}
              value={additionalNote}
              onChange={(e) => setAdditionalNote(e.target.value)}
              placeholder="Any extra context for the receiver…"
              maxLength={500}
              disabled={loading || !effectiveTarget}
            />
            <div className="form-text">{additionalNote.length} / 500</div>
          </div>
        )}

        {isPaid && !senderBlocked && (
          <div className="mb-0">
            <label htmlFor="offered-price" className="form-label">
              Price you offer for this marketing campaign
            </label>
            <div className="input-group mb-2">
              <span className="input-group-text">₹</span>
              <input
                id="offered-price"
                type="number"
                className="form-control"
                min={0}
                step="0.01"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                disabled={loading || offeredPriceIsCustom}
                required={!offeredPriceIsCustom}
              />
            </div>
            <div className="form-check">
              <input
                id="custom-quote"
                type="checkbox"
                className="form-check-input"
                checked={offeredPriceIsCustom}
                onChange={(e) => setOfferedPriceIsCustom(e.target.checked)}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="custom-quote">
                Custom quote (price to be negotiated)
              </label>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
