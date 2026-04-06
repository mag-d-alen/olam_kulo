import { Popup, useMap } from 'react-leaflet';
import { Button } from '../../components/Button';
import { Place } from '../../types';
import { useRef, useState } from 'react';
import type { Feature } from 'geojson';
import { PathOptions } from 'leaflet';
import { CountriesLayer } from './CountriesLayer';
import { useSetItinerary } from '../itineraryChoice/api/hooks/useSetItinerary';
import { Loader } from '../../components/Loader';
import { toast, ToastContainer } from 'react-toastify';

export function MapCountriesLayer() {
  const [userItinerary, setUserItinerary] = useState<Array<Place>>([]);
  const { mutate: addItinerary, isPending } = useSetItinerary();
  const map = useMap();
  const clickedCountryRef = useRef<Place>();

  const setClickedCountry = (countryData: Place) => {
    clickedCountryRef.current = countryData;
  };

  const updateItinerary = () => {
    const isInItinerary =
      userItinerary.filter(
        (country) => country.country === clickedCountryRef.current?.country
      ).length > 0;
    if (isInItinerary) {
      setUserItinerary((prev) =>
        prev.filter(
          (country) => country.country !== clickedCountryRef.current?.country
        )
      );
    } else {
      setUserItinerary((prev) => [...prev, clickedCountryRef.current as Place]);
    }
    map.closePopup();
  };

  const saveItinerary = () => {
    if (userItinerary) {
      addItinerary(userItinerary, {
        onSuccess: () => {
          toast.success('Itinerary saved successfully');
        },
        onError: () => {
          toast.error('Error saving itinerary');
        },
      });
    }
    map.closePopup();
  };

  const style = (feature?: Feature) => {
    const name = feature?.properties?.name;
    return userItinerary.filter((country) => country.country === name).length >
      0
      ? confirmedStyle
      : defaultStyle;
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <CountriesLayer
      customStyle={style as PathOptions}
      handleClickedCountry={(countryData) => setClickedCountry(countryData)}
    >
      <ToastContainer />
      <h3 className="flex flex-col items-start  sm:items-center justify-center z-[1005] bg-white/50 backdrop-blur-sm py-4 pr-4 pl-16 sm:pl-4">
        <span>
          To start your journey, you need to decide about the route you are
          going to take.
        </span>
        <span> Click on countries to add them to your itinerary</span>
      </h3>
      <Popup>
        <div className="flex flex-col gap-2">
          <h3>
            Would you like to add this country to your itinerary or save the
            chosen route?
          </h3>
          <div className="flex flex-row gap-2 justify-center">
            <Button onClick={updateItinerary} variant="secondary">
              Update Itinerary
            </Button>
            <Button onClick={saveItinerary} variant="secondary">
              Save Itinerary
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
  weight: 0.5,
};
