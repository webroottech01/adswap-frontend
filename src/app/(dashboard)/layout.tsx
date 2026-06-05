'use client';

import { DashboardLayout } from '@/shared/layout';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthSession } from '@/features/auth/public';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuthSession();

  useEffect(() => {
    // Redirect to login if not authenticated (after loading completes)
    if (!isLoading && !isAuthenticated) {
      const queryString = searchParams?.toString();
      const nextUrl =
        (pathname ?? '/dashboard') + (queryString ? `?${queryString}` : '');
      router.push(`/login?next=${encodeURIComponent(nextUrl)}`);
    }
  }, [isAuthenticated, isLoading, pathname, searchParams, router]);

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

