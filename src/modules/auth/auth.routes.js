import { Router } from "express";
import authController from "./auth.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = Router();

// Solo el admin puede crear nuevas usuarias
router.post(
  "/register",
  authMiddleware,
  roleMiddleware("admin"),
  authController.register,
);

// Cualquiera puede loguearse
router.post("/login", authController.login);

export default router;
