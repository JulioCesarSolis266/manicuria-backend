import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const scheduleSettingsRepository = {
  findByUserId: (userId) =>
    prisma.scheduleSettings.findUnique({
      where: { userId },
    }),

  create: (data) =>
    prisma.scheduleSettings.create({
      data,
    }),

  update: (userId, data) =>
    prisma.scheduleSettings.update({
      where: { userId },
      data,
    }),
};
