import { Marker, Popup } from 'react-leaflet';
import { useUser } from '../../authentication/hooks/useAuth';
import { Map } from '../../components/Map';

export const JourneyMap = () => {
  const { user } = useUser();
  const destination = user?.destination ? {city: user?.destination.city, country: user?.destination.country, lat: user?.destination.lat, lng: user?.destination.lng} : null;
  const homeCity = user?.homeCity ? {city: user?.homeCity.city, country: user?.homeCity.country, lat: user?.homeCity.lat, lng: user?.homeCity.lng} : null;
  return  (<Map focusPlace={destination} zoom={3}>
        {homeCity && (
          <Marker position={[homeCity.lat, homeCity.lng]}>
            <Popup>
              <div>Home: {homeCity.city}, {homeCity.country}</div>
            </Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>
              <div>Destination: {destination.city}, {destination.country}</div>
            </Popup>
          </Marker>
        )}
      </Map>

  );
};
