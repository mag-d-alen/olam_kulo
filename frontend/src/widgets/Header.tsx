import { useSignOut, useUser } from '../features/authorisation/hooks/useAuth';
import { Link } from '@tanstack/react-router';
export const Header = () => {
  const { user } = useUser();
  const { signOut } = useSignOut();

  return (
    <header className='flex justify-end items-center gap-4 bg-gray-500 p-4 w-full'>
      {user ? (
        <div className='flex items-center gap-4 w-full'>
          <button onClick={() => signOut()}>Sign out</button>
          <Link to='/dashboard'>Dashboard</Link>
        </div>
      ) : (
        <>
          <Link to='/login'>Login</Link>
          <Link to='/signup'>Sign Up</Link>
        </>
      )}
    </header>
  );
};
