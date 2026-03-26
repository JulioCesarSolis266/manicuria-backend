import appointmentService from "./appointment.service.js";
import errorMiddleware from "../../middlewares/error.middleware.js";
import { ZodError } from "zod";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  idSchema,
} from "./appointment.schema.js";

const appointmentController = {
  create: async (req, res) => {
    try {
      const validatedData = createAppointmentSchema.parse(req.body);
      const appointment = await appointmentService.create(
        validatedData,
        req.user,
      );

      res.status(201).json({
        message: "Cita creada correctamente",
        appointment,
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
      errorMiddleware.e500(res, "Error al crear la cita", error);
    }
  },

  getAll: async (req, res) => {
    try {
      const appointments = await appointmentService.getAll(req.user);

      res.status(200).json({ appointments });
    } catch (error) {
      errorMiddleware.e500(res, "Error al obtener las citas", error);
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);

      const appointment = await appointmentService.getOne(id, req.user);

      res.status(200).json(appointment);
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
      if (error.status === 403) return errorMiddleware.e403(res, error.message);
      errorMiddleware.e500(res, "Error al obtener la cita", error);
    }
  },

  update: async (req, res) => {
    try {
      const validatedData = updateAppointmentSchema.parse(req.body);
      const { id } = idSchema.parse(req.params);
      const appointment = await appointmentService.update(
        id,
        validatedData,
        req.user,
      );

      res.status(200).json({
        message: "Cita actualizada correctamente",
        appointment,
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
      if (error.status === 404) return errorMiddleware.e404(res, error.message);
      if (error.status === 403) return errorMiddleware.e403(res, error.message);
      errorMiddleware.e500(res, "Error al actualizar la cita", error);
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = idSchema.parse(req.params);
      await appointmentService.delete(id, req.user);

      res.status(200).json({
        message: "Cita eliminada correctamente",
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
      if (error.status === 403) return errorMiddleware.e403(res, error.message);
      errorMiddleware.e500(res, "Error al eliminar la cita", error);
    }
  },
};

export default appointmentController;
