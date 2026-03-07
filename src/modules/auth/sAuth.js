import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sAuth = {
  register: async (data, user) => {
    const { name, surname, username, password, role, phone } = data;

    const loggedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!loggedUser || loggedUser.role !== "admin") {
      const error = new Error("Solo el administrador puede crear cuentas");
      error.status = 403;
      throw error;
    }

    if (!name || !surname || !username || !password || !phone) {
      const error = new Error(
        "Nombre, apellido, usuario, teléfono y contraseña son obligatorios",
      );
      error.status = 400;
      throw error;
    }

    const nameClean = name.trim();
    const surnameClean = surname.trim();
    const usernameClean = username.trim();
    const phoneClean = phone.trim();

    if (!nameClean || !surnameClean || !usernameClean || !phoneClean) {
      const error = new Error("Los campos no pueden estar vacíos");
      error.status = 400;
      throw error;
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: usernameClean },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser && existingUser.isActive === false) {
      const phoneInUse = await prisma.user.findFirst({
        where: {
          phone: phoneClean,
          NOT: { id: existingUser.id },
        },
      });

      if (phoneInUse) {
        const error = new Error("Ese teléfono ya está registrado");
        error.status = 400;
        throw error;
      }

      return await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          password: hashedPassword,
          phone: phoneClean,
          role: role || "user",
          isActive: true,
          forcePasswordReset: true,
        },
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
    }

    if (existingUser) {
      const error = new Error("El usuario ya existe");
      error.status = 400;
      throw error;
    }

    const existingPhone = await prisma.user.findFirst({
      where: { phone: phoneClean },
    });

    if (existingPhone) {
      const error = new Error("Ese teléfono ya está registrado");
      error.status = 400;
      throw error;
    }

    return await prisma.user.create({
      data: {
        name: nameClean,
        surname: surnameClean,
        username: usernameClean,
        password: hashedPassword,
        role: role || "user",
        phone: phoneClean,
        isActive: true,
        forcePasswordReset: true,
      },
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

  login: async (data) => {
    const { username, password } = data;

    if (!username || !password) {
      const error = new Error("Usuario y contraseña son obligatorios");
      error.status = 400;
      throw error;
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    if (user.isActive === false) {
      const error = new Error("El usuario está desactivado");
      error.status = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Contraseña incorrecta");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        forcePasswordReset: user.forcePasswordReset,
      },
    };
  },
};

export default sAuth;
