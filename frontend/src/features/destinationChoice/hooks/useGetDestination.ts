import { useQuery } from '@tanstack/react-query';
import { getDestinations } from '../api/getDestinations';

export const useGetDestination = () => {
  const { data: places } = useQuery({
    queryKey: ['places'],
    queryFn: () => getDestinations(),
  });
  return places;
};
