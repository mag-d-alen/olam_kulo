import { Layout } from '../components/Layout';
import { useUser } from '../features/authorisation/hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useUser();
  return (
    <Layout>
      <h1>Dashboard</h1>
      {JSON.stringify(user)}
    </Layout>
  );
};
