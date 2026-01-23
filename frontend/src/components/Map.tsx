import { LatLng, LeafletMouseEvent } from 'leaflet';
import { useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import { useGetCityNameByLatLand } from '../features/homeCityInfo/hooks/useGetCityNameByLatLand';
import { Button } from './ui/Button';
import { useAddHomeCity } from '../features/homeCityInfo/hooks/useAddHomeCity';


// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// const DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// L.Marker.prototype.options.icon = DefaultIcon;

type PlaceData = {
  city: string;
  country?: string | null;
  lat: number;
  lng: number;
};

type MapProps = {
  children: React.ReactNode;
  focusPlace: PlaceData | null;
  zoom?: number;
};

export const Map = ({
  children,
focusPlace,
zoom = 3,
}: MapProps): React.ReactNode => {

  
  
  // Calculate center point between home and destination
  // const center = useMemo(() => {
  //   if (destination && homeCity) {
  //     return {
  //       lat: (destination.lat + homeCity.lat) / 2,
  //       lng: (destination.lng + homeCity.lng) / 2,
  //     };
  //   }
  //   if (destination) {
  //     return { lat: destination.lat, lng: destination.lng };
  //   }
  //   if (homeCity) {
  //     return { lat: homeCity.lat, lng: homeCity.lng };
  //   }
  //   return { lat: 0, lng: 0 };
  // }, [destination, homeCity]);

  // Create route polyline positions
  // const routePositions = useMemo(() => {
  //   if (destination && homeCity) {
  //     return [
  //       [homeCity.lat, homeCity.lng] as [number, number],
  //       [destination.lat, destination.lng] as [number, number],
  //     ];
  //   }
  //   return [];
  // }, [destination, homeCity]);

  // const zoom = useMemo(() => {
  //   if (destination && homeCity) {
  //     const distance = Math.sqrt(
  //       Math.pow(destination.lat - homeCity.lat, 2) +
  //         Math.pow(destination.lng - homeCity.lng, 2)
  //     );
  //     if (distance > 0.5) return 3;
  //     if (distance > 0.1) return 5;
  //     return 7;
  //   }
  //   return 3;
  // }, [destination, homeCity]);




  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
      style={{ height: '500px', width: '100vw' }}
      center={[focusPlace?.lat ?? 0, focusPlace?.lng ?? 0] as [number, number] }
      zoom={zoom}
      scrollWheelZoom={true}>
      <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />{children}
      </MapContainer>
    </div>



  );
};
