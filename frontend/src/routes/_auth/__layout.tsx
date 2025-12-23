import { createFileRoute, redirect, Outlet } from '@tanstack/react-router';

/**
 * Auth Layout Guard
 *
 * This guard protects all routes under /_auth/*
 * It ensures the user is authenticated before accessing any protected route.
 *
 * Specific route-level guards (dashboard, onboarding) handle additional logic
 * like checking if onboarding is complete.
 */
export const Route = createFileRoute('/_auth/__layout')({
  beforeLoad: ({ context }) => {
    // If user is not authenticated, redirect to login
    if (!context.user) {
      throw redirect({ to: '/login' });
    }
  },
  component: () => <Outlet />,
});
