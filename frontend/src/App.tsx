import {
  ErrorComponent,
  RouterProvider,
  createRouter,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import type { AppRouterContext } from './router.types';
import {
  AuthProvider,
  useAuthContext,
} from './authentication/contexts/AuthContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Loader } from './components/Loader';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => <Loader />,
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    user: null,
    session: null,
    queryClient,
  } as AppRouterContext,
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
  const routerContext = {
    user: user || null,
    session: session || null,
    queryClient,
  };

  return (
    <RouterProvider
      router={router}
      context={routerContext}
      defaultPreload="intent"
    />
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterWithAuth />
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
