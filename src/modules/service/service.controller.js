import serviceService from "./service.service.js";
import mError from "../../middlewares/error.middleware.js";

import {
  createServiceSchema,
  updateServiceSchema,
  idSchema,
} from "./service.schema.js";

const serviceController = {
  create: async (req, res) => {
    try {
      const data = createServiceSchema.parse(req.body);

      const service = await serviceService.create(data, req.user);

      res.status(201).json({
        message: "Servicio creado",
        service,
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return mError.e400(res, error.errors);
      }

      if (error.status === 400) return mError.e400(res, error.message);
      mError.e500(res, "Error al crear el servicio", error);
    }
  },

  getAll: async (req, res) => {
    try {
      const includeInactive = req.query.all === "true";

      const services = await serviceService.getAll(req.user, includeInactive);

      res.status(200).json({ services });
    } catch (error) {
      mError.e500(res, "Error al obtener los servicios", error);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);

      const service = await serviceService.getOne(id, req.user);

      res.status(200).json(service);
    } catch (error) {
      if (error.name === "ZodError") {
        return mError.e400(res, error.errors);
      }

      if (error.status === 404) return mError.e404(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);

      mError.e500(res, "Error al obtener el servicio", error);
    }
  },

  update: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      const data = updateServiceSchema.parse(req.body);

      const service = await serviceService.update(id, data, req.user);

      res.status(200).json({
        message: "Servicio actualizado",
        service,
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return mError.e400(res, error.errors);
      }

      if (error.status === 404) return mError.e404(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);

      mError.e500(res, "Error al actualizar el servicio", error);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);

      const service = await serviceService.delete(id, req.user);

      res.status(200).json({
        message: "Servicio desactivado",
        service,
      });
    } catch (error) {
      if (error.name === "ZodError") {
        return mError.e400(res, error.errors);
      }

      if (error.status === 404) return mError.e404(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);

      mError.e500(res, "Error al eliminar el servicio", error);
    }
  },
};

export default serviceController;
