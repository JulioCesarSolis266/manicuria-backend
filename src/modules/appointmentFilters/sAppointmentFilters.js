import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sAppointmentFilters = {
  filterAppointments: async ({ status, startDate, endDate }) => {
    const filters = {};

    if (status) filters.status = status;

    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.gte = new Date(startDate);
      if (endDate) filters.date.lte = new Date(endDate);
    }

    const appointments = await prisma.appointment.findMany({
      where: filters,
      include: {
        client: true,
        createdBy: { select: { id: true, username: true } },
      },
    });

    return appointments;
  },
};

export default sAppointmentFilters;
