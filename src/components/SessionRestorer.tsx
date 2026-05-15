'use client';

import { useEffect } from 'react';
import { useRestoreSession } from '@/features/auth/public';

/**
 * Component that restores auth session on app load.
 * Should be placed high in the component tree.
 */
export function SessionRestorer() {
  const { restoreSession } = useRestoreSession();

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return null;
}











