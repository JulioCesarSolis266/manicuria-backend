import { jest } from "@jest/globals";

// ===== MOCK =====
jest.unstable_mockModule("./service.repository.js", () => ({
  serviceRepository: {
    findByName: jest.fn(),
    create: jest.fn(),
    findAllByUser: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    findFutureAppointmentConflict: jest.fn(),
  },
}));

// ===== IMPORTS =====
const { default: serviceService } = await import("./service.service.js");
const { serviceRepository } = await import("./service.repository.js");

describe("Service Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================
  // CREATE
  // =========================

  it("debería crear un servicio correctamente", async () => {
    serviceRepository.findByName.mockResolvedValue(null);

    const created = { id: 1 };
    serviceRepository.create.mockResolvedValue(created);

    const result = await serviceService.create(
      {
        name: "Manicura",
        price: 100,
        durationMinutes: 60,
      },
      { id: 10 },
    );

    expect(result).toEqual(created);

    expect(serviceRepository.create).toHaveBeenCalledWith({
      name: "Manicura",
      price: 100,
      durationMinutes: 60,
      category: null,
      description: null,
      userId: 10,
    });
  });

  it("debería fallar si ya existe el servicio", async () => {
    serviceRepository.findByName.mockResolvedValue({ id: 1 });

    await expect(
      serviceService.create({ name: "Manicura" }, { id: 10 }),
    ).rejects.toThrow("Ya existe un servicio con ese nombre");
  });

  // =========================
  // GET ONE
  // =========================

  it("debería devolver un servicio", async () => {
    const service = { id: 1, userId: 10 };

    serviceRepository.findById.mockResolvedValue(service);

    const result = await serviceService.getOne(1, {
      id: 10,
      role: "user",
    });

    expect(result).toEqual(service);
  });

  it("debería fallar si no existe", async () => {
    serviceRepository.findById.mockResolvedValue(null);

    await expect(
      serviceService.getOne(1, { id: 10, role: "user" }),
    ).rejects.toThrow("Servicio no encontrado");
  });

  it("debería fallar si no tiene permisos", async () => {
    serviceRepository.findById.mockResolvedValue({
      id: 1,
      userId: 99,
    });

    await expect(
      serviceService.getOne(1, { id: 10, role: "user" }),
    ).rejects.toThrow("No autorizado");
  });

  // =========================
  // UPDATE
  // =========================

  it("debería actualizar correctamente", async () => {
    const existing = { id: 1, userId: 10, name: "Old" };

    serviceRepository.findById.mockResolvedValue(existing);
    serviceRepository.findByName.mockResolvedValue(null);

    const updated = { id: 1 };
    serviceRepository.update.mockResolvedValue(updated);

    const result = await serviceService.update(
      1,
      { name: "New" },
      { id: 10, role: "user" },
    );

    expect(result).toEqual(updated);
  });

  it("debería fallar si no existe", async () => {
    serviceRepository.findById.mockResolvedValue(null);

    await expect(
      serviceService.update(1, {}, { id: 10, role: "user" }),
    ).rejects.toThrow("Servicio no encontrado");
  });

  it("debería fallar si no tiene permisos", async () => {
    serviceRepository.findById.mockResolvedValue({
      id: 1,
      userId: 99,
    });

    await expect(
      serviceService.update(1, {}, { id: 10, role: "user" }),
    ).rejects.toThrow("No autorizado");
  });

  it("debería fallar si el nombre ya está en uso", async () => {
    const existing = { id: 1, userId: 10, name: "Old" };

    serviceRepository.findById.mockResolvedValue(existing);
    serviceRepository.findByName.mockResolvedValue({ id: 2 });

    await expect(
      serviceService.update(1, { name: "Nuevo" }, { id: 10, role: "user" }),
    ).rejects.toThrow("Ya existe otro servicio con ese nombre");
  });

  // =========================
  // DELETE (desactivar)
  // =========================

  it("debería desactivar el servicio correctamente", async () => {
    const existing = { id: 1, userId: 10 };

    serviceRepository.findById.mockResolvedValue(existing);
    serviceRepository.findFutureAppointmentConflict.mockResolvedValue(null);

    const updated = { id: 1, isActive: false };
    serviceRepository.update.mockResolvedValue(updated);

    const result = await serviceService.delete(1, {
      id: 10,
      role: "user",
    });

    expect(result).toEqual(updated);

    expect(serviceRepository.update).toHaveBeenCalledWith(1, {
      isActive: false,
    });
  });

  it("debería fallar si no existe", async () => {
    serviceRepository.findById.mockResolvedValue(null);

    await expect(
      serviceService.delete(1, { id: 10, role: "user" }),
    ).rejects.toThrow("Servicio no encontrado");
  });

  it("debería fallar si no tiene permisos", async () => {
    serviceRepository.findById.mockResolvedValue({
      id: 1,
      userId: 99,
    });

    await expect(
      serviceService.delete(1, { id: 10, role: "user" }),
    ).rejects.toThrow("No autorizado");
  });

  it("debería fallar si tiene turnos futuros", async () => {
    serviceRepository.findById.mockResolvedValue({
      id: 1,
      userId: 10,
    });

    serviceRepository.findFutureAppointmentConflict.mockResolvedValue(true);

    await expect(
      serviceService.delete(1, { id: 10, role: "user" }),
    ).rejects.toThrow("No se puede desactivar: tiene turnos futuros");
  });

  // =========================
  // GET ALL
  // =========================

  it("debería traer servicios del usuario", async () => {
    serviceRepository.findAllByUser.mockResolvedValue([]);

    const result = await serviceService.getAll({ id: 10 }, true);

    expect(result).toEqual([]);
    expect(serviceRepository.findAllByUser).toHaveBeenCalledWith(10, true);
  });
});
