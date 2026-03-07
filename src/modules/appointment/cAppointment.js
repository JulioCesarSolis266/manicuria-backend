import sAppointment from "./sAppointment.js";
import mError from "../../middlewares/mError.js";

const cAppointment = {
  create: async (req, res) => {
    try {
      const appointment = await sAppointment.create(req.body, req.user);

      res.status(201).json({
        message: "Cita creada correctamente",
        appointment,
      });
    } catch (error) {
      if (error.status === 400) return mError.e400(res, error.message);
      mError.e500(res, "Error al crear la cita", error);
    }
  },

  getAll: async (req, res) => {
    try {
      const appointments = await sAppointment.getAll(req.user);

      res.status(200).json({ appointments });
    } catch (error) {
      mError.e500(res, "Error al obtener las citas", error);
    }
  },

  getOne: async (req, res) => {
    try {
      const appointment = await sAppointment.getOne(req.params.id, req.user);

      res.status(200).json(appointment);
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);
      mError.e500(res, "Error al obtener la cita", error);
    }
  },

  update: async (req, res) => {
    try {
      const appointment = await sAppointment.update(
        req.params.id,
        req.body,
        req.user,
      );

      res.status(200).json({
        message: "Cita actualizada correctamente",
        appointment,
      });
    } catch (error) {
      if (error.status === 400) return mError.e400(res, error.message);
      if (error.status === 404) return mError.e404(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);
      mError.e500(res, "Error al actualizar la cita", error);
    }
  },

  delete: async (req, res) => {
    try {
      await sAppointment.delete(req.params.id, req.user);

      res.status(200).json({
        message: "Cita eliminada correctamente",
      });
    } catch (error) {
      if (error.status === 404) return mError.e404(res, error.message);
      if (error.status === 403) return mError.e403(res, error.message);
      mError.e500(res, "Error al eliminar la cita", error);
    }
  },
};

export default cAppointment;
