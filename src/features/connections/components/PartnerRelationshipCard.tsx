'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Handshake, Calendar, ExternalLink } from 'lucide-react';
import type { PartnerRelationship } from '../types';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';

const STATUS_LABELS: Record<PartnerRelationship['status'], string> = {
  saved: 'Saved',
  request_sent: 'Request sent',
  request_received: 'Request received',
  active: 'Active partner',
  rejected: 'Rejected',
};

const STATUS_BADGE: Record<PartnerRelationship['status'], string> = {
  saved: 'bg-secondary',
  request_sent: 'bg-info text-dark',
  request_received: 'bg-warning text-dark',
  active: 'bg-success',
  rejected: 'bg-danger',
};

interface PartnerRelationshipCardProps {
  partner: PartnerRelationship;
  onCollaborate?: (businessId: number, businessName: string) => void;
}

export function PartnerRelationshipCard({ partner, onCollaborate }: PartnerRelationshipCardProps) {
  const router = useRouter();
  const profileHref =
    partner.firstPromotionSlug != null
      ? `/marketplace/business/${partner.businessId}/${partner.firstPromotionSlug}`
      : `/marketplace`;

  return (
    <Card className="h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start gap-3 mb-3">
          {partner.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={partner.logoUrl}
              alt=""
              className="rounded border flex-shrink-0"
              width={48}
              height={48}
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded border bg-light flex-shrink-0 d-flex align-items-center justify-content-center text-muted"
              style={{ width: 48, height: 48 }}
            >
              {partner.businessName.charAt(0)}
            </div>
          )}
          <div className="flex-grow-1 min-w-0">
            <h6 className="mb-1 text-truncate">{partner.businessName}</h6>
            <p className="small text-muted mb-1">{partner.category}</p>
            <span className={`badge ${STATUS_BADGE[partner.status]}`}>
              {STATUS_LABELS[partner.status]}
            </span>
            {partner.isVerified && (
              <span className="badge bg-primary ms-1">Verified</span>
            )}
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mt-auto">
          {partner.status === 'saved' && onCollaborate && (
            <Button
              variant="primary"
              size="sm"
              icon={Handshake}
              onClick={() => onCollaborate(partner.businessId, partner.businessName)}
            >
              Send request
            </Button>
          )}
          {(partner.status === 'request_sent' || partner.status === 'request_received') && (
            <Link href="/collaborations" className="btn btn-outline-primary btn-sm">
              View requests
            </Link>
          )}
          {partner.status === 'active' && (
            <Link href="/bookings" className="btn btn-outline-success btn-sm">
              <Calendar size={16} className="me-1" />
              View booking
            </Link>
          )}
          {partner.conversationId != null && (
            <Button
              variant="secondary"
              outline
              size="sm"
              icon={MessageCircle}
              onClick={() => router.push(`/messages/${partner.conversationId}`)}
            >
              Message
            </Button>
          )}
          <Link href={profileHref} className="btn btn-outline-secondary btn-sm">
            <ExternalLink size={16} className="me-1" />
            Profile
          </Link>
        </div>
      </div>
    </Card>
  );
}
