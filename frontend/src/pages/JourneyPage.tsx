import { useUser } from '../authentication/hooks/useAuth';
import { Map } from '../components/Map';

export const JourneyPage = () => {
  const { user } = useUser();
  console.log(user);
  const destination = user?.destination ?? {
    city: '',
    country: '',
    lat: 0,
    lng: 0,
  };
  const homeCity = user?.homeCity ?? {
    city: '',
    country: '',
    lat: 0,
    lng: 0,
  };

  return <Map destination={destination} homeCity={homeCity} />;
};
