import {
  createRootRoute,
  Outlet,
  useRouteContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { QueryClient } from '@tanstack/react-query';
import { useAuthSync } from '../hooks/useAuthSync';

const RootLayout = () => {
  const { queryClient } = useRouteContext({ from: '__root__' }) as {
    queryClient: QueryClient;
  };

  // Sync Supabase auth state with React Query
  useAuthSync(queryClient);

  return (
    <div>
      {/* <Link to='/login'>Login</Link> | <Link to='/signup'>Signup</Link>|{' '}
      <Link to='/logout'>Logout</Link> */}
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
