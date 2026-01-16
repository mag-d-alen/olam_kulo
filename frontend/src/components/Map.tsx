import { Map as MapLibreGL } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMemo, useState } from 'react';

type PlaceData = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};
const mapboxToken = import.meta.env.VITE_MAPBOX_API_KEY;

export const Map = ({ placeData }: { placeData: PlaceData }) => {
  const accessToken = useMemo(() => mapboxToken, [mapboxToken]);
  const [viewState, setViewState] = useState({
    longitude: placeData.lng,
    latitude: placeData.lat,
    zoom: 8,
  });
  return (
    <div className="w-full h-full bg-red-500">
      <MapLibreGL
        mapboxAccessToken={accessToken}
        viewState={{...viewState, width: 300, height: 300, bearing: 0, pitch: 0, padding: {top: 0, left: 0, bottom: 0, right: 0}}}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{ width: 300, height: 300 }}
      />
    </div>
  );
};
