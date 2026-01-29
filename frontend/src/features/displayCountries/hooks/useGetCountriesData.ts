import { useQuery } from "@tanstack/react-query";
import { getCountriesData } from "../api/getCountriesData";
import { GeoJsonObject } from "geojson";

export const useGetCountriesData = () => {
    const { data, isLoading, error } = useQuery<GeoJsonObject, Error>({
        queryKey: ['countries'],
        queryFn: getCountriesData,
        staleTime: Infinity,

    });
    return { data, isLoading, error };
};