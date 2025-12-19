import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { Layout } from '../components/Layout';
import type { AppRouterContext } from '../router.types';

const RootLayout = () => {
  return (
    <Layout>
      <Outlet />
      <TanStackRouterDevtools />
    </Layout>
  );
};

export const Route = createRootRouteWithContext<AppRouterContext>()({
  component: RootLayout,
});
