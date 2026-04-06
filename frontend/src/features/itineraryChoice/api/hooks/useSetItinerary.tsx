import { useQueryClient, useMutation } from "@tanstack/react-query";
import { setItinerary } from "../setItinerary";



export const useSetItinerary = () => {
    const queryClient = useQueryClient();
    let success = false
    const { mutate, isPending, error } = useMutation({
        mutationFn: setItinerary,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itinerary'] });
            success = true
        },
    });
    return { mutate, isPending, error, success };

};  