import { Link } from 'react-router-dom';
import { useUser } from '../features/authorisation/hooks/useAuth';
import { Layout } from '../components/Layout';

export const HomePage = () => {
  const { user } = useUser();

  return (
    <Layout>
      <h1>Welcome to OlamKulo</h1>
      <div>
        {user ? (
          <Link to='/dashboard'>Go to Dashboard</Link>
        ) : (
          <>
            <Link to='/login'>Login</Link> | <Link to='/signup'>Sign Up</Link>
          </>
        )}
      </div>
    </Layout>
  );
};
