import type { QueryClient } from '@tanstack/react-query';
import type { Session } from './services/session';
import type { User } from './authentication/types';

export type AppRouterContext = {
  user: User | null;
  session: Session | null;
  queryClient: QueryClient;
};
