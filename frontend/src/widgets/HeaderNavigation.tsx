import { useSignOut, useUser } from '../authentication/hooks/useAuth';
import { Link } from '@tanstack/react-router';
export const HeaderNavigation = () => {
  const { user } = useUser();
  const { signOut } = useSignOut();

  return (
    <>
      {user ? (
        <>
          <button onClick={() => signOut()}>Sign out</button>
          <Link to="/dashboard">Dashboard</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </>
  );
};
