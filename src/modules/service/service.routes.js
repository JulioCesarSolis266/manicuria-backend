import { Router } from "express";
import serviceController from "./service.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

// Crear servicio
router.post("/", authMiddleware, serviceController.create);

// Obtener todos los servicios
router.get("/", authMiddleware, serviceController.getAll);

// Obtener un servicio por ID
router.get("/:id", authMiddleware, serviceController.getOne);

// Actualizar un servicio
router.put("/:id", authMiddleware, serviceController.update);

// Eliminar un servicio
router.delete("/:id", authMiddleware, serviceController.delete);

export default router;
