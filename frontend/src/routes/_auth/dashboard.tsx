import { createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardPage } from '../../pages/DashboardPage';

export const Route = createFileRoute('/_auth/dashboard')({
  beforeLoad: ({ context }) => {
    const user = context.user;
    if (user && !user?.homeCity) {
      throw redirect({ to: '/onboarding' });
    }
  },
  component: () => <DashboardPage />,
});
