import { jest } from "@jest/globals";

// ===== MOCKS =====
jest.unstable_mockModule("./auth.repository.js", () => ({
  authRepository: {
    findUserById: jest.fn(),
    findByUsername: jest.fn(),
    findPhoneInUse: jest.fn(),
    updateUser: jest.fn(),
    createUser: jest.fn(),
  },
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
  },
}));

// ===== IMPORTS DINÁMICOS =====
const { default: authService } = await import("./auth.service.js");
const { authRepository } = await import("./auth.repository.js");
const bcrypt = (await import("bcryptjs")).default;
const jwt = (await import("jsonwebtoken")).default;

describe("Auth Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // REGISTER
  // =========================

  it("debería crear un usuario correctamente", async () => {
    const admin = { id: 1 };

    authRepository.findUserById.mockResolvedValue({ id: 1, role: "admin" });
    authRepository.findByUsername.mockResolvedValue(null);
    authRepository.findPhoneInUse.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashedPassword");

    const createdUser = { id: 10 };
    authRepository.createUser.mockResolvedValue(createdUser);

    const result = await authService.register(
      {
        name: "Juan",
        surname: "Perez",
        username: "juan",
        password: "1234",
        phone: "123",
      },
      admin,
    );

    expect(result).toEqual(createdUser);
  });

  it("debería fallar si no es admin", async () => {
    authRepository.findUserById.mockResolvedValue({ role: "user" });

    await expect(authService.register({}, { id: 1 })).rejects.toThrow(
      "Solo el administrador puede crear cuentas",
    );
  });

  it("debería fallar si faltan campos", async () => {
    authRepository.findUserById.mockResolvedValue({ role: "admin" });

    await expect(
      authService.register({ name: "Juan" }, { id: 1 }),
    ).rejects.toThrow(
      "Nombre, apellido, usuario, teléfono y contraseña son obligatorios",
    );
  });

  it("debería fallar si el usuario ya existe", async () => {
    authRepository.findUserById.mockResolvedValue({ role: "admin" });
    authRepository.findByUsername.mockResolvedValue({ id: 1, isActive: true });

    await expect(
      authService.register(
        {
          name: "Juan",
          surname: "Perez",
          username: "juan",
          password: "1234",
          phone: "123",
        },
        { id: 1 },
      ),
    ).rejects.toThrow("El usuario ya existe");
  });

  it("debería reactivar usuario inactivo", async () => {
    authRepository.findUserById.mockResolvedValue({ role: "admin" });

    const existingUser = { id: 5, isActive: false };
    authRepository.findByUsername.mockResolvedValue(existingUser);
    authRepository.findPhoneInUse.mockResolvedValue(false);

    bcrypt.hash.mockResolvedValue("hashed");

    const updated = { id: 5 };
    authRepository.updateUser.mockResolvedValue(updated);

    const result = await authService.register(
      {
        name: "Juan",
        surname: "Perez",
        username: "juan",
        password: "1234",
        phone: "123",
      },
      { id: 1 },
    );

    expect(result).toEqual(updated);
  });

  // =========================
  // LOGIN
  // =========================

  it("debería loguear correctamente", async () => {
    const user = {
      id: 1,
      username: "juan",
      password: "hashed",
      role: "user",
      isActive: true,
      forcePasswordReset: false,
    };

    authRepository.findByUsername.mockResolvedValue(user);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("token123");

    const result = await authService.login({
      username: "juan",
      password: "1234",
    });

    expect(result).toEqual({
      token: "token123",
      user: {
        id: 1,
        username: "juan",
        role: "user",
        forcePasswordReset: false,
      },
    });
  });

  it("debería fallar si faltan credenciales", async () => {
    await expect(authService.login({})).rejects.toThrow(
      "Usuario y contraseña son obligatorios",
    );
  });

  it("debería fallar si el usuario no existe", async () => {
    authRepository.findByUsername.mockResolvedValue(null);

    await expect(
      authService.login({ username: "x", password: "123" }),
    ).rejects.toThrow("Usuario no encontrado");
  });

  it("debería fallar si está desactivado", async () => {
    authRepository.findByUsername.mockResolvedValue({
      isActive: false,
    });

    await expect(
      authService.login({ username: "x", password: "123" }),
    ).rejects.toThrow("El usuario está desactivado");
  });

  it("debería fallar si la contraseña es incorrecta", async () => {
    authRepository.findByUsername.mockResolvedValue({
      isActive: true,
      password: "hashed",
    });

    bcrypt.compare.mockResolvedValue(false);

    await expect(
      authService.login({ username: "x", password: "123" }),
    ).rejects.toThrow("Contraseña incorrecta");
  });
});
