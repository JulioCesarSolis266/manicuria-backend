import sClient from "./sClient.js";
import mError from "../../middlewares/mError.js";

const cClient = {
  create: async (req, res) => {
    try {
      const userId = req.user.id;

      const client = await sClient.create(req.body, userId);

      res.status(201).json({
        message: "Cliente creado",
        client,
      });
    } catch (error) {
      if (error.status === 400) return mError.e400(res, error.message);
      mError.e500(res, "Error al crear el cliente", error);
    }
  },

  getAll: async (req, res) => {
    try {
      const userId = req.user.id;

      const clients = await sClient.getAll(userId);

      if (clients.length === 0) {
        return res.status(200).json({
          clients: [],
          message: "No hay clientes registrados",
        });
      }

      res.status(200).json({ clients });
    } catch (error) {
      mError.e500(res, "Error al obtener los clientes", error);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const client = await sClient.getOne(id, userId);

      res.status(200).json(client);
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al obtener el cliente", error);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const client = await sClient.update(id, req.body, userId);

      res.status(200).json({
        message: "Cliente actualizado",
        client,
      });
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      mError.e500(res, "Error al actualizar el cliente", error);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await sClient.delete(id, userId);

      res.status(200).json({
        message: "Cliente eliminado",
      });
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      if (error.status === 400) return mError.e400(res, error.message);
      mError.e500(res, "Error al eliminar el cliente", error);
    }
  },
};

export default cClient;
