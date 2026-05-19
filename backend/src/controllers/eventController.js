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