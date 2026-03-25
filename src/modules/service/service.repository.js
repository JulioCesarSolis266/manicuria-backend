import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const serviceRepository = {
  findByName: (name, userId, excludeId) => {
    return prisma.service.findFirst({
      where: {
        name,
        isActive: true,
        userId,
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });
  },

  create: (data) => {
    return prisma.service.create({ data });
  },

  findAllByUser: (userId, includeInactive) => {
    return prisma.service.findMany({
      where: {
        userId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { name: "asc" },
    });
  },

  findById: (id) => {
    return prisma.service.findUnique({
      where: { id },
    });
  },

  update: (id, data) => {
    return prisma.service.update({
      where: { id },
      data,
    });
  },

  findFutureAppointmentConflict: (serviceId, now) => {
    return prisma.appointment.findFirst({
      where: {
        serviceId,
        date: { gte: now },
      },
    });
  },
};
