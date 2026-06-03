'use client';

import { useMemo } from 'react';
import type { Business, BusinessServiceItem } from '../api';
import { useServices } from './useServices';

/**
 * Prefer API-provided services; fall back to catalog lookup by service_ids.
 */
export function useBusinessServicesDisplay(business: Business): BusinessServiceItem[] {
  const { enabledServices } = useServices();

  return useMemo(() => {
    if (business.services && business.services.length > 0) {
      return business.services;
    }
    const ids = business.service_ids ?? [];
    if (ids.length === 0) {
      return [];
    }
    return enabledServices
      .filter((s) => ids.includes(s.id))
      .map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        category_name: s.category_name,
      }));
  }, [business.services, business.service_ids, enabledServices]);
}
