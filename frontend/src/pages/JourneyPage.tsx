import { useUser } from '../authentication/hooks/useAuth';
import { Map } from '../components/Map';

export const JourneyPage = () => {
  const { user } = useUser();
  const { city = '', country = '', lat = 0, lng = 0 } = user?.destination ?? {};
  return <Map placeData={{ city, country, lat, lng }} />;
};
