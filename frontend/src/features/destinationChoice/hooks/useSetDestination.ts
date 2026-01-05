import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setDestination } from '../api/setDestination';

export const useSetDestination = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (destination: { city: string; country: string }) => {
      return setDestination(destination);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
  return {
    mutate,
    isPending,
    error,
  };
};
