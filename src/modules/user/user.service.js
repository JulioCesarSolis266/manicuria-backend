import bcrypt from "bcryptjs";
import { userRepository } from "./user.repository.js";

const sUser = {
  getAll: async () => {
    return await userRepository.findAll();
  },

  getOne: async (id) => {
    const user = await userRepository.findByIdWithSelect(Number(id));

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

    const existingUser = await userRepository.findByUsernameOrPhone(
      username,
      phone,
    );

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

    return await userRepository.create({
      username,
      password: hashedPassword,
      phone,
      name: name || "Sin nombre",
      surname: surname || "Sin apellido",
      role: "user",
      forcePasswordReset: true,
    });
  },

  update: async (id, data) => {
    const user = await userRepository.findById(Number(id));

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

    return await userRepository.update(Number(id), updatedData);
  },

  deactivate: async (id) => {
    const user = await userRepository.findById(Number(id));

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return await userRepository.update(Number(id), {
      isActive: false,
    });
  },

  reactivate: async (id) => {
    const user = await userRepository.findById(Number(id));

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    return await userRepository.update(Number(id), {
      isActive: true,
    });
  },

  delete: async (id) => {
    const user = await userRepository.findById(Number(id));

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 404;
      throw error;
    }

    await userRepository.delete(Number(id));

    return true;
  },
};

export default sUser;
