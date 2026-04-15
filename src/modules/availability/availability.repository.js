import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const availabilityRepository = {
  findByUser: (userId) =>
    prisma.availability.findMany({
      where: { userId, isActive: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),

  findByUserAndDay: (userId, dayOfWeek) =>
    prisma.availability.findMany({
      where: {
        userId,
        dayOfWeek,
        isActive: true,
      },
    }),

  createMany: (data) =>
    prisma.availability.createMany({
      data,
    }),

  deleteByUser: (userId) =>
    prisma.availability.deleteMany({
      where: { userId },
    }),
};
