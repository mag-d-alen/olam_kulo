import { useUser } from '../authentication/hooks/useAuth';
import { Map } from '../components/Map';

export const JourneyPage = () => {
  const { user } = useUser();

  return <Map destination={user?.destination!} homeCity={user?.homeCity!} />;
};
