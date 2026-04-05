import express from "express";
import scheduleSettingsController from "./scheduleSettings.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, scheduleSettingsController.get);
router.put("/", authMiddleware, scheduleSettingsController.update);

export default router;
