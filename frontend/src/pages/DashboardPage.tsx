import { DestinationWheel } from '../widgets/DestinationWheel';
import { Link } from 'react-router-dom';
import { useUser } from '../authentication/hooks/useAuth';

export const DashboardPage = () => {
  const { user } = useUser();

  const { city = '' } = user!.destination ?? {};
  const homeCity = user!.homeCity ?? '';
  return (
    <>
      <div>
        <h1>Welcome to Olam Kulo</h1>
      </div>
      {city ? (
        <DestinationInfo destinationCity={city} homeCity={homeCity} />
      ) : (
        <NoDestinationInfo homeCity={homeCity} />
      )}
      <DestinationWheel />
      {city && <Link to="/journeyTracker">Track your journey</Link>}
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
