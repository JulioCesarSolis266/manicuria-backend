import express from "express";
import cAppointmentFilters from "./cAppointmentFilters.js";

const router = express.Router();

router.get("/", cAppointmentFilters.filter);

export default router;
