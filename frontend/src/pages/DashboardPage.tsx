import { DestinationWheel } from '../widgets/DestinationWheel';
import { useAuthContext } from '../authentication/contexts/AuthContext';
import { Link, Navigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div>
        <h1>Welcome to Olam Kulo</h1>
      </div>
      {user.destinationCity ? (
        <DestinationInfo
          destinationCity={user.destinationCity}
          homeCity={user.homeCity ?? ''}
        />
      ) : (
        <NoDestinationInfo homeCity={user.homeCity ?? ''} />
      )}
      <DestinationWheel />
      {user.destinationCity && (
        <Link to="/journeyTracker">Track your journey</Link>
      )}
    </>
  );
};

type NoDestinationInfoProps = {
  homeCity: string;
};
const NoDestinationInfo = ({ homeCity }: NoDestinationInfoProps) => {
  return (
    <div>
      <h2>
        You are now in {homeCity}. Turn the wheel to see your next destination!
      </h2>
    </div>
  );
};

type DestinationInfoProps = {
  destinationCity: string;
  homeCity: string;
};

const DestinationInfo = ({
  destinationCity,
  homeCity,
}: DestinationInfoProps) => {
  return (
    <div>
      <h2>
        Say goodbye to {homeCity}! Your next destination is {destinationCity}!
      </h2>
    </div>
  );
};
