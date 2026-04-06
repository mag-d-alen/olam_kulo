import { PathOptions } from 'leaflet';
import { Loader } from '../../components/Loader';
import { useGetCountriesData } from './hooks/useGetCountriesData';
import { GeoJSON } from 'react-leaflet';
import { Place } from '../../types';
type CountriesLayerProps = {
  children: React.ReactNode;
  customStyle: PathOptions;
  handleClickedCountry: (country: Place) => void;
};

export const CountriesLayer = ({
  children,
  customStyle,
  handleClickedCountry,
}: CountriesLayerProps) => {
  const { data: countries, isLoading } = useGetCountriesData();

  const onEachCountry = ({ feature, layer }: OnEachCountryProps) => {
    const { properties } = feature;
    layer.on({
      click: (e: any) => {
        handleClickedCountry({
          id: properties.id,
          country: properties.name,
          city: '',
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        e.target.setStyle(selectedStyle);
      },
    });
  };

  const style = customStyle ? customStyle : countryStyle;
  if (isLoading) return <Loader text="Loading countries data..." />;
  if (!countries) return <></>;
  return (
    <GeoJSON
      key={'countries-layer'}
      data={countries}
      style={style as PathOptions}
      onEachFeature={(feature, layer) => onEachCountry({ feature, layer })}
      interactive={true}
    >
      {children}
    </GeoJSON>
  );
};
const countryStyle = {
  fillColor: 'inherit',
  color: 'inherit',
  fillOpacity: 0,
  weight: 0.1,
};
type OnEachCountryProps = {
  feature: any;
  layer: L.Layer;
};
const selectedStyle = {
  fillColor: '#f0a529',
  color: '#f0a529',
  fillOpacity: 0.6,
  weight: 0.5,
};
