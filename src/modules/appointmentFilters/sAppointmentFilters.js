import { appointmentFiltersRepository } from "./appointmentFiltersRepository.js";

const sAppointmentFilters = {
  filterAppointments: async ({ status, startDate, endDate }) => {
    const filters = {};

    if (status) filters.status = status;

    if (startDate || endDate) {
      filters.date = {};

      if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) {
          const error = new Error("startDate inválido");
          error.status = 400;
          throw error;
        }
        filters.date.gte = start;
      }

      if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) {
          const error = new Error("endDate inválido");
          error.status = 400;
          throw error;
        }
        filters.date.lte = end;
      }
    }

    return appointmentFiltersRepository.filter(filters);
  },
};

export default sAppointmentFilters;
