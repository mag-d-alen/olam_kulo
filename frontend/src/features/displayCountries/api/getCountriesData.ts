import { apiClient } from "../../../services/api";
import { GeoJsonObject } from 'geojson';

export const getCountriesData = async () => {
    try {
        return apiClient.get('places/getCountries').then((res) => {
            return res.data as GeoJsonObject;
        });
    } catch (error) {
        console.error('Error getting countries data:', error);
        throw error;
    }
};
