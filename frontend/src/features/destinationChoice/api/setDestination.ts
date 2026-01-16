import { apiClient } from '../../../services/api';

export const setDestination = async ({
  city,
  country,
  id,
}: {
  city: string;
  country: string;
  id: string;
}) => {
  try {
    const response = await apiClient.post('/places/setDestination', {
      city,
      country,
      id,
    });
    return response.data;
  } catch (error) {
    throw new Error('Error setting destination');
  }
};
