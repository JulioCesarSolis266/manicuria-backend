import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sDashboard = {
  getStats: async () => {
    const totalClients = await prisma.client.count();

    const allAppointments = await prisma.appointment.count();

    const completedAppointments = await prisma.appointment.count({
      where: { status: "completed" },
    });

    const pendingAppointments = await prisma.appointment.count({
      where: { status: "pending" },
    });

    return {
      totalClients,
      allAppointments,
      completedAppointments,
      pendingAppointments,
    };
  },
};

export default sDashboard;
