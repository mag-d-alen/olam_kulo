
import {
  MapContainer,
  TileLayer,
} from 'react-leaflet';

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
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <MapContainer
        style={{ height: '500px', width: '100vw' }}
        center={[focusPlace?.lat ?? 0, focusPlace?.lng ?? 0] as [number, number]}
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
