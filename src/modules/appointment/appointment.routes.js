import express from "express";
import appointmentController from "./appointment.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

// 🔒 Todas las rutas protegidas
router.get("/", authMiddleware, appointmentController.getAll);
router.get("/:id", authMiddleware, appointmentController.getOne);
router.post("/", authMiddleware, appointmentController.create);
router.put("/:id", authMiddleware, appointmentController.update);
router.delete("/:id", authMiddleware, appointmentController.delete);

export default router;
