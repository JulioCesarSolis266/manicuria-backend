import express from "express"
import cUser from "../controllers/cUser.js"
import mAuth from "../middlewares/mAuth.js"

const router = express.Router()

// 🔒 Todas las rutas protegidas
router.get("/", mAuth, cUser.getAll)
router.post("/", mAuth, cUser.create)
router.put("/:id", mAuth, cUser.update)
router.delete("/:id", mAuth, cUser.deactivate)

export default router