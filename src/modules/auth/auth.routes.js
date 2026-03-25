import { Router } from "express";
import authController from "./auth.controller.js";
import mAuth from "../../middlewares/auth.middleware.js";
import mRole from "../../middlewares/role.middleware.js";

const router = Router();

// Solo el admin puede crear nuevas usuarias
router.post("/register", mAuth, mRole("admin"), authController.register);

// Cualquiera puede loguearse
router.post("/login", authController.login);

export default router;
