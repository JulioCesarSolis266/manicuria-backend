import { Router } from "express"
import cService from "../controllers/cService.js"
import mAuth from "../middlewares/mAuth.js"

const router = Router()

// Crear servicio
router.post("/", mAuth, cService.create)

// Obtener todos los servicios
router.get("/", mAuth, cService.getAll)

// Obtener un servicio por ID
router.get("/:id", mAuth, cService.getOne)

// Actualizar un servicio
router.put("/:id", mAuth, cService.update)

// Eliminar un servicio
router.delete("/:id", mAuth, cService.delete)

export default router