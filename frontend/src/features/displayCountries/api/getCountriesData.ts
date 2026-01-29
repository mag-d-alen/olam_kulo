import { apiClient } from "../../../services/api";
import { GeoJsonObject } from 'geojson';

const url = 'https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Countries_(Generalized)/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'
export const getCountriesData = async () => {
    return apiClient.get('places/getCountries').then((res) => {
        return res.data as GeoJsonObject;
    });
};
