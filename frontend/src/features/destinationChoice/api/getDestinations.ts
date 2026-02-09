import { apiClient } from '../../../services/api';
import { Destination } from './types';

export const getDestinations = async () => {
  try {
    const response = await apiClient.get('/places/unvisited');
    return response.data as Destination[];
  } catch (error) {
    console.error('Error getting destinations:', error);
    throw error;
  }
};
