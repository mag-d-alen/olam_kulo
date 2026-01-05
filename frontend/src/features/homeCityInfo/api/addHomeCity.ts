import { apiClient } from '../../../services/api';

type AddHomeCityResponse = {
  message: string;
  data?: {
    id: string;
    email: string;
    home_city: string | null;
    home_country: string | null;
  };
};

export const addHomeCity = async (
  homeCity: string
): Promise<AddHomeCityResponse> => {
  const response = await apiClient.post('/onboarding/addHomeCity', {
    homeCity,
  });
  return response.data;
};
