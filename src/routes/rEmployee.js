import { Router } from "express"
import cEmployee from "../controllers/cEmployee.js"
import mAuth from "../middlewares/mAuth.js"

const router = Router()

// Crear empleado
router.post("/", mAuth, cEmployee.create)

// Obtener todos los empleados
router.get("/", mAuth, cEmployee.getAll)

// Obtener un empleado por ID
router.get("/:id", mAuth, cEmployee.getOne)

// Actualizar un empleado
router.put("/:id", mAuth, cEmployee.update)

// Eliminar un empleado
router.delete("/:id", mAuth, cEmployee.delete)

export default router