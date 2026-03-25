import appointmentService from "./appointment.service.js";
import errorMiddleware from "../../middlewares/error.middleware.js";

const appointmentController = {
  create: async (req, res) => {
    try {
      const appointment = await appointmentService.create(req.body, req.user);

      res.status(201).json({
        message: "Cita creada correctamente",
        appointment,
      });
    } catch (error) {
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
      const appointment = await appointmentService.getOne(
        req.params.id,
        req.user,
      );

      res.status(200).json(appointment);
    } catch (error) {
      if (error.status === 404) return errorMiddleware.e404(res, error.message);
      if (error.status === 403) return errorMiddleware.e403(res, error.message);
      errorMiddleware.e500(res, "Error al obtener la cita", error);
    }
  },

  update: async (req, res) => {
    try {
      const appointment = await appointmentService.update(
        req.params.id,
        req.body,
        req.user,
      );

      res.status(200).json({
        message: "Cita actualizada correctamente",
        appointment,
      });
    } catch (error) {
      if (error.status === 400) return errorMiddleware.e400(res, error.message);
      if (error.status === 404) return errorMiddleware.e404(res, error.message);
      if (error.status === 403) return errorMiddleware.e403(res, error.message);
      errorMiddleware.e500(res, "Error al actualizar la cita", error);
    }
  },

  delete: async (req, res) => {
    try {
      await appointmentService.delete(req.params.id, req.user);

      res.status(200).json({
        message: "Cita eliminada correctamente",
      });
    } catch (error) {
      if (error.status === 404) return errorMiddleware.e404(res, error.message);
      if (error.status === 403) return errorMiddleware.e403(res, error.message);
      errorMiddleware.e500(res, "Error al eliminar la cita", error);
    }
  },
};

export default appointmentController;
