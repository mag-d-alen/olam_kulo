import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useState } from "react";
import { useAddHomeCity } from "./useAddHomeCity";
import { LatLng, LeafletMouseEvent, LocationEvent } from "leaflet";
import { Button } from "../../../components/ui";
import { useGetCityNameByLatLand } from "./useGetCityNameByLatLand";



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