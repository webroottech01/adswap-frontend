'use client';

import type { Business } from '../../api';
import { useBusinessServicesDisplay } from '../../hooks/useBusinessServicesDisplay';
import {
  BusinessProfileHeader,
  BusinessProfileAbout,
  BusinessProfileAudience,
  BusinessProfilePromotions,
  BusinessProfileCollaboration,
  BusinessProfileBrandAssets,
  BusinessProfileTrust,
} from './index';

interface BusinessProfileViewProps {
  business: Business;
  mode?: 'owner' | 'public';
  onEdit?: () => void;
  showOwnerActions?: boolean;
  publicBusinessId?: number;
}

/** Profile sections with resolved service names. */
export function BusinessProfileView({
  business,
  mode = 'owner',
  onEdit,
  showOwnerActions = false,
  publicBusinessId,
}: BusinessProfileViewProps) {
  const isPublic = mode === 'public';
  const services = useBusinessServicesDisplay(business);
  const businessWithServices: Business = { ...business, services };
  const ownerActions = !isPublic && showOwnerActions;

  return (
    <>
      <BusinessProfileHeader
        business={businessWithServices}
        onEdit={isPublic ? undefined : onEdit}
        showOwnerActions={ownerActions}
      />
      <BusinessProfileAbout business={businessWithServices} />
      <BusinessProfileAudience business={businessWithServices} />
      <BusinessProfilePromotions
        business={businessWithServices}
        showOwnerActions={ownerActions}
        mode={mode}
        publicBusinessId={publicBusinessId ?? (isPublic ? business.id : undefined)}
      />
      <BusinessProfileCollaboration business={businessWithServices} />
      <BusinessProfileBrandAssets business={businessWithServices} />
      <BusinessProfileTrust business={businessWithServices} publicMode={isPublic} />
    </>
  );
}
