import Event from "../models/Event.js";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.findAll({
            order: [["fecha", "ASC"]]
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByPk(id);

        if (!event) {
            return res.status(404).json({
                message: "Evento no encontrado"
            });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const newEvent = await Event.create(req.body);

        res.status(201).json({
            message: "Evento creado",
            event: newEvent
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createEvents = async (req, res) => {
    try {
        const eventsData = req.body;

        if (!Array.isArray(eventsData) || eventsData.length === 0) {
            return res.status(400).json({
                message: "Se debe enviar un arreglo de eventos para la creación masiva"
            });
        }

        const newEvents = await Event.bulkCreate(eventsData);

        res.status(201).json({
            message: "Eventos creados",
            events: newEvents
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};