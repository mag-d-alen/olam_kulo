import { useSignOut, useUser } from '../authentication/hooks/useAuth';
import { Link } from 'react-router-dom';
export const Header = () => {
  const { user } = useUser();
  const { signOut } = useSignOut();

  return (
    <>
      {user ? (
        <div className="flex items-center gap-4 w-full">
          <button onClick={() => signOut()}>Sign out</button>
          <Link to="/dashboard">Dashboard</Link>
        </div>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </>
  );
};
