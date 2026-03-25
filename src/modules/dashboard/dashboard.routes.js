import { Router } from "express";
import dashboardController from "./dashboard.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js"; // Middleware para proteger la ruta si es necesario

const router = Router();

// Ruta protegida con token
router.get("/", authMiddleware, dashboardController.getStats);

export default router;
