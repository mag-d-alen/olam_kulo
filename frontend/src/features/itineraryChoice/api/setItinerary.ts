import { apiClient } from "../../../services/api";
import { Place } from "../../../types";

export const setItinerary = async (itinerary: Place[]) => {
    try {
        const response = await apiClient.post('/onboarding/setItinerary', { itinerary });
        return response.data;
    } catch (error) {
        throw new Error('Error setting itinerary');
    }
};