import { jest } from "@jest/globals";

// ===== MOCKS =====
jest.unstable_mockModule("./user.repository.js", () => ({
  userRepository: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByIdWithSelect: jest.fn(),
    findByUsernameOrPhone: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn(),
  },
}));

// ===== IMPORTS =====
const { default: sUser } = await import("./user.service.js");
const { userRepository } = await import("./user.repository.js");
const bcrypt = (await import("bcryptjs")).default;

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // GET ONE
  // =========================

  it("debería devolver un usuario", async () => {
    const user = { id: 1 };

    userRepository.findByIdWithSelect.mockResolvedValue(user);

    const result = await sUser.getOne(1);

    expect(result).toEqual(user);
  });

  it("debería fallar si no existe", async () => {
    userRepository.findByIdWithSelect.mockResolvedValue(null);

    await expect(sUser.getOne(1)).rejects.toThrow("Usuario no encontrado");
  });

  // =========================
  // CREATE
  // =========================

  it("debería crear un usuario correctamente", async () => {
    userRepository.findByUsernameOrPhone.mockResolvedValue(null);

    bcrypt.hash.mockResolvedValue("hashed");

    const created = { id: 1 };
    userRepository.create.mockResolvedValue(created);

    const result = await sUser.create({
      username: "juan",
      phone: "123",
      password: "1234",
    });

    expect(result).toEqual(created);

    expect(userRepository.create).toHaveBeenCalledWith({
      username: "juan",
      password: "hashed",
      phone: "123",
      name: "Sin nombre",
      surname: "Sin apellido",
      role: "user",
      forcePasswordReset: true,
    });
  });

  it("debería fallar si faltan campos obligatorios", async () => {
    await expect(sUser.create({ username: "x" })).rejects.toThrow(
      "Usuario, teléfono y contraseña son obligatorios",
    );
  });

  it("debería fallar si el usuario ya existe", async () => {
    userRepository.findByUsernameOrPhone.mockResolvedValue({
      isActive: true,
    });

    await expect(
      sUser.create({
        username: "juan",
        phone: "123",
        password: "123",
      }),
    ).rejects.toThrow("Usuario o teléfono ya registrados");
  });

  it("debería fallar si el usuario existe pero está desactivado", async () => {
    userRepository.findByUsernameOrPhone.mockResolvedValue({
      isActive: false,
    });

    await expect(
      sUser.create({
        username: "juan",
        phone: "123",
        password: "123",
      }),
    ).rejects.toThrow("El usuario existe pero está desactivado. Reactívalo.");
  });

  // =========================
  // UPDATE
  // =========================

  it("debería actualizar usuario correctamente", async () => {
    const existing = {
      id: 1,
      username: "old",
      phone: "123",
      name: "A",
      surname: "B",
    };

    userRepository.findById.mockResolvedValue(existing);

    const updated = { id: 1 };
    userRepository.update.mockResolvedValue(updated);

    const result = await sUser.update(1, { name: "Nuevo" });

    expect(result).toEqual(updated);

    expect(userRepository.update).toHaveBeenCalledWith(1, {
      username: "old",
      phone: "123",
      name: "Nuevo",
      surname: "B",
    });
  });

  it("debería hashear contraseña si se envía", async () => {
    const existing = {
      id: 1,
      username: "old",
      phone: "123",
      name: "A",
      surname: "B",
    };

    userRepository.findById.mockResolvedValue(existing);

    bcrypt.hash.mockResolvedValue("hashed");

    userRepository.update.mockResolvedValue({});

    await sUser.update(1, { password: "1234" });

    expect(bcrypt.hash).toHaveBeenCalled();
  });

  it("debería fallar si no existe", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(sUser.update(1, {})).rejects.toThrow("Usuario no encontrado");
  });

  // =========================
  // DEACTIVATE / REACTIVATE
  // =========================

  it("debería desactivar usuario", async () => {
    userRepository.findById.mockResolvedValue({ id: 1 });
    userRepository.update.mockResolvedValue({});

    await sUser.deactivate(1);

    expect(userRepository.update).toHaveBeenCalledWith(1, {
      isActive: false,
    });
  });

  it("debería reactivar usuario", async () => {
    userRepository.findById.mockResolvedValue({ id: 1 });
    userRepository.update.mockResolvedValue({});

    await sUser.reactivate(1);

    expect(userRepository.update).toHaveBeenCalledWith(1, {
      isActive: true,
    });
  });

  it("debería fallar si no existe (deactivate)", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(sUser.deactivate(1)).rejects.toThrow("Usuario no encontrado");
  });

  // =========================
  // DELETE
  // =========================

  it("debería eliminar usuario correctamente", async () => {
    userRepository.findById.mockResolvedValue({ id: 1 });
    userRepository.delete.mockResolvedValue();

    const result = await sUser.delete(1);

    expect(result).toBe(true);
    expect(userRepository.delete).toHaveBeenCalledWith(1);
  });

  it("debería fallar si no existe", async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(sUser.delete(1)).rejects.toThrow("Usuario no encontrado");
  });

  // =========================
  // GET ALL
  // =========================

  it("debería traer todos los usuarios", async () => {
    userRepository.findAll.mockResolvedValue([]);

    const result = await sUser.getAll();

    expect(result).toEqual([]);
  });
});
