import React, { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabase';
import { authKeys } from '../features/authorisation/hooks/useAuth';

/**
 * Minimal provider that listens to Supabase auth state changes
 * and syncs them with React Query cache.
 * This is the only provider needed - React Query handles the rest!
 */
export const AuthStateListener: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();

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

  return <>{children}</>;
};

