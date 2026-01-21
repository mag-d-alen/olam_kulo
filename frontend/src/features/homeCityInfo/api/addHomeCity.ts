import { Place } from '../../../types';
import { apiClient } from '../../../services/api';

export const addHomeCity = async (homeCityData: Place): Promise<void> => {
  const response = await apiClient.post('/onboarding/addHomeCity', {
    city: homeCityData.city.trim(),
    country: homeCityData.country.trim(),
    lat: homeCityData.lat,
    lng: homeCityData.lng,
  });
  return response.data;
};
