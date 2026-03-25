import { Router } from "express";
import serviceController from "./service.controller.js";
import mAuth from "../../middlewares/auth.middleware.js";

const router = Router();

// Crear servicio
router.post("/", mAuth, serviceController.create);

// Obtener todos los servicios
router.get("/", mAuth, serviceController.getAll);

// Obtener un servicio por ID
router.get("/:id", mAuth, serviceController.getOne);

// Actualizar un servicio
router.put("/:id", mAuth, serviceController.update);

// Eliminar un servicio
router.delete("/:id", mAuth, serviceController.delete);

export default router;
