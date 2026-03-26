import clientService from "./client.service.js";
import errorMiddleware from "../../middlewares/error.middleware.js";
import { ZodError } from "zod";
import {
  createClientSchema,
  updateClientSchema,
  idSchema,
} from "./client.schema.js";

const clientController = {
  create: async (req, res) => {
    try {
      const validatedData = createClientSchema.parse(req.body);
      const userId = req.user.id;

      const client = await clientService.create(validatedData, userId);

      res.status(201).json({
        message: "Cliente creado",
        client,
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
      if (error.status === 400) return errorMiddleware.e400(res, error.message);
      errorMiddleware.e500(res, "Error al crear el cliente", error);
    }
  },

  getAll: async (req, res) => {
    try {
      const userId = req.user.id;

      const clients = await clientService.getAll(userId);

      if (clients.length === 0) {
        return res.status(200).json({
          clients: [],
          message: "No hay clientes registrados",
        });
      }

      res.status(200).json({ clients });
    } catch (error) {
      errorMiddleware.e500(res, "Error al obtener los clientes", error);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const userId = req.user.id;

      const client = await clientService.getOne(id, userId);

      res.status(200).json(client);
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
      if (error.status === 404) return errorMiddleware.e404(res, error.message);
      errorMiddleware.e500(res, "Error al obtener el cliente", error);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const validatedData = updateClientSchema.parse(req.body);
      const userId = req.user.id;

      const client = await clientService.update(id, validatedData, userId);

      res.status(200).json({
        message: "Cliente actualizado",
        client,
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
      if (error.status === 404) return errorMiddleware.e404(res, error.message);
      errorMiddleware.e500(res, "Error al actualizar el cliente", error);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const userId = req.user.id;

      await clientService.delete(id, userId);

      res.status(200).json({
        message: "Cliente eliminado",
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
      if (error.status === 404) return errorMiddleware.e404(res, error.message);
      if (error.status === 400) return errorMiddleware.e400(res, error.message);
      errorMiddleware.e500(res, "Error al eliminar el cliente", error);
    }
  },
};

export default clientController;
