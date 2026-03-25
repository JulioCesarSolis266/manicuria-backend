import express from "express";
import clientController from "./client.controller.js";
import mAuth from "../../middlewares/auth.middleware.js";

const router = express.Router();

// All routes protected by authentication
router.post("/", mAuth, clientController.create);
router.get("/", mAuth, clientController.getAll);
router.get("/:id", mAuth, clientController.getOne);
router.put("/:id", mAuth, clientController.update);
router.delete("/:id", mAuth, clientController.delete);

export default router;
