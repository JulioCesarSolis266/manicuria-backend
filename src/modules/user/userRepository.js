import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const userRepository = {
  findAll: () => {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        phone: true,
        role: true,
        createdAt: true,
        isActive: true,
      },
      orderBy: { createdAt: "desc" },
    });
  },

  findById: (id) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByIdWithSelect: (id) => {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        phone: true,
        role: true,
        createdAt: true,
        isActive: true,
      },
    });
  },

  findByUsernameOrPhone: (username, phone) => {
    return prisma.user.findFirst({
      where: {
        OR: [{ username }, { phone }],
      },
    });
  },

  create: (data) => {
    return prisma.user.create({
      data,
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  },

  update: (id, data) => {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        name: true,
        surname: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });
  },

  delete: (id) => {
    return prisma.user.delete({
      where: { id },
    });
  },
};
