import { GeoJSON, Popup, useMap } from 'react-leaflet';
import { useGetCountriesData } from './hooks/useGetCountriesData';
import { Loader } from '../../components/Loader';
import { Button } from '../../components/Button';
import { Place } from '../../types';
import { useRef } from 'react';



export function CountriesLayer() {

  const countryStyle = {
    fillColor: 'inherit',
    color: 'inherit',
    fillOpacity: 0,
    weight: 0.1,


  };
  const { data: countries, isLoading } = useGetCountriesData();
  const map = useMap();
  const clickedCountryRef = useRef<Place | null>(null);
  const itineraryRef = useRef<Place[]>([]);
  if (isLoading) return <Loader text="Loading countries data..." />;
  if (!countries) return <></>;
  const addCountryToItinerary = () => {
    if (!clickedCountryRef.current) return;
    itineraryRef.current.find(country => country.country === clickedCountryRef?.current?.country) ? alert('Country already in itinerary') :
      itineraryRef.current.push(clickedCountryRef.current);
    map.closePopup();
  }
  const setClickedCountry = (country: Place) => {
    clickedCountryRef.current = country;
  }
  const saveItinerary = () => {
    console.log(itineraryRef.current);
  }


  return (<>
    <GeoJSON key={"countries-layer"} data={countries} style={countryStyle} onEachFeature={(feature, layer) => onEachCountry({ feature, layer, setClickedCountry, itinerary: itineraryRef.current })}
      interactive={true}>
      <Popup>
        <div>Add country to your itinerary? <Button onClick={addCountryToItinerary}>Add</Button></div>
      </Popup>
    </GeoJSON>
    <div className="absolute top-0 right-0 z-[2000]">
      <Button onClick={saveItinerary}>Save Itinerary</Button>
    </div>
  </>
  );
}
type OnEachCountryProps = {
  feature: any;
  layer: L.Layer;
  setClickedCountry: (country: Place) => void;
  itinerary: Place[];
}
function onEachCountry({ feature, layer, setClickedCountry, itinerary }: OnEachCountryProps) {
  const { properties } = feature;
  const isInItinerary = itinerary.find(country => country.country === properties.COUNTRY);
  layer.on({
    click: (e: any) => {
      setClickedCountry({

        city: properties.CITY,
        country: properties.COUNTRY,
        lat: properties.LAT,
        lng: properties.LNG,
      });
      e.target.setStyle({
        fillColor: isInItinerary ? 'red' : 'inherit',

      });
      console.log('Country clicked:', properties);
      console.log(layer);
    },
    mouseover: (e: any) => {
      console.log('Mouse over:', e.target.properties);
      e.target.setStyle({
        fillOpacity: 0.6,
      });

    },
    mouseout: (e: any) => {
      e.target.setStyle({
        fillOpacity: 0.3,
      });
    },
  })
}