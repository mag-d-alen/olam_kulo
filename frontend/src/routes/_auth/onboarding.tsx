import { createFileRoute, redirect } from '@tanstack/react-router';
import { OnboardingPage } from '../../pages/OnboardingPage';
import { AppRouterContext } from '../../router.types';

/**
 * Onboarding Route Guard
 *
 * This route requires:
 * 1. User to be authenticated (handled by _auth/__layout)
 *
 * If user has already completed onboarding, redirect to dashboard.
 */
export const Route = createFileRoute('/_auth/onboarding')({
  loader: async ({ context }: { context: AppRouterContext }) => {
    const user = context.user;
    if (user && user?.homeCity) {
      throw redirect({ to: '/dashboard', replace: true });
    }
  },
  component: () => <OnboardingPage />,
});
