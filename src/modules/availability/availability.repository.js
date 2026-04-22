import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const availabilityRepository = {
  // 🔹 Para SETTINGS (traer TODO, activos e inactivos)
  findByUser: (userId) =>
    prisma.availability.findMany({
      where: { userId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),

  // 🔹 Para lógica de turnos (solo activos)
  findByUserAndDay: (userId, dayOfWeek) =>
    prisma.availability.findMany({
      where: {
        userId,
        dayOfWeek,
        isActive: true,
      },
    }),

  // 🔹 Crear múltiples registros
  createMany: (data) =>
    prisma.availability.createMany({
      data,
    }),

  // 🔹 Eliminar disponibilidad de un usuario
  deleteByUser: (userId) =>
    prisma.availability.deleteMany({
      where: { userId },
    }),
};
