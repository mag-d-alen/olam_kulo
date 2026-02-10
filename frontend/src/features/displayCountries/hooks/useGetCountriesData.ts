import { useQuery } from "@tanstack/react-query";
import { getCountriesData } from "../api/getCountriesData";
import { useAuthContext } from "../../../authentication/contexts/AuthContext";

export const useGetCountriesData = () => {
    const {session} = useAuthContext();
    const { data, isLoading, error } = useQuery({
        queryKey: ['countries'],
        queryFn: () => getCountriesData(),
        staleTime: Infinity,
        enabled: !!session?.access_token,

    });
    return { data, isLoading, error };
};      