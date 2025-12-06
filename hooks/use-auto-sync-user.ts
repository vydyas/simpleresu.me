'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

/**
 * Automatically syncs Clerk user with Supabase database
 * Runs once when user first logs in
 */
export function useAutoSyncUser() {
  const { user, isLoaded } = useUser();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');

  useEffect(() => {
    const syncUser = async () => {
      // Only proceed if user is loaded and exists
      if (!isLoaded || !user) return;

      // Check if already synced in this session
      const syncedFlag = sessionStorage.getItem(`user_synced_${user.id}`);
      if (syncedFlag === 'true') {
        setSyncStatus('synced');
        return;
      }

      try {
        setSyncStatus('syncing');

        // Get primary email address
        const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress;

        if (!email) {
          console.error('No email address found for user');
          setSyncStatus('error');
          return;
        }

        // Call sync API
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error(`Sync failed: ${response.statusText}`);
        }

        // Mark as synced in session storage
        sessionStorage.setItem(`user_synced_${user.id}`, 'true');
        setSyncStatus('synced');

        console.log('✅ User synced with database');
      } catch (error) {
        console.error('Failed to sync user:', error);
        setSyncStatus('error');
        // Don't block the user experience if sync fails
        // They can still use the app, but data won't persist
      }
    };

    syncUser();
  }, [user, isLoaded]);

  return { syncStatus, isSyncing: syncStatus === 'syncing' };
}
