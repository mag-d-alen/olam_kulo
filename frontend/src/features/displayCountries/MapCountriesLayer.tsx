import { GeoJSON } from 'react-leaflet';
import { useGetCountriesData } from './hooks/useGetCountriesData';
import { Loader } from '../../components/Loader';

export function CountriesLayer() {
    const countryStyle = {
        fillColor: '#000000',
        fillOpacity: 0.1,
        color: '#000000',
        weight: 1,
    };
    const { data: countries, isLoading } = useGetCountriesData();
    if (isLoading) return <Loader text="Loading countries data..." />;

    return (
        <GeoJSON
        data={countries}
        style={countryStyle}
        onEachFeature={onEachCountry}
      />
    );
}
function onEachCountry(feature: any, layer: L.Layer) {
    const props = feature.properties;
  
    layer.on({
      click: () => {
        console.log('Country clicked:', props);
  
        // Example usage
        alert(`Country: ${props.ADMIN}`);
      },
      mouseover: (e: any) => {
        e.target.setStyle({
          fillOpacity: 0.6,
        });
      },
      mouseout: (e: any) => {
        e.target.setStyle({
          fillOpacity: 0.3,
        });
      },
    });
  }