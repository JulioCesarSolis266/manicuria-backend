import { Router } from "express";
import userController from "./user.controller.js";
import mAuth from "../../middlewares/auth.middleware.js";
import mRole from "../../middlewares/role.middleware.js";

const router = Router();

// Todas requieren autenticación + rol admin
router.get("/", mAuth, mRole("admin"), userController.getAll);

router.get("/:id", mAuth, mRole("admin"), userController.getOne);
router.post("/", mAuth, mRole("admin"), userController.create);

router.put("/:id", mAuth, mRole("admin"), userController.update);

router.patch(
  "/:id/deactivate",
  mAuth,
  mRole("admin"),
  userController.deactivate,
);
router.patch(
  "/:id/reactivate",
  mAuth,
  mRole("admin"),
  userController.reactivate,
);

router.delete("/:id", mAuth, mRole("admin"), userController.delete);

export default router;
