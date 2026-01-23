
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
  headerText?: string;
  zoom?: number;
};

export const Map = ({
  children,
  focusPlace,
  headerText,
  zoom = 100,
}: MapProps): React.ReactNode => {

  
  return (
    <div className=" h-screen w-screen overflow-hidden">
     {headerText && <h3 className="text-center p-4 font-bold">{headerText}</h3>}
      <MapContainer
        className="h-screen w-screen rounded-lg overflow-hidden border border-gray-300"
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
