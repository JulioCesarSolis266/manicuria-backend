import sUser from "./sUser.js";
import mError from "../../middlewares/mError.js";

const cUser = {
  getAll: async (req, res) => {
    try {
      const users = await sUser.getAll();
      res.status(200).json({ users });
    } catch (error) {
      mError.e500(res, "Error al obtener usuarios", error);
    }
  },

  create: async (req, res) => {
    try {
      const user = await sUser.create(req.body);
      res.status(201).json({ message: "Usuario creado", user });
    } catch (error) {
      if (error.status === 400) return mError.e400(res, error.message);
      mError.e500(res, "Error al crear usuario", error);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await sUser.update(id, req.body);

      res.status(200).json({
        message: "Usuario actualizado",
        user,
      });
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al actualizar usuario", error);
    }
  },

  deactivate: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await sUser.deactivate(id);

      res.status(200).json({
        message: "Usuario desactivado",
        user,
      });
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al desactivar usuario", error);
    }
  },

  reactivate: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await sUser.reactivate(id);

      res.status(200).json({
        message: "Usuario reactivado",
        user,
      });
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al reactivar usuario", error);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;

      await sUser.delete(id);

      res.status(200).json({
        message: "Usuario eliminado definitivamente",
      });
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al eliminar usuario", error);
    }
  },
};

export default cUser;
