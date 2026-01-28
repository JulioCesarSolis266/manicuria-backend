import { Router } from "express"
import cUser from "../controllers/cUser.js"
import mAuth from "../middlewares/mAuth.js"
import mRole from "../middlewares/mRole.js"

const router = Router()

// Todas requieren autenticación + rol admin
router.get("/", mAuth, mRole("admin"), cUser.getAll)
router.post("/", mAuth, mRole("admin"), cUser.create)

router.put("/:id", mAuth, mRole("admin"), cUser.update)

router.patch("/:id/deactivate", mAuth, mRole("admin"), cUser.deactivate)
router.patch("/:id/reactivate", mAuth, mRole("admin"), cUser.reactivate)

router.delete("/:id", mAuth, mRole("admin"), cUser.delete)

export default router