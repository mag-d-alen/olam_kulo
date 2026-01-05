import { apiClient } from '../../../services/api';

export const setDestination = async (destination: {
  city: string;
  country: string;
}) => {
  try {
    const response = await apiClient.post('/places/setDestination', {
      destination,
    });
    return response.data;
  } catch (error) {
    console.error('Error setting destination:', error);
    throw error;
  }
};
