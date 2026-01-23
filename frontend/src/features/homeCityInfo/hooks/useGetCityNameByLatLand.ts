import { useMutation } from "@tanstack/react-query";
import { getCityNameByLatLng } from "../api/getCityNameByLatLng";

export const useGetCityNameByLatLand = () => {

    
  const { mutate, isPending, error, data } = useMutation({
      mutationFn:  ({lat, lng}: {lat: number, lng: number}): Promise<{city: string, country: string, lat: number, lng: number}> =>  getCityNameByLatLng({lat, lng}),
      onError: (error) => {
        console.error('Error getting city name by lat and lng:', error)
      }
  });
  return { mutate, isPending, error, data};
};
