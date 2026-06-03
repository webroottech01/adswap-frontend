'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/features/auth/public';

/**
 * Business dashboard layout: only business_owner can access.
 * Redirects to dashboard if authenticated but not business_owner.
 */
export default function BusinessDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthSession();
  const isBusinessOwner = user?.roles?.includes('business_owner') ?? false;
  const isSuperAdmin = user?.roles?.includes('super_admin') ?? false;
  const canAccessBusiness = isBusinessOwner || isSuperAdmin;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    if (!canAccessBusiness) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, canAccessBusiness, router]);

  if (isLoading || (isAuthenticated && !canAccessBusiness)) {
    return null;
  }

  return <>{children}</>;
}
