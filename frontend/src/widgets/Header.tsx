import { useUser } from '../features/authorisation/hooks/useAuth';
import { Link } from '@tanstack/react-router';
export const Header = () => {
  const { user } = useUser();

  return (
    <header className='flex justify-end items-center gap-4 bg-gray-500 p-4 w-full'>
      {user ? (
        <div className='flex items-center gap-4 w-full'>
          <Link to='/logout'>Sign Out</Link>
          <Link to='/app/dashboard'>Dashboard</Link>
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
