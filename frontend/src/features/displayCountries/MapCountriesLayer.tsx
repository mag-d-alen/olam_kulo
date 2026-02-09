import { Popup, useMap } from 'react-leaflet';
import { Button } from '../../components/Button';
import { Place } from '../../types';
import { useRef, useState } from 'react';
import type { Feature } from "geojson";
import { PathOptions } from 'leaflet';
import { CountriesLayer } from './CountriesLayer';




export function MapCountriesLayer() {
  const [userItinerary, setUserItinerary] = useState<Array<string>>([]);
  const map = useMap();
  const clickedCountryRef = useRef<Place | null>(null);

  const setClickedCountry = (country: Place) => {
    clickedCountryRef.current = country;
  }

  const updateItinerary = () => {
    if (!clickedCountryRef.current || !clickedCountryRef.current.country) return;
    const isInItinerary = userItinerary.includes(clickedCountryRef.current!.country);
    if (isInItinerary) {
      setUserItinerary(prev => prev.filter(country => country !== clickedCountryRef.current!.country));
    } else {
      setUserItinerary(prev => [...prev, clickedCountryRef.current!.country]);
    }
    map.closePopup();
  }

  const saveItinerary = () => {
    console.log("userItinerary", userItinerary);
    map.closePopup();


  }

  const style = (feature?: Feature) => {
    const name = feature?.properties?.COUNTRY;
    return userItinerary.includes(name)
      ? confirmedStyle
      : defaultStyle;
  };

  return (
    <CountriesLayer customStyle={style as PathOptions} handleClickedCountry={(country: Place) => setClickedCountry(country)}>
      <Popup>
        <div className="flex flex-col gap-2"><h3>Would you like to add this country to your itinerary or save the chosen route?</h3>
          <div className="flex flex-row gap-2 justify-center">
            <Button onClick={updateItinerary} variant="secondary">
              Update Itinerary
            </Button>
            <Button onClick={saveItinerary} variant="secondary">
              Save Route
            </Button>
          </div>
        </div>
      </Popup>
    </CountriesLayer>
  );
}



const defaultStyle = {
  fillColor: 'inherit',
  color: 'inherit',
  fillOpacity: 0,
  weight: 0.1,
};
const confirmedStyle = {
  fillColor: '#e18222',
  color: '#e18222',
  fillOpacity: 0.6,
  weight: 0.5
}