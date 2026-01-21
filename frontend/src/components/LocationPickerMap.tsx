import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

type LocationData = {
  lat: number;
  lng: number;
  city: string;
  country: string;
};

type LocationPickerMapProps = {
  onLocationSelect: (location: LocationData) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
};

// Component to handle map clicks
function MapClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (location: LocationData) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  useMapEvents({
    async click(e) {
      setIsLoading(true);
      const { lat, lng } = e.latlng;

      try {
        // Reverse geocoding using OpenStreetMap Nominatim API
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'OlamKulo/1.0', // Required by Nominatim
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();
        const address = data.address || {};

        // Extract city and country from address
        const city =
          address.city ||
          address.town ||
          address.village ||
          address.municipality ||
          address.county ||
          'Unknown';

        const country = address.country || 'Unknown';

        onLocationSelect({
          lat,
          lng,
          city,
          country,
        });
      } catch (error) {
        console.error('Error fetching location data:', error);
        // Fallback: use coordinates if reverse geocoding fails
        onLocationSelect({
          lat,
          lng,
          city: 'Unknown',
          country: 'Unknown',
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return isLoading ? (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded shadow-lg">
      <span className="text-sm">Loading location...</span>
    </div>
  ) : null;
}

export const LocationPickerMap = ({
  onLocationSelect,
  initialCenter = [0, 0],
  initialZoom = 2,
}: LocationPickerMapProps) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMarkerPosition([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Use default center if geolocation fails
          setMarkerPosition(initialCenter);
        }
      );
    } else {
      setMarkerPosition(initialCenter);
    }
  }, [initialCenter]);

  const handleLocationSelect = (location: LocationData) => {
    setMarkerPosition([location.lat, location.lng]);
    onLocationSelect(location);
  };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        center={markerPosition || initialCenter}
        zoom={initialZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPosition && <Marker position={markerPosition} />}
        <MapClickHandler onLocationSelect={handleLocationSelect} />
      </MapContainer>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded shadow-lg text-sm">
        Click on the map to select your location
      </div>
    </div>
  );
};
