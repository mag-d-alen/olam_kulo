import { Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { useAddHomeCity } from "./useAddHomeCity";
import { LatLng, LeafletMouseEvent, LocationEvent } from "leaflet";
import { useGetCityNameByLatLand } from "./useGetCityNameByLatLand";
import { Button } from "../../../components/Button";
import { toast, ToastContainer } from "react-toastify";



export const HomeCityMapInput = () => {
  const [homeCityLatLng, setHomeCityLatLng] = useState<LatLng | null>(null);
  const { mutate: getHomeCityName, data: homeCity, isPending } = useGetCityNameByLatLand()
  const { mutate: addHomeCity, success } = useAddHomeCity()

  const map = useMap();
  const markerRef = useRef<any>(null);

  useEffect(() => {
    map.locate({ setView: true, enableHighAccuracy: true })
  }, [])

  useEffect(() => {
    if (success) {
      toast.success('Home city added successfully');
      return () => setHomeCityLatLng(null)
    }
  }, [success])

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [homeCityLatLng])


  const mapEvents = useMapEvents({
    locationfound: (e: LocationEvent) => {
      setHomeCityLatLng(e.latlng)
      mapEvents.setView(e.latlng, mapEvents.getZoom())
      getHomeCityName({ lat: e.latlng.lat, lng: e.latlng.lng })
      markerRef.current?.openPopup();
    },

    click: (e: LeafletMouseEvent) => {
      setHomeCityLatLng(e.latlng)
      getHomeCityName({ lat: e.latlng.lat, lng: e.latlng.lng })
      mapEvents.setView(e.latlng, mapEvents.getZoom())
    }
  });


  return (
    <>
      {isPending && <div>Loading...</div>}
      <ToastContainer position="top-right" />
      {homeCityLatLng && (
        <Marker
          position={homeCityLatLng}
          ref={markerRef}
          eventHandlers={{
            add: () => {
              if (homeCityLatLng) {
                markerRef.current?.openPopup();
              }
            }
          }}
        >
          <Popup position={homeCityLatLng}
            className="bg-bg-surface text-text-on-dark"
            keepInView
            autoClose={true}
            closeOnClick={true}
            autoPan={true}
            closeOnEscapeKey={true}
            closeButton={true}
          >
            {homeCity?.city ? <>
              <p>Should we add {homeCity.city}, {homeCity.country} as your home city?</p>
              <Button onClick={() => addHomeCity({ lat: homeCityLatLng.lat, lng: homeCityLatLng.lng, city: homeCity.city, country: homeCity.country })}>Yes</Button>
            </> : <p>Focus on the closest city to select your departure city</p>}
          </Popup>
        </Marker>

      )}
    </>
  );
}