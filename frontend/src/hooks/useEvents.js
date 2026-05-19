import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../services/eventService";

export const useEvents = () => {
    return useQuery({
        queryKey: ["events"],
        queryFn: getEvents
    });
};