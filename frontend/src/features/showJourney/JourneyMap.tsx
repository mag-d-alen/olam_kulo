import { Marker } from 'react-leaflet';
import { Map } from '../../components/Map';
import { Place } from '../../types';
import { LeafletPopup } from '../../components/LeafletPopup';

type MapFocus = {
  destination: Place;
  homeCity: Place;
};
export const JourneyMap = ({ destination, homeCity }: MapFocus) => {
  const mapFocus = { lat: (homeCity.lat + destination.lat) / 2, lng: (homeCity.lng + destination.lng) / 2 } as Place;
  return (<Map focusPlace={mapFocus} zoom={3} loading={true}>
    {homeCity && (
      <Marker position={[homeCity.lat, homeCity.lng]} >
        <LeafletPopup>
          <div>Home: {homeCity.city}, {homeCity.country}</div>
        </LeafletPopup>
      </Marker>
    )}
    {destination && (
      <Marker position={[destination.lat, destination.lng]}>
        <LeafletPopup>
          <div>Destination: {destination.city}, {destination.country}</div>
        </LeafletPopup>
      </Marker>
    )}
  </Map>

  );
};
