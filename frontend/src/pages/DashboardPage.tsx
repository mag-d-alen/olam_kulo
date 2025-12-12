import { Layout } from '../components/Layout';
import { useSignOut } from '../features/authorisation/hooks/useAuth';

export const DashboardPage = () => {
  const { signOut } = useSignOut();
  return (
    <Layout>
      <p>Welcome to the dashboard</p>
    </Layout>
  );
};
