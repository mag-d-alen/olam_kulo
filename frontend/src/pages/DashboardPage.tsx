import { DestinationWheel } from '../widgets/DestinationWheel';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../authentication/contexts/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuthContext();

  const destination = user!.destination ?? {
    city: '',
    country: '',
    lat: 0,
    lng: 0,
  };
  const homeCity = user!.homeCity ?? {
    city: '',
    country: '',
    lat: 0,
    lng: 0,
  };
  return (
    <>
      <div>
        <h1>Welcome to Olam Kulo</h1>
      </div>
      {destination.city ? (
        <DestinationInfo
          destinationCity={user!.destination!.city}
          homeCity={homeCity.city}
        />
      ) : (
        <NoDestinationInfo homeCity={homeCity.city} />
      )}
      <DestinationWheel />
      {destination.city && <Link to="/journeyTracker">Track your journey</Link>}
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
