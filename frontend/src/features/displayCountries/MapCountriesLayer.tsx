import { GeoJSON } from 'react-leaflet';
import { useGetCountriesData } from './hooks/useGetCountriesData';
import { Loader } from '../../components/Loader';

export function CountriesLayer() {

  const countryStyle = {
    fillColor: 'inherit',
    fillOpacity: 0.1,
    color: 'var(--color-green)',
    weight: 0.5,
    zIndex: 2000,
  };
  const { data: countries, isLoading } = useGetCountriesData();
  console.log('countries', countries);
  if (isLoading) return <Loader text="Loading countries data..." />;
  if (!countries) return <></>;

  return (
    <GeoJSON key={"countries-layer"} data={countries} style={countryStyle} onEachFeature={(feature, layer) => onEachCountry(feature, layer)}
      interactive={true} />
  );
}
function onEachCountry(feature: any, layer: L.Layer) {
  const { properties } = feature;
  layer.on({
    click: () => {
      console.log('Country clicked:', properties.COUNTRY);
      alert(`Country: ${properties.COUNTRY}`);
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