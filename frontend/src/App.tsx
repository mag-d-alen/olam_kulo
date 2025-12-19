import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import type { User } from './features/authorisation/types';
import type { Session } from '@supabase/supabase-js';
import {
  AuthProvider,
  useAuthContext,
} from './features/authorisation/contexts/AuthContext';

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={`p-2 text-2xl`}>
      <span>Loading...</span>
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    user: null as User | null,
    session: null as Session | null,
    queryClient: new QueryClient(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function RouterWithAuth() {
  const { user, session } = useAuthContext();
  const queryClient = new QueryClient();

  return (
    <RouterProvider
      router={router}
      context={{ user, session, queryClient }}
      defaultPreload='intent'
    />
  );
}

export function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <RouterWithAuth />
      </AuthProvider>
    </QueryClientProvider>
  );
}
