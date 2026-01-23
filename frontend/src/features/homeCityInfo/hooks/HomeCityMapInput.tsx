import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useMemo, useState } from "react";
import { Map } from "../../../components/Map";
import { useAddHomeCity } from "./useAddHomeCity";
import { LatLng, LeafletMouseEvent, LocationEvent } from "leaflet";
import { Button } from "../../../components/ui";
import { useGetCityNameByLatLand } from "./useGetCityNameByLatLand";

type PlaceData = {
  city: string;
  country?: string | null;
  lat: number;
  lng: number;
};

//   export const HomeCityMapInput = ({
//     destination,
//     homeCity,
//   }: {
//     destination: PlaceData | null;
//     homeCity: PlaceData | null;
//       }) => {
//         const routePositions = useMemo(() => {
//             if (destination && homeCity) {
//               return [
//                 [homeCity.lat, homeCity.lng] as [number, number],
//                 [destination.lat, destination.lng] as [number, number],
//               ];
//             }
//             return [];
//           }, [destination, homeCity]);

//           const zoom = useMemo(() => {
//             if (destination && homeCity) {
//               const distance = Math.sqrt(
//                 Math.pow(destination.lat - homeCity.lat, 2) +
//                   Math.pow(destination.lng - homeCity.lng, 2)
//               );
//               if (distance > 0.5) return 3;
//               if (distance > 0.1) return 5;
//               return 7;
//             }
//             return 3;
//           }, [destination, homeCity]);


//         return (
// <>
//                     {homeCity && (
//           <Marker position={[homeCity.lat, homeCity.lng]}>
//             <Popup>
//               <div>
//                 <strong>Home</strong>
//                 <br />
//                 {homeCity.city}
//                 {homeCity.country && `, ${homeCity.country}`}
//               </div>
//             </Popup>
//           </Marker>
//         )}
//         {destination && (
//           <Marker position={[destination.lat, destination.lng]}>
//             <Popup>
//               <div>
//                 <strong>Destination</strong>
//                 <br />
//                 {destination.city}
//                 {destination.country && `, ${destination.country}`}
//               </div>
//             </Popup>
//           </Marker>
//         )} 
//                 </>

//         )
//   }

export const HomeCityMapInput = () => {
  const [homeCityLatLng, setHomeCityLatLng] = useState<LatLng | null>(null);
  const { mutate: getHomeCityName, data: homeCity, isPending } = useGetCityNameByLatLand()
  const { mutate: addHomeCity } = useAddHomeCity()


  const map = useMap();
  const mapEvents = useMapEvents({
    load: () => {
      map.locate({ setView: true, enableHighAccuracy: true })
    },
    locationfound: (e: LocationEvent) => {
      setHomeCityLatLng(e.latlng)
      console.log('locationfound', e)
      mapEvents.setView(e.latlng, mapEvents.getZoom())
      getHomeCityName({ lat: e.latlng.lat, lng: e.latlng.lng })
    },
    click: (e: LeafletMouseEvent) => {
      console.log('click', e.latlng)
      setHomeCityLatLng(e.latlng)
      getHomeCityName({ lat: e.latlng.lat, lng: e.latlng.lng })
      mapEvents.setView(e.latlng, mapEvents.getZoom())
    }
  });


  return (
    <>
      {isPending && <div>Loading...</div>}

      {homeCityLatLng && (
        <Marker position={homeCityLatLng}>
          <Popup position={homeCityLatLng} keepInView
            autoClose={false}
            closeOnClick={false}
            closeOnEscapeKey={true}
            closeButton={true}
          >
            {homeCity && <>
              <p>Should we add {homeCity.city}, {homeCity.country} as your home city?</p>
              <Button onClick={() => addHomeCity({ lat: homeCityLatLng.lat, lng: homeCityLatLng.lng, city: homeCity.city, country: homeCity.country })}>Yes</Button>
            </>}
          </Popup>
        </Marker>
      )}
    </>
  );
}