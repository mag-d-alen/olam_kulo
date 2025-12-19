import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/')({
  beforeLoad: ({ context }: any) => {
    if (context.user) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: () => <Outlet />,
});
