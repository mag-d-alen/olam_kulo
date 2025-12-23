import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Login Route Guard
 *
 * If user is already authenticated:
 * - If onboarding complete → redirect to dashboard
 * - If onboarding incomplete → redirect to onboarding
 */
export const Route = createFileRoute('/_public/login')({
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
  component: () => <LoginPage />,
});
