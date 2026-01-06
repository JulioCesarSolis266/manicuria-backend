import { Router } from "express"
import cAuth from "../controllers/cAuth.js"
import mAuth from "../middlewares/mAuth.js"
import mRole from "../middlewares/mRole.js"

const router = Router()

// Solo el admin puede crear nuevas usuarias
router.post("/register", mAuth, mRole("admin"), cAuth.register)

// Cualquiera puede loguearse
router.post("/login", cAuth.login)

export default router
