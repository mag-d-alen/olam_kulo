import { createFileRoute, Outlet } from '@tanstack/react-router';
import { LoginPage } from '../pages/LoginPage';
import { useSession } from '../features/authorisation/hooks/useAuth';
// src/routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const { data: session } = useSession();
    if (!session) {
      return <LoginPage />;
    }
    return <Outlet />;
  },
});
