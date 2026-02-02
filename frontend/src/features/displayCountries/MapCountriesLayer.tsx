import { Popup, useMap } from 'react-leaflet';
import { useGetCountriesData } from './hooks/useGetCountriesData';
import { Loader } from '../../components/Loader';
import { Button } from '../../components/Button';
import { Place } from '../../types';
import { useRef, useState } from 'react';
import type { Feature } from "geojson";
import { PathOptions } from 'leaflet';
import { CountriesLayer } from './CountriesLayer';




export function MapCountriesLayer() {
  const [userItinerary, setUserItinerary] = useState<Array<string>>([]);
  const { data: countries, isLoading } = useGetCountriesData();
  const map = useMap();
  const clickedCountryRef = useRef<Place | null>(null);

  if (isLoading) return <Loader text="Loading countries data..." />;
  if (!countries) return <></>;


  const onEachCountry = ({ feature, layer }: OnEachCountryProps) => {
    const { properties } = feature;
    const isInItinerary = userItinerary.includes(properties.COUNTRY);
    layer.on({
      click: (e: any) => {
        setClickedCountry({
          city: "",
          country: properties.COUNTRY,
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
        e.target.setStyle(selectedStyle);

      },
      mouseover: (e: any) => {
        e.target.setStyle(
          isInItinerary ? selectedStyle : hoveredStyle
        );
      },
    })
  }

  const setClickedCountry = (country: Place) => {
    clickedCountryRef.current = country;
  }

  const addCountryToItinerary = () => {
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

  }

  const style = (feature?: Feature) => {
    const name = feature?.properties?.COUNTRY;
    return userItinerary.includes(name)
      ? confirmedStyle
      : defaultStyle;
  };

  return (<>
    <CountriesLayer customStyle={style as PathOptions} onEachCountry={onEachCountry}>
      <Popup>
        <div className="flex flex-col gap-2">Update your itinerary?
          <Button onClick={addCountryToItinerary}>
            Update
          </Button>
        </div>
      </Popup>
    </CountriesLayer>
    <div className="absolute top-0 right-0 z-[1004]">
      <Button onClick={saveItinerary} disabled={userItinerary.length === 0} >Save Itinerary</Button>
    </div>
  </>
  );
}
type OnEachCountryProps = {
  feature: any;
  layer: L.Layer;
}


const defaultStyle = {
  fillColor: 'inherit',
  color: 'inherit',
  fillOpacity: 0,
  weight: 0.1,
};
const hoveredStyle = {
  fillColor: '#f0a529',
  color: '#f0a529',
  fillOpacity: 0.2,
  weight: 0.5,
};

const selectedStyle = {
  fillColor: '#f0a529',
  color: '#f0a529',
  fillOpacity: 0.6,
  weight: 0.5,
};
const confirmedStyle = {
  fillColor: '#e18222',
  color: '#e18222',
  fillOpacity: 0.6,
  weight: 0.5
}