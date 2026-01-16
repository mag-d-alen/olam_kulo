import { Map as MapLibreGL } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

type PlaceData = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const Map = ({ placeData }: { placeData: PlaceData }) => {
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
  return (
    <div className="w-full h-full bg-red-500">
      <MapLibreGL
        onClick={(e) => {
          console.log('clicked', e.lngLat);
        }}
        mapboxAccessToken={accessToken}
        initialViewState={{
          longitude: placeData.lng,
          latitude: placeData.lat,
          zoom: 8,
        }}
        style={{ width: 300, height: 300 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        />
    </div>
  );
};
