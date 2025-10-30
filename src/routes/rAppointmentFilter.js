import express from "express"
import cAppointmentFilter from "../controllers/cAppointmentFilter.js"

const router = express.Router()

router.get("/", cAppointmentFilter.filter)

export default router
