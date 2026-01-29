export const getCountriesData = async () => {
    try {
        const response = await fetch('/data/countries.geojson');
        return response.json();
    } catch (error) {
        console.error('Error getting countries data:', error);
        throw error;
    }
};
