import { Router } from "express";
const router = Router();

import authRoutes from "./authRoutes.js";
import eventRoutes from "./eventRoutes.js";
import ticketRoutes from "./ticketRoutes.js";

/*
 futuras rutas:
 const userRoutes = require("./userRoutes");
*/

router.use("/auth", authRoutes);
router.use("/events", eventRoutes);
router.use("/tickets", ticketRoutes);

/*
 router.use("/users", userRoutes);

*/

export default router;