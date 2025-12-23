import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { addHomeCity } from '../api/addHomeCity';
import { authKeys } from '../../../authentication/hooks/useAuth';

export const useAddHomeCity = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (homeCity: string) => {
      return addHomeCity(homeCity);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: authKeys.user() });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          navigate({ to: '/dashboard' });
        });
      });
    },
    onError: (error) => {
      console.error('Error adding home city:', error);
    },
  });

  return { mutate, isPending, error };
};
