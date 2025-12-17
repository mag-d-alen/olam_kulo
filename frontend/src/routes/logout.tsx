import { createFileRoute, redirect } from '@tanstack/react-router';
import { authService } from '../services/authService';

export const Route = createFileRoute('/logout')({
  component: () => {
    return <div>Logging out...</div>;
  },
  beforeLoad: async () => {
    await authService.signOut();
    throw redirect({ to: '/login' });
  },
});
