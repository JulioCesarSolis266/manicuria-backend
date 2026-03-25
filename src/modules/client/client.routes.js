import express from "express";
import clientController from "./client.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All routes protected by authentication
router.post("/", authMiddleware, clientController.create);
router.get("/", authMiddleware, clientController.getAll);
router.get("/:id", authMiddleware, clientController.getOne);
router.put("/:id", authMiddleware, clientController.update);
router.delete("/:id", authMiddleware, clientController.delete);

export default router;
