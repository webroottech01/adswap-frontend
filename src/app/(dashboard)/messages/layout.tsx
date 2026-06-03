'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/features/auth/public';
import { MessagesProvider } from '@/features/messaging/MessagesProvider';

/**
 * Messages layout: only business_owner or super_admin can access.
 * Redirects to dashboard if authenticated but not allowed.
 */
export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthSession();
  const isBusinessOwner = user?.roles?.includes('business_owner') ?? false;
  const isSuperAdmin = user?.roles?.includes('super_admin') ?? false;

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;
    if (!isBusinessOwner && !isSuperAdmin) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, isBusinessOwner, isSuperAdmin, router]);

  if (isLoading || (isAuthenticated && !isBusinessOwner && !isSuperAdmin)) {
    return null;
  }

  return <MessagesProvider>{children}</MessagesProvider>;
}
