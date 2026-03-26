import userService from "./user.service.js";
import mError from "../../middlewares/error.middleware.js";
import { idSchema, createUserSchema, updateUserSchema } from "./user.schema.js";

const userController = {
  getAll: async (req, res) => {
    try {
      const users = await userService.getAll();
      res.status(200).json({ users });
    } catch (error) {
      mError.e500(res, "Error al obtener usuarios", error);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const user = await userService.getOne(id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          errors: error.errors.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al obtener usuario", error);
    }
  },

  create: async (req, res) => {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await userService.create(data, req.user);
      res.status(201).json({ message: "Usuario creado", user });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          errors: error.errors.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }
      if (error.status === 400) return mError.e400(res, error.message);
      mError.e500(res, "Error al crear usuario", error);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const data = updateUserSchema.parse(req.body);
      const user = await userService.update(id, data);

      res.status(200).json({
        message: "Usuario actualizado",
        user,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          errors: error.errors.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al actualizar usuario", error);
    }
  },

  deactivate: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const user = await userService.deactivate(id);

      res.status(200).json({
        message: "Usuario desactivado",
        user,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          errors: error.errors.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al desactivar usuario", error);
    }
  },

  reactivate: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const user = await userService.reactivate(id);

      res.status(200).json({
        message: "Usuario reactivado",
        user,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          errors: error.errors.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al reactivar usuario", error);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);

      await userService.delete(id);

      res.status(200).json({
        message: "Usuario eliminado definitivamente",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          errors: error.errors.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al eliminar usuario", error);
    }
  },
};

export default userController;
