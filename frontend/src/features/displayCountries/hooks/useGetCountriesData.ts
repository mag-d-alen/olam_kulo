import { useQuery } from "@tanstack/react-query";
import { getCountriesData } from "../api/getCountriesData";

export const useGetCountriesData = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['countries'],
        queryFn: getCountriesData,
        staleTime: Infinity, 
        gcTime: Infinity,
    
    });
    return { data, isLoading, error };
};