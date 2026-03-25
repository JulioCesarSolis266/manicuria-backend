import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const clientRepository = {
  create: (data) => {
    return prisma.client.create({ data });
  },

  findAllByUser: (userId) => {
    return prisma.client.findMany({
      where: { userId },
      include: { appointments: true },
      orderBy: { createdAt: "desc" },
    });
  },

  findByIdAndUser: (id, userId, includeAppointments = false) => {
    return prisma.client.findFirst({
      where: {
        id,
        userId,
      },
      ...(includeAppointments && { include: { appointments: true } }),
    });
  },

  update: (id, data) => {
    return prisma.client.update({
      where: { id },
      data,
    });
  },

  delete: (id) => {
    return prisma.client.delete({
      where: { id },
    });
  },
};
