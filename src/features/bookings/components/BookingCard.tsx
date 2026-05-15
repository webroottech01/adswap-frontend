'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/ui/Card';
import { Badge } from '@/ui/Badge';
import type { Booking } from '../types';

interface BookingCardProps {
  booking: Booking;
}

export function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();

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

  const providerLabel = booking.provider_type === 'paid' ? 'Paid collaboration' : 'Cross-promotion';

  return (
    <Card className="h-100">
      <div className="card-body d-flex flex-column">
        <div className="mb-2 d-flex justify-content-between align-items-start gap-2">
          <div>
            <h5 className="card-title mb-1">{booking.partner_business_name}</h5>
            <small className="text-muted d-block">Accepted on {acceptedLabel}</small>
          </div>
          <Badge variant={booking.provider_type === 'paid' ? 'primary' : 'secondary'}>
            {providerLabel}
          </Badge>
        </div>

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

