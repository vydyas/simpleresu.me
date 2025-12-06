'use client';

import { useAutoSyncUser } from '@/hooks/use-auto-sync-user';

/**
 * Provider component that automatically syncs users with the database
 * Should be placed in the root layout
 */
export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  // This hook runs automatically when component mounts
  useAutoSyncUser();

  // Pass through children without any UI
  return <>{children}</>;
}
