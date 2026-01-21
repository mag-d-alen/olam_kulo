import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { addHomeCity } from '../api/addHomeCity';

type HomeCityData = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const useAddHomeCity = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (homeCityData: HomeCityData) => {
      return addHomeCity(homeCityData);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['user'] });
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      console.error('Error adding home city:', error);
    },
  });

  return { mutate, isPending, error };
};
