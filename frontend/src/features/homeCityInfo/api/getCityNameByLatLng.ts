import { apiClient } from "../../../services/api";

export const getCityNameByLatLng = async ({lat, lng}: {lat: number, lng: number}) => {
  try {
    const response = await apiClient.post(`/places/getCityByLatLng`, { lat, lng });
    return response.data;
  } catch (error) {
    throw new Error('Error getting city name by lat and lng');
  }
};