import { Link } from 'react-router-dom';
import { useSignOut, useUser } from '../features/authorisation/hooks/useAuth';
export const Header = () => {
  const { user } = useUser();
  const { signOut } = useSignOut();

  return (
    <header>
      <div className='flex justify-end items-center gap-4 bg-gray-500 p-4'>
        {user ? (
          <>
            <Link to='/dashboard'>Go to Dashboard</Link>
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
};
