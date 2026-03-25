import { Router } from "express";
import userController from "./user.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";

const router = Router();

// Todas requieren autenticación + rol admin
router.get("/", authMiddleware, roleMiddleware("admin"), userController.getAll);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getOne,
);
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  userController.create,
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.update,
);

router.patch(
  "/:id/deactivate",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deactivate,
);
router.patch(
  "/:id/reactivate",
  authMiddleware,
  roleMiddleware("admin"),
  userController.reactivate,
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.delete,
);

export default router;
