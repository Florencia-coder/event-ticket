import Ticket from "../models/Ticket.js";
import Event from "../models/Event.js";
import crypto from "crypto";
import { generateTicketPDF } from "../services/pdfService.js";
import { sendTicketEmail } from "../services/emailService.js";

// Crear ticket para entrada gratuita
export const createTicket = async (req, res) => {
    try {
        const { eventId, userId, nombre, whatsapp, email, cantidad } = req.body;

        // Verificar que el evento existe
        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        const numTickets = cantidad || 1;
        const tickets = [];

        // Crear múltiples tickets si cantidad > 1
        for (let i = 0; i < numTickets; i++) {
            // Generar datos únicos para el QR
            const qrData = crypto.randomUUID();

            // Crear el ticket
            const ticket = await Ticket.create({
                eventId,
                userId,
                qrData,
                nombre,
                whatsapp,
                email,
                cantidad: 1, // Cada ticket individual tiene cantidad 1
                codigo_ticket: qrData,
                estado: "activo",
                tipo_ticket: "gratuito"
            });

            tickets.push(ticket);
        }

        // Generar PDFs y enviar emails para cada ticket
        const pdfPromises = tickets.map(async (ticket, index) => {
            try {
                const pdfBuffer = await generateTicketPDF(ticket, event);
                await sendTicketEmail(email, ticket, event, pdfBuffer, index + 1, numTickets);
                return {
                    id: ticket.id,
                    qrData: ticket.qrData,
                    pdfGenerated: true
                };
            } catch (error) {
                console.error(`Error generando PDF para ticket ${ticket.id}:`, error);
                return {
                    id: ticket.id,
                    qrData: ticket.qrData,
                    pdfGenerated: false
                };
            }
        });

        const ticketResults = await Promise.all(pdfPromises);

        res.status(201).json({
            message: `${numTickets} ticket${numTickets > 1 ? 's' : ''} creado${numTickets > 1 ? 's' : ''} exitosamente`,
            tickets: ticketResults
        });
    } catch (error) {
        console.error("Error creando ticket:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener tickets del usuario
export const getUserTickets = async (req, res) => {
    try {
        const { userId } = req.params;

        const tickets = await Ticket.findAll({
            where: { userId },
            include: [{
                model: Event,
                attributes: ["id", "titulo", "fecha", "direccion"]
            }],
            order: [["createdAt", "DESC"]]
        });

        res.json(tickets);
    } catch (error) {
        console.error("Error obteniendo tickets:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Validar ticket (para escaneo)
export const validateTicket = async (req, res) => {
    try {
        const { qrData } = req.body;

        const ticket = await Ticket.findOne({
            where: { qrData },
            include: [{
                model: Event,
                attributes: ["id", "nombre", "fecha", "lugar"]
            }]
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        if (ticket.status === "used") {
            return res.status(400).json({ message: "Ticket ya utilizado" });
        }

        // Marcar como usado
        await ticket.update({ status: "used", estado: "usado" });

        res.json({
            message: "Ticket válido",
            ticket: {
                id: ticket.id,
                event: ticket.Event.titulo,
                nombre: ticket.nombre,
                status: ticket.status
            }
        });
    } catch (error) {
        console.error("Error validando ticket:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Descargar PDF de un ticket específico
export const downloadTicketPDF = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar el ticket con el evento relacionado
        const ticket = await Ticket.findByPk(id, {
            include: [{
                model: Event,
                attributes: ["titulo", "fecha", "direccion", "ciudad", "organizador"]
            }]
        });

        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        // Generar PDF
        const pdfBuffer = await generateTicketPDF(ticket, ticket.Event);

        // Configurar headers para descarga
        const eventTitle = ticket.Event.titulo.replace(/[^a-zA-Z0-9]/g, '-');
        const filename = `ticket-${eventTitle}-${ticket.id}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error descargando PDF del ticket:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Eliminar un ticket específico
export const deleteTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // Para verificar que el usuario sea el propietario

        // Buscar el ticket
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ message: "Ticket no encontrado" });
        }

        // Verificar que el ticket pertenezca al usuario
        if (ticket.userId !== parseInt(userId)) {
            return res.status(403).json({ message: "No tienes permiso para eliminar este ticket" });
        }

        // Verificar que el ticket no haya sido usado
        if (ticket.status === "used") {
            return res.status(400).json({ message: "No se puede eliminar un ticket que ya ha sido utilizado" });
        }

        // Eliminar el ticket
        await ticket.destroy();

        res.json({
            message: "Ticket eliminado exitosamente",
            ticketId: id
        });
    } catch (error) {
        console.error("Error eliminando ticket:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};