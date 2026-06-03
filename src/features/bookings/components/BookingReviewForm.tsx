'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import type { BookingReview } from '../types';

interface BookingReviewFormProps {
  collaborationId: number;
  myReview: BookingReview | null;
  canSubmitReview: boolean;
  onSubmit: (collaborationId: number, rating: number, comment: string) => Promise<void>;
  loading?: boolean;
}

export function BookingReviewForm({
  collaborationId,
  myReview,
  canSubmitReview,
  onSubmit,
  loading = false,
}: BookingReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  if (myReview) {
    return (
      <div className="mb-3 p-3 bg-light rounded">
        <h6 className="small fw-semibold mb-2">Your review</h6>
        <div className="d-flex align-items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <Star
              key={value}
              size={18}
              className={value <= myReview.rating ? 'text-warning' : 'text-muted'}
              fill={value <= myReview.rating ? 'currentColor' : 'none'}
            />
          ))}
          <span className="small text-muted ms-1">
            {new Date(myReview.created_at).toLocaleDateString()}
          </span>
        </div>
        {myReview.comment && <p className="small mb-0">{myReview.comment}</p>}
      </div>
    );
  }

  if (!canSubmitReview) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) return;
    await onSubmit(collaborationId, rating, comment.trim());
    setRating(0);
    setComment('');
  };

  const displayRating = hoverRating || rating;

  return (
    <form className="mb-3 p-3 border rounded" onSubmit={handleSubmit}>
      <h6 className="small fw-semibold mb-2">On completion — leave a review</h6>
      <p className="text-muted small mb-2">Rate your experience with this collaboration.</p>
      <div className="d-flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            className="btn btn-link p-0 border-0"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${value} star`}
          >
            <Star
              size={24}
              className={value <= displayRating ? 'text-warning' : 'text-muted'}
              fill={value <= displayRating ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
      <textarea
        className="form-control form-control-sm mb-2"
        rows={2}
        placeholder="Optional comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={2000}
      />
      <button
        type="submit"
        className="btn btn-primary btn-sm"
        disabled={loading || rating < 1}
      >
        {loading ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
