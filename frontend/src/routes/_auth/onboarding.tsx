import { createFileRoute, redirect } from '@tanstack/react-router';
import { OnboardingPage } from '../../pages/OnboardingPage';

/**
 * Onboarding Route Guard
 *
 * This route requires:
 * 1. User to be authenticated (handled by _auth/__layout)
 *
 * If user has already completed onboarding, redirect to dashboard.
 */
export const Route = createFileRoute('/_auth/onboarding')({
  beforeLoad: ({ context }) => {
    const user = context.user;

    // User is already authenticated (checked by layout)
    // If onboarding is already complete, redirect to dashboard
    if (user?.homeCity) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: () => <OnboardingPage />,
});
