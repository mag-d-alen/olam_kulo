import { apiClient } from "../../../services/api";
import { FeatureCollection } from 'geojson';

export const getCountriesData = async () => {
    try {
        const res = await apiClient.get('places/countries');
        const mappedFeatures = mapToGeoJson(res.data);
        return mappedFeatures;
    } catch (error) {
        console.error('Error getting countries data:', error);

    }
};
const mapToGeoJson = (data: any[]): FeatureCollection => {
    return ({
        type: "FeatureCollection",
        features: data.map(feature => ({
            type: "Feature",
            geometry: feature.geometry,
            properties: {
                ...feature,

            }
        }))
    })
}