import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const appointmentFiltersRepository = {
  filter: (filters) =>
    prisma.appointment.findMany({
      where: filters,
      include: {
        client: true,
        createdBy: {
          select: { id: true, username: true },
        },
      },
    }),
};
