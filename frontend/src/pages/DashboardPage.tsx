import { DestinationWheel } from '../widgets/DestinationWheel';
import { useAuthContext } from '../authentication/contexts/AuthContext';

export const DashboardPage = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  return (
    <>
      <div>
        <h1>Welcome to Olam Kulo</h1>
      </div>
      <div>{user.email}</div>
      <div>
        <h2>You are now in {user.homeCity}</h2>
        <p>
          To start your journey, turn the wheel and see what is your next
          destination!
        </p>
        <DestinationWheel />
      </div>
    </>
  );
};
