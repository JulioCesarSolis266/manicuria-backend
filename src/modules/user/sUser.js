import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sUSer = {
  getAll: async () => {
    return await prisma.user.findMany({
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

  getOne: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
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

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return user;
  },

  create: async ({ username, phone, password, name, surname }) => {
    if (!username || !phone || !password) {
      const error = new Error(
        "Usuario, teléfono y contraseña son obligatorios",
      );
      error.status = 400;
      throw error;
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { phone }] },
    });

    if (existingUser) {
      if (!existingUser.isActive) {
        const error = new Error(
          "El usuario existe pero está desactivado. Reactívalo.",
        );
        error.status = 400;
        throw error;
      }

      const error = new Error("Usuario o teléfono ya registrados");
      error.status = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        phone,
        name: name || "Sin nombre",
        surname: surname || "Sin apellido",
        role: "user",
        forcePasswordReset: true,
      },
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

  update: async (id, data) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    const updatedData = {
      username: data.username ?? user.username,
      phone: data.phone ?? user.phone,
      name: data.name ?? user.name,
      surname: data.surname ?? user.surname,
    };

    if (data.password) {
      updatedData.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
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

  deactivate: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return await prisma.user.update({
      where: { id: Number(id) },
      data: { isActive: false },
      select: { id: true, username: true, isActive: true },
    });
  },

  reactivate: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return await prisma.user.update({
      where: { id: Number(id) },
      data: { isActive: true },
      select: { id: true, username: true, isActive: true },
    });
  },

  delete: async (id) => {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return true;
  },
};

export default sUSer;
