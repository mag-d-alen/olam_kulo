import type { QueryClient } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import type { User } from './features/authorisation/types';

export interface AppRouterContext {
  user: User | null;
  session: Session | null;
  queryClient: QueryClient;
}
