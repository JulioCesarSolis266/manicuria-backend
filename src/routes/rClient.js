import express from "express";
import cClient from "../controllers/cClient.js";
import mAuth from "../middlewares/mAuth.js";

const router = express.Router();

// All routes protected by authentication
router.post("/", mAuth, cClient.create);
router.get("/", mAuth, cClient.getAll);
router.get("/:id", mAuth, cClient.getOne);
router.put("/:id", mAuth, cClient.update);
router.delete("/:id", mAuth, cClient.delete);

export default router;
