import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authRepository } from "./auth.repository.js";

const authService = {
  register: async (data, user) => {
    const { name, surname, username, password, role, phone } = data;

    const loggedUser = await authRepository.findUserById(user.id);

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

    const existingUser = await authRepository.findByUsername(usernameClean);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser && existingUser.isActive === false) {
      const phoneInUse = await authRepository.findPhoneInUse(
        phoneClean,
        existingUser.id,
      );

      if (phoneInUse) {
        const error = new Error("Ese teléfono ya está registrado");
        error.status = 400;
        throw error;
      }

      return await authRepository.updateUser(existingUser.id, {
        password: hashedPassword,
        phone: phoneClean,
        role: role || "user",
        isActive: true,
        forcePasswordReset: true,
      });
    }

    if (existingUser) {
      const error = new Error("El usuario ya existe");
      error.status = 400;
      throw error;
    }

    const existingPhone = await authRepository.findPhoneInUse(phoneClean);

    if (existingPhone) {
      const error = new Error("Ese teléfono ya está registrado");
      error.status = 400;
      throw error;
    }

    return await authRepository.createUser({
      name: nameClean,
      surname: surnameClean,
      username: usernameClean,
      password: hashedPassword,
      role: role || "user",
      phone: phoneClean,
      isActive: true,
      forcePasswordReset: true,
    });
  },

  login: async (data) => {
    const { username, password } = data;

    if (!username || !password) {
      const error = new Error("Usuario y contraseña son obligatorios");
      error.status = 400;
      throw error;
    }

    const user = await authRepository.findByUsername(username);

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

export default authService;
