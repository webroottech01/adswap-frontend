'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import type { Booking } from '../types';
import { bookingsApi } from '../api';
import { promotionCategoryLabel } from '@/features/promotions/constants';
import { PromotionContentPreview } from '@/features/promotions/components/PromotionContentPreview';
import { PromotionValidityBar } from '@/features/marketplace/components/PromotionValidityBar';
import { BookingScheduleProgress } from './BookingScheduleProgress';
import { BookingDeliverables } from './BookingDeliverables';
import { BookingReviewForm } from './BookingReviewForm';

interface BookingCardProps {
  booking: Booking;
  onReviewSubmitted?: () => void;
}

export function BookingCard({ booking, onReviewSubmitted }: BookingCardProps) {
  const router = useRouter();
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const acceptedDate = new Date(booking.accepted_at);
  const acceptedLabel = Number.isNaN(acceptedDate.getTime())
    ? booking.accepted_at
    : acceptedDate.toLocaleDateString();

  const handleViewChat = () => {
    if (booking.conversation_id) {
      router.push(`/messages/${booking.conversation_id}`);
    }
  };

  const handleViewBusiness = () => {
    router.push(`/marketplace?business_id=${booking.partner_business_id}`);
  };

  const handleSubmitReview = async (collaborationId: number, rating: number, comment: string) => {
    setReviewLoading(true);
    setReviewError(null);
    try {
      await bookingsApi.submitReview(collaborationId, {
        rating,
        comment: comment || undefined,
      });
      onReviewSubmitted?.();
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message ||
            'Failed to submit review'
          : 'Failed to submit review';
      setReviewError(message);
    } finally {
      setReviewLoading(false);
    }
  };

  const category = booking.promotion_category ?? booking.provider_type;
  const categoryLabel = promotionCategoryLabel(category);

  return (
    <Card className="h-100 mb-3">
      <div className="card-body d-flex flex-column">
        <div className="mb-2 d-flex justify-content-between align-items-start gap-2">
          <div>
            <h5 className="card-title mb-1">{booking.partner_business_name}</h5>
            <small className="text-muted d-block">Accepted on {acceptedLabel}</small>
          </div>
          <Badge variant={category === 'paid' ? 'warning' : 'success'}>
            {categoryLabel}
          </Badge>
        </div>

        {booking.target_promotion && (
          <div className="mb-3">
            <h6 className="small text-muted text-uppercase mb-2">Accepted promotion</h6>
            <PromotionValidityBar promotion={booking.target_promotion} />
            <div className="mt-2">
              <PromotionContentPreview promotion={booking.target_promotion} compact showTitle />
            </div>
          </div>
        )}

        {category === 'paid' && (
          <p className="small mb-2">
            <strong>Agreed price:</strong>{' '}
            {booking.offered_price_is_custom
              ? 'Custom quote'
              : booking.offered_price != null
                ? `₹${booking.offered_price}`
                : '—'}
          </p>
        )}

        {booking.collaboration_message?.trim() && (
          <p className="small text-muted mb-2">
            <strong>Request note:</strong> {booking.collaboration_message}
          </p>
        )}

        <BookingScheduleProgress
          daysRemaining={booking.days_remaining}
          scheduleProgressPercent={booking.schedule_progress_percent}
          periodEndsAt={booking.period_ends_at}
        />

        <BookingDeliverables deliverables={booking.deliverables} />

        <div className="mb-3">
          <h6 className="small fw-semibold mb-2">Proof of execution</h6>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled
              title="Coming soon"
            >
              Request proof (you)
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              disabled
              title="Coming soon"
            >
              Request proof (partner)
            </button>
          </div>
          <small className="text-muted d-block mt-1">Proof requests will be available soon.</small>
        </div>

        {reviewError && (
          <div className="alert alert-danger py-2 small mb-2">{reviewError}</div>
        )}

        <BookingReviewForm
          collaborationId={booking.collaboration_id}
          myReview={booking.my_review}
          canSubmitReview={booking.can_submit_review}
          onSubmit={handleSubmitReview}
          loading={reviewLoading}
        />

        <div className="mt-auto pt-3 border-top d-flex flex-column flex-sm-row gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm w-100"
            onClick={handleViewBusiness}
          >
            View Business Profile
          </button>
          {booking.conversation_id && (
            <button
              type="button"
              className="btn btn-primary btn-sm w-100"
              onClick={handleViewChat}
            >
              View Chat
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
