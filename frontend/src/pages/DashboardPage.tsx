import { useAuthContext } from '../authentication/contexts/AuthContext';
import { Loader } from '../components/Loader';
import { Toast } from '../components/Toast';
import { DestinationWheel } from '../features/destinationChoice/DestinationWheel';
import { useSetDestination } from '../features/destinationChoice/hooks/useSetDestination';
import { JourneyMap } from '../features/showJourney/JourneyMap';
import { Place } from '../types';

export const DashboardPage = () => {
  const { user } = useAuthContext();
  const { mutate: setDestination, success } = useSetDestination();

  if (!user?.destination || !user?.homeCity) {
    return <Loader />;
  }
  const hasDestination = user.destination.city.length > 0;
  return (
    <>
      <Toast successMessage="Destination set successfully" />
      <div>
        <h1>Welcome to Olam Kulo</h1>
      </div>
      {hasDestination ? (
        <DestinationInfo
          destinationCity={user.destination.city}
          homeCity={user.homeCity.city}
        />
      ) : (
        <NoDestinationInfo homeCity={user.homeCity.city} />
      )}
      {!hasDestination ?
        <DestinationWheel setPlace={setDestination} result={user.destination.city} /> :
        <JourneyMap destination={user.destination as Place} homeCity={user.homeCity} />
      }
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
