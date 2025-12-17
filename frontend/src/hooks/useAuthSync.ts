import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { authKeys } from '../features/authorisation/hooks/useAuth';

/**
 * Hook to sync Supabase auth state changes with React Query cache
 * Call this once at the root level of your app
 */
export function useAuthSync(queryClient: QueryClient) {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(authKeys.session(), session);
      queryClient.setQueryData(authKeys.user(), session?.user ?? null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);
}

