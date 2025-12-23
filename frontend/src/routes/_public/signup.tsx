import { createFileRoute, redirect } from '@tanstack/react-router';
import { SignUpPage } from '../../pages/SignUpPage';

/**
 * Signup Route Guard
 *
 * If user is already authenticated:
 * - If onboarding complete → redirect to dashboard
 * - If onboarding incomplete → redirect to onboarding
 */
export const Route = createFileRoute('/_public/signup')({
  beforeLoad: ({ context }) => {
    const user = context.user;

    if (user) {
      // User is authenticated, redirect based on onboarding status
      if (user.homeCity) {
        throw redirect({ to: '/dashboard' });
      } else {
        throw redirect({ to: '/onboarding' });
      }
    }
  },
  component: () => <SignUpPage />,
});
