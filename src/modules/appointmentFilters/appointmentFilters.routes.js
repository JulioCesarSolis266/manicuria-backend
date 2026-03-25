import express from "express";
import appointmentFiltersController from "./appointmentFilters.controller.js";

const router = express.Router();

router.get("/", appointmentFiltersController.filter);

export default router;
