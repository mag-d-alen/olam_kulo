
import {
  MapContainer,
  TileLayer,
} from 'react-leaflet';
import { CountriesLayer } from '../features/displayCountries/MapCountriesLayer';

type PlaceData = {
  city?: string;
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

  const calculatedZoom = Math.abs(focusPlace?.lat ?? 0) + Math.abs(focusPlace?.lng ?? 0) > 50 ? zoom / 2 : zoom;
  const screenAwareZoom = window.innerWidth < 768 ? calculatedZoom / 10 : calculatedZoom;

  return (
    <div className="h-screen w-[100%] overflow-hidden flex flex-col items-center justify-center">
      {headerText && <h3 className="text-center p-4 font-bold">{headerText}</h3>}
      <MapContainer
        className="md:h-[calc(100vh-100px)]  xs:h-[80px] w-[100%]  rounded-lg overflow-hidden border border-border-default"
        center={[focusPlace?.lat ?? 0, focusPlace?.lng ?? 0] as [number, number]}
        zoom={screenAwareZoom}
        scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CountriesLayer />
        {children}
      </MapContainer>
    </div>



  );
};
