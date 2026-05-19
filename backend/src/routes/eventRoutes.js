import { Router } from "express";
import {
    getEvents,
    getEventById,
    createEvent,
    createEvents
} from "../controllers/eventController.js";

const router = Router();

// Events endpoints
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.post("/bulk", createEvents);

export default router;