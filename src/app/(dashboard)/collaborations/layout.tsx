'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/features/auth/public';

/**
 * Collaborations layout: business_owner or super_admin can access (API enforces same).
 */
export default function CollaborationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthSession();
  const roles = user?.roles ?? [];
  const canAccessCollaborations = roles.includes('business_owner') || roles.includes('super_admin');

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    if (!canAccessCollaborations) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, canAccessCollaborations, router]);

  if (isLoading || (isAuthenticated && !canAccessCollaborations)) {
    return null;
  }

  return <>{children}</>;
}
