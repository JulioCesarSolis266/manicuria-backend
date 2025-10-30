import { Router } from "express"
import cDashboard from "../controllers/cDashboard.js"
import mAuth from "../middlewares/mAuth.js" // Middleware para proteger la ruta si es necesario

const router = Router()

// Ruta protegida con token
router.get("/", mAuth, cDashboard.getStats)

export default router