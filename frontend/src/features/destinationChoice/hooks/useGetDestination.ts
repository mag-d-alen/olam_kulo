import { useQuery } from '@tanstack/react-query';
import { getDestinations } from '../api/getDestinations';
import { useAuthContext } from '../../../authentication/contexts/AuthContext';

export const useGetDestination = () => {
  const { session } = useAuthContext();
  const { data: places, isLoading } = useQuery({
    queryKey: ['places'],
    queryFn: getDestinations,
    enabled: !!session?.access_token,
  });
  return { places, isLoading };
};
