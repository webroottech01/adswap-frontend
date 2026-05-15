'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/features/auth/public';

/**
 * Admin area layout: only super_admin can access.
 * Redirects to dashboard if authenticated but not super_admin.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthSession();
  const isSuperAdmin = user?.roles?.includes('super_admin') ?? false;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    if (!isSuperAdmin) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, isSuperAdmin, router]);

  if (isLoading || (isAuthenticated && !isSuperAdmin)) {
    return null;
  }

  return <>{children}</>;
}
