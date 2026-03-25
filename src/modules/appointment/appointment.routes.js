import express from "express";
import appointmentController from "./appointment.controller.js";
import mAuth from "../../middlewares/auth.middleware.js";

const router = express.Router();

// 🔒 Todas las rutas protegidas
router.get("/", mAuth, appointmentController.getAll);
router.get("/:id", mAuth, appointmentController.getOne);
router.post("/", mAuth, appointmentController.create);
router.put("/:id", mAuth, appointmentController.update);
router.delete("/:id", mAuth, appointmentController.delete);

export default router;
