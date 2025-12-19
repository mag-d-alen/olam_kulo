// import { useEffect } from 'react';
// import { QueryClient, useQueryClient } from '@tanstack/react-query';
// import { supabase } from '../services/supabase';
// import { authKeys } from '../features/authorisation/hooks/useAuth';

// /**
//  * Hook to sync Supabase auth state changes with React Query cache
//  * Call this once at the root level of your app
//  */
// export function useAuthSync(queryClient?: QueryClient) {
//   const queryClientToUse = queryClient ?? useQueryClient();
//   useEffect(() => {
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       console.log('auth state changed', session);
//       queryClientToUse.setQueryData(authKeys.session(), session);
//       queryClientToUse.setQueryData(authKeys.user(), session?.user ?? null);
//       //   queryClient.invalidateQueries({ queryKey: authKeys.all });
//     });

//     return () => subscription.unsubscribe();
//   }, [queryClient]);
// }
