import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addHomeCity } from '../api/addHomeCity';
import { toast } from 'react-toastify';
import { Place } from '../../../types';

type HomeCityData = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const useAddHomeCity = () => {
  const queryClient = useQueryClient();
  let success = false

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (homeCityData: HomeCityData) => {
      toast.success('Home city added successfully');
      return addHomeCity(homeCityData as Place);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['user'] });
      success = true
    },
    onError: (error) => {
      console.error('Error adding home city:', error);
    },
  });

  return { mutate, isPending, error, success};
};
