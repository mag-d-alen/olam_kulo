import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { Layout } from '../../components/Layout';
import { supabase } from '../../services/supabase';

export const Route = createFileRoute('/app/')({
  beforeLoad: async ({ location }) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
