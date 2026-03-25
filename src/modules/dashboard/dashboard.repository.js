import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dashboardRepository = {
  countClients: () => {
    return prisma.client.count();
  },

  countAllAppointments: () => {
    return prisma.appointment.count();
  },

  countAppointmentsByStatus: (status) => {
    return prisma.appointment.count({
      where: { status },
    });
  },
};
