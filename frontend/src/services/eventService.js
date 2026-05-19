import api from "./api";

export const getEvents = async () => {
    const { data } = await api.get("/events");
    return data;
};

export const getEventById = async (id) => {
    const { data } = await api.get(`/events/${id}`);
    return data;
};

export const createEvent = async (eventData) => {
    const { data } = await api.post("/events", eventData);
    return data;
};