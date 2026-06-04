'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { connectionsApi } from './api';
import type {
  MarketplaceListing,
  PartnerRelationship,
  PartnerRelationshipStatus,
  RelationshipFilter,
  SavedPromotionItem,
} from './types';
import { collaborationApi } from '@/features/collaboration/api';
import { bookingsApi } from '@/features/bookings/api';
import type { CollaborationRequest } from '@/features/collaboration/types';
import type { Booking } from '@/features/bookings/types';

export function useSavedBrands() {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsavingId, setUnsavingId] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectionsApi.getSavedBrands();
      setListings(data);
    } catch {
      setError('Failed to load saved brands. Please try again.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const unsave = useCallback(
    async (businessId: number) => {
      setUnsavingId(businessId);
      setError(null);
      try {
        await connectionsApi.unsaveBrand(businessId);
        setListings((prev) => prev.filter((l) => l.id !== businessId));
      } catch {
        setError('Could not remove saved brand.');
      } finally {
        setUnsavingId(null);
      }
    },
    [],
  );

  return { listings, loading, error, unsavingId, refetch, unsave };
}

export function useSavedPromotions() {
  const [items, setItems] = useState<SavedPromotionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsavingId, setUnsavingId] = useState<number | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectionsApi.getSavedPromotions();
      setItems(data);
    } catch {
      setError('Failed to load saved promotions. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const unsave = useCallback(async (promotionId: number) => {
    setUnsavingId(promotionId);
    setError(null);
    try {
      await connectionsApi.unsavePromotion(promotionId);
      setItems((prev) => prev.filter((i) => i.promotion.id !== promotionId));
    } catch {
      setError('Could not remove saved promotion.');
    } finally {
      setUnsavingId(null);
    }
  }, []);

  return { items, loading, error, unsavingId, refetch, unsave };
}

function partnerFromSaved(listing: MarketplaceListing): PartnerRelationship {
  const slug = listing.promotions?.[0]?.slug ?? null;
  return {
    businessId: listing.id,
    businessName: listing.name,
    category: listing.category,
    logoUrl: listing.logo_url,
    isVerified: listing.is_verified,
    status: 'saved',
    conversationId: null,
    collaborationId: null,
    firstPromotionSlug: slug,
  };
}

function mergePartner(
  map: Map<number, PartnerRelationship>,
  businessId: number,
  patch: Partial<PartnerRelationship> & { status: PartnerRelationship['status'] },
) {
  const existing = map.get(businessId);
  const priority: Record<PartnerRelationshipStatus, number> = {
    active: 4,
    request_received: 3,
    request_sent: 2,
    rejected: 1,
    saved: 0,
  };
  if (existing && priority[existing.status] >= priority[patch.status]) {
    map.set(businessId, {
      ...existing,
      conversationId: patch.conversationId ?? existing.conversationId,
      collaborationId: patch.collaborationId ?? existing.collaborationId,
    });
    return;
  }
  map.set(businessId, {
    businessId,
    businessName: patch.businessName ?? existing?.businessName ?? '',
    category: patch.category ?? existing?.category ?? '',
    logoUrl: patch.logoUrl ?? existing?.logoUrl ?? null,
    isVerified: patch.isVerified ?? existing?.isVerified ?? false,
    status: patch.status,
    conversationId: patch.conversationId ?? existing?.conversationId ?? null,
    collaborationId: patch.collaborationId ?? existing?.collaborationId ?? null,
    firstPromotionSlug: patch.firstPromotionSlug ?? existing?.firstPromotionSlug ?? null,
  });
}

export function usePartnerRelationships() {
  const [filter, setFilter] = useState<RelationshipFilter>('all');
  const [partners, setPartners] = useState<PartnerRelationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [saved, sent, received, bookingsRes] = await Promise.all([
        connectionsApi.getSavedBrands(),
        collaborationApi.getSent('pending'),
        collaborationApi.getReceived('pending'),
        bookingsApi.getBookings({ page: 1, per_page: 100 }),
      ]);

      const bookings: Booking[] = Array.isArray(bookingsRes?.data)
        ? bookingsRes.data
        : Array.isArray(bookingsRes)
          ? bookingsRes
          : [];

      const map = new Map<number, PartnerRelationship>();

      for (const listing of saved) {
        map.set(listing.id, partnerFromSaved(listing));
      }

      const applyRequest = (
        req: CollaborationRequest,
        status: 'request_sent' | 'request_received',
        partnerId: number,
        partnerName: string | null | undefined,
      ) => {
        mergePartner(map, partnerId, {
          businessName: partnerName ?? `Business #${partnerId}`,
          status,
          conversationId: req.conversation_id ?? null,
          collaborationId: req.id,
          firstPromotionSlug: req.target_promotion?.slug ?? null,
        });
      };

      for (const req of sent) {
        applyRequest(req, 'request_sent', req.receiver_business_id, req.receiver_business_name);
      }
      for (const req of received) {
        applyRequest(req, 'request_received', req.sender_business_id, req.sender_business_name);
      }

      for (const booking of bookings) {
        mergePartner(map, booking.partner_business_id, {
          businessName: booking.partner_business_name,
          status: 'active',
          conversationId: booking.conversation_id,
          collaborationId: booking.collaboration_id,
          firstPromotionSlug: booking.target_promotion?.slug ?? null,
        });
      }

      setPartners(Array.from(map.values()).sort((a, b) => a.businessName.localeCompare(b.businessName)));
    } catch {
      setError('Failed to load relationships. Please try again.');
      setPartners([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filtered = useMemo(() => {
    if (filter === 'all') return partners;
    if (filter === 'saved') return partners.filter((p) => p.status === 'saved');
    if (filter === 'pending') {
      return partners.filter(
        (p) => p.status === 'request_sent' || p.status === 'request_received',
      );
    }
    if (filter === 'active') return partners.filter((p) => p.status === 'active');
    return partners;
  }, [partners, filter]);

  return { partners: filtered, allPartners: partners, filter, setFilter, loading, error, refetch };
}
