import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { addHomeCity } from '../api/addHomeCity';

export const useAddHomeCity = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (homeCity: string) => {
      return addHomeCity(homeCity);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['user'] });
      navigate({ to: '/dashboard' });
    },
    onError: (error) => {
      console.error('Error adding home city:', error);
    },
  });

  return { mutate, isPending, error };
};
