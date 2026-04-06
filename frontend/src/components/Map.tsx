import { MapContainer, TileLayer } from 'react-leaflet';

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
  loading?: boolean;
};

export const Map = ({
  children,
  focusPlace,
  headerText,
  zoom = 100,
  loading = false,
}: MapProps): React.ReactNode => {
  const screenAwareZoom = window.innerWidth < 768 ? zoom / 10 : zoom;
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {headerText && (
        <h3 className="text-center p-4 font-bold">{headerText}</h3>
      )}
      <MapContainer
        className="h-5/6   w-full bg-bg-app rounded-lg overflow-hidden"
        center={
          [focusPlace?.lat ?? 0, focusPlace?.lng ?? 0] as [number, number]
        }
        zoom={screenAwareZoom}
        scrollWheelZoom={!loading}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
  );
};
