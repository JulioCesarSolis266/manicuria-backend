import express from "express"
import cAuth from "../controllers/cAuth.js"

const router = express.Router()

router.post("/register", cAuth.register)
router.post("/login", cAuth.login)

export default router
