import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/journeyTracker')({
  component: () => <div>Journey Tracker</div>,
});
