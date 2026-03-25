import errorMiddleware from "../../middlewares/error.middleware.js";
import clientService from "./appointmentFilters.service.js";

//Lo que hace este controlador es recibir los filtros por query params, pasarlos al servicio y devolver las citas filtradas. Si no hay citas que coincidan con los filtros, devuelve un mensaje indicando que no hay citas. Recibe filtros como status, startDate y endDate. en el endpoint se pueden usar así: /api/appointments/filters?status=confirmed&startDate=2024-01-01&endDate=2024-12-31
const appointmentFiltersController = {
  filter: async (req, res) => {
    try {
      const { status, startDate, endDate } = req.query;

      const appointments = await clientService.filterAppointments({
        status,
        startDate,
        endDate,
      });

      if (appointments.length === 0) {
        return res.status(200).json({
          appointments: [],
          message: "No hay citas que coincidan con los filtros",
        });
      }

      res.status(200).json({ appointments });
    } catch (error) {
      errorMiddleware.e500(res, "Error al filtrar citas", error);
    }
  },
};

export default appointmentFiltersController;
