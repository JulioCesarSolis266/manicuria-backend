import express from "express"
import cAppointment from "../controllers/cAppointment.js"
import mAuth from "../middlewares/mAuth.js"

const router = express.Router()

// 🔒 Todas las rutas protegidas
router.get("/", mAuth, cAppointment.getAll)
router.post("/", mAuth, cAppointment.create)
router.put("/:id", mAuth, cAppointment.update)
router.delete("/:id", mAuth, cAppointment.delete)

export default router