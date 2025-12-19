import { createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardPage } from '../../pages/DashboardPage';
import { AppRouterContext } from '../../router.types';

export const Route = createFileRoute('/_auth/dashboard')({
  beforeLoad: ({ context }: { context: AppRouterContext }) => {
    if (!context.user) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <DashboardPage />,
});
