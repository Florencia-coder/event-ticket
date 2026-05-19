import { useQuery } from "@tanstack/react-query";
import { getEventById } from "../services/eventService";

export const useEvent = (id) => {
    return useQuery({
        queryKey: ["event", id],
        queryFn: () => getEventById(id),
        enabled: !!id
    });
};