import { Router } from "express";
import {
    createTicket,
    getUserTickets,
    validateTicket,
    downloadTicketPDF,
    deleteTicket
} from "../controllers/ticketController.js";

const router = Router();

// Crear ticket (para entradas gratuitas)
router.post("/", createTicket);

// Obtener tickets del usuario
router.get("/user/:userId", getUserTickets);

// Validar ticket (para escaneo)
router.post("/validate", validateTicket);

// Descargar PDF de un ticket específico
router.get("/:id/pdf", downloadTicketPDF);

// Eliminar un ticket específico
router.delete("/:id", deleteTicket);

export default router;