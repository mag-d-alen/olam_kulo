import { useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type PlaceData = {
  city: string;
  country?: string | null;
  lat: number;
  lng: number;
};

export const Map = ({
  destination,
  homeCity,
}: {
  destination: PlaceData | null;
  homeCity: PlaceData | null;
}) => {
  // Calculate center point between home and destination
  const center = useMemo(() => {
    if (destination && homeCity) {
      return {
        lat: (destination.lat + homeCity.lat) / 2,
        lng: (destination.lng + homeCity.lng) / 2,
      };
    }
    if (destination) {
      return { lat: destination.lat, lng: destination.lng };
    }
    if (homeCity) {
      return { lat: homeCity.lat, lng: homeCity.lng };
    }
    return { lat: 0, lng: 0 };
  }, [destination, homeCity]);

  // Create route polyline positions
  const routePositions = useMemo(() => {
    if (destination && homeCity) {
      return [
        [homeCity.lat, homeCity.lng] as [number, number],
        [destination.lat, destination.lng] as [number, number],
      ];
    }
    return [];
  }, [destination, homeCity]);

  // Calculate zoom level based on distance
  const zoom = useMemo(() => {
    if (destination && homeCity) {
      // Calculate approximate zoom based on distance
      const distance = Math.sqrt(
        Math.pow(destination.lat - homeCity.lat, 2) +
          Math.pow(destination.lng - homeCity.lng, 2)
      );
      if (distance > 0.5) return 3;
      if (distance > 0.1) return 5;
      return 7;
    }
    return 3;
  }, [destination, homeCity]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {homeCity && (
          <Marker position={[homeCity.lat, homeCity.lng]}>
            <Popup>
              <div>
                <strong>Home</strong>
                <br />
                {homeCity.city}
                {homeCity.country && `, ${homeCity.country}`}
              </div>
            </Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={[destination.lat, destination.lng]}>
            <Popup>
              <div>
                <strong>Destination</strong>
                <br />
                {destination.city}
                {destination.country && `, ${destination.country}`}
              </div>
            </Popup>
          </Marker>
        )}
        {routePositions.length > 0 && (
          <Polyline
            positions={routePositions}
            pathOptions={{ color: '#ff0000', weight: 4 }}
          />
        )}
      </MapContainer>
    </div>
  );
};
