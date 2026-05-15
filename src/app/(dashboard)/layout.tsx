'use client';

import { DashboardLayout } from '@/shared/layout';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/features/auth/public';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthSession();

  useEffect(() => {
    // Redirect to login if not authenticated (after loading completes)
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show nothing while checking auth status
  if (isLoading) {
    return null;
  }

  // Don't render dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

