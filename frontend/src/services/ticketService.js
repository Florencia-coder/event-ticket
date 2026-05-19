import api from "./api";

export const createTicket = async (ticketData) => {
    const { data } = await api.post("/tickets", ticketData);
    return data;
};

export const getUserTickets = async (userId) => {
    const { data } = await api.get(`/tickets/user/${userId}`);
    return data;
};

export const validateTicket = async (qrData) => {
    const { data } = await api.post("/tickets/validate", { qrData });
    return data;
};

export const downloadTicketPDF = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}/pdf`, {
        responseType: 'blob'
    });
    return response.data;
};

export const deleteTicket = async (ticketId, userId) => {
    const { data } = await api.delete(`/tickets/${ticketId}`, {
        data: { userId }
    });
    return data;
};