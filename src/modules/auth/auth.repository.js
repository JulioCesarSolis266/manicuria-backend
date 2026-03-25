import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authRepository = {
  findUserById: (id) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  findByUsername: (username) => {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  findPhoneInUse: (phone, excludeUserId) => {
    return prisma.user.findFirst({
      where: {
        phone,
        ...(excludeUserId && { NOT: { id: excludeUserId } }),
      },
    });
  },

  createUser: (data) => {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  },

  updateUser: (id, data) => {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        surname: true,
        username: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
  },
};
