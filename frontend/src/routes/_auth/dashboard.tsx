import { createFileRoute, redirect } from '@tanstack/react-router';
import { DashboardPage } from '../../pages/DashboardPage';

/**
 * Dashboard Route Guard
 *
 * This route requires:
 * 1. User to be authenticated (handled by _auth/__layout)
 * 2. User to have completed onboarding (has homeCity)
 *
 * If onboarding is not complete, redirect to onboarding page.
 */
export const Route = createFileRoute('/_auth/dashboard')({
  beforeLoad: ({ context }) => {
    const user = context.user;

    // User is already authenticated (checked by layout)
    // But check if onboarding is complete
    if (!user?.homeCity) {
      throw redirect({ to: '/onboarding' });
    }
  },
  component: () => <DashboardPage />,
});
