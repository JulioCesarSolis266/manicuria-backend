import errorMiddleware from "../../middlewares/error.middleware.js";
import clientService from "./appointmentFilters.service.js";
import { filterAppointmentsSchema } from "./appointmentFilters.schema.js";
import { ZodError } from "zod";

const appointmentFiltersController = {
  filter: async (req, res) => {
    try {
      // Validación de query params

      const validatedQuery = filterAppointmentsSchema.parse(req.query);

      const appointments =
        await clientService.filterAppointments(validatedQuery);

      if (appointments.length === 0) {
        return res.status(200).json({
          appointments: [],
          message: "No hay citas que coincidan con los filtros",
        });
      }

      res.status(200).json({ appointments });
    } catch (error) {
      // Manejo de errores de Zod
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 400,
          errors: error.issues.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        });
      }

      errorMiddleware.e500(res, "Error al filtrar citas", error);
    }
  },
};

export default appointmentFiltersController;
