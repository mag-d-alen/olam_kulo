import { useAuthContext } from '../authentication/contexts/AuthContext';
import { DestinationWheel } from '../features/destinationChoice/DestinationWheel';
import { JourneyMap } from '../features/showJourney/JourneyMap';

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
      {!user?.destination?.city ? <DestinationWheel /> : null}
      <JourneyMap destination={destination} homeCity={homeCity} />
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
