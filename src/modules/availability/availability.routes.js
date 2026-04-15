import express from "express";
import availabilityController from "./availability.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, availabilityController.get);
router.put("/", authMiddleware, availabilityController.set);

export default router;
